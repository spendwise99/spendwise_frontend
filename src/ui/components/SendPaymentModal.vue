<script setup lang="ts">
import { ref } from "vue";
import Stepper from "./Stepper.vue";
import Tabs from "./Tabs.vue";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { notify, validatePayee } from "../store/helpers";
import CInput from "./CInput.vue";
import TransitionComponent from "./TransitionComponent.vue";
import { useUserStore } from "../store/userInfo";
import { usePayeeStore } from "../store/PayeesStore";
import type { AppUser, Payee } from "../store/interfaces";
import staticData from "../store/utils";
import { useTransactionsStore } from "../store/TransactionsStore";
import Loading from "./Loading.vue";

const emit = defineEmits(["close"]);
const emitClose = () => emit("close");

const userStore = useUserStore();
const payeeStore = usePayeeStore();
const transactionStore = useTransactionsStore();

const steps = [
  { id: "1", title: "Select Payee", value: "step1", icon: "mdi:user-add" },
  { id: "2", title: "Select Amount", value: "step2", icon: "mdi:euro" },
  { id: "3", title: "Confirm", value: "step3", icon: "mdi:tick-circle" },
];

const tabOptions = [
  { label: "Existing User", value: "existing" },
  { label: "New User", value: "newuser" },
];

const paymentOptions = ref({
  currentTab: "existing",
  currentStep: 0,
  selectedUser: "",
  amount: "",
  message: "",
});

const validatedPayee = ref<Partial<AppUser>>({});
// const validatedPayee = ref(null);

const onUserSelection = () => {
  const { currentStep, selectedUser, amount } = paymentOptions.value;

  if (currentStep === 0 && !selectedUser) {
    return notify("Please select a user", "error");
  }

  if (currentStep === 1) {
    const numericAmount = Number(amount);
    const userBalance = userStore.user?.balance ?? 0;

    if (!amount || numericAmount <= 0) {
      return notify("Please enter a valid amount", "error");
    }

    if (numericAmount > userBalance) {
      return notify("Insufficient balance", "error");
    }

    const result = validatePayee(selectedUser);
    if (!result) {
      return notify("Invalid payee selected", "error");
    }
    validatedPayee.value = result;
  }

  if (currentStep === 2) {
    console.log(paymentOptions.value, "=====>");
    emitClose();
  } else {
    paymentOptions.value.currentStep++;
  }
};

const stepBack = () =>
  (paymentOptions.value.currentStep = Math.max(
    paymentOptions.value.currentStep - 1,
    0
  ));

const handleSendPayment = () => {
  transactionStore.SendPayment(
    paymentOptions.value.amount,
    paymentOptions.value.selectedUser,
    paymentOptions.value.message
  );
  paymentOptions.value.amount = "";
  paymentOptions.value.message = "";
  paymentOptions.value.selectedUser = "";
};
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    @click.self="emitClose"
  >
    <div
      class="bg-primary no-scrollbar flex flex-col items-center justify-center gap-8 overflow-hidden overflow-y-visible rounded-xl p-6 w-1/3 shadow-lg"
    >
      <section class="w-full flex items-center gap-3">
        <button
          v-if="paymentOptions.currentStep > 0"
          @click="stepBack"
          class="text-3xl hover:bg-midDark duration-150 cursor-pointer bg-blue rounded-full text-white"
        >
          <Icon icon="mdi:keyboard-arrow-left" />
        </button>
        <h2 class="text-xl font-semibold text-accent">Send Payment</h2>
      </section>

      <section class="w-full">
        <Stepper :steps="steps" :currentStep="paymentOptions.currentStep" />
      </section>

      <TransitionComponent
        :step="paymentOptions.currentStep"
        transition="slide"
        mode="out-in"
      >
        <!-- Step 0 -->
        <template #step0>
          <section class="w-full">
            <Tabs
              :tabs="tabOptions"
              v-model="paymentOptions.currentTab"
              size="sm"
              :fullWidth="true"
              class="mb-6"
            />
          </section>

          <section class="w-full text-accent space-y-5">
            <h2 class="font-semibold">
              {{
                paymentOptions.currentTab === "existing"
                  ? "Select User"
                  : "Enter User's Account Number"
              }}
            </h2>

            <v-select
              v-if="paymentOptions.currentTab === 'existing'"
              v-model="paymentOptions.selectedUser"
              :options="payeeStore.userPayeesList"
              :reduce="(user: Payee) => user._id"
              label="userName"
              class="w-full text-accent focus:text-accent"
              placeholder="Search..."
            />

            <CInput
              v-else
              v-model="paymentOptions.selectedUser"
              placeholder="Account Number"
              icon="mdi:bank"
              width="w-full"
              type="text"
              focused
            />

            <button
              @click="onUserSelection"
              class="w-full h-10 mt-10 rounded-md bg-blue text-white hover:bg-midDark duration-200 cursor-pointer font-bold"
            >
              Next
            </button>
          </section>
        </template>

        <!-- Step 1 -->
        <template #step1>
          <section class="w-full mt-5 flex items-center flex-col">
            <div
              class="flex items-center text-accent flex-col gap-1 w-fit p-2 rounded-lg font-semibold"
            >
              Available balance
              <h3 class="text-2xl">£ {{ userStore.user?.balance }}</h3>
            </div>
            <div class="space-y-5 w-full">
              <CInput
                v-model="paymentOptions.amount"
                placeholder="Enter Amount"
                icon="mdi:cash-100"
                width="w-full"
                type="number"
                required
              />
              <button
                @click="onUserSelection"
                class="w-full h-10 rounded-md bg-blue text-white hover:bg-midDark duration-200 cursor-pointer font-bold"
              >
                Next
              </button>
            </div>
          </section>
        </template>

        <!-- Step 2 -->
        <template #step2>
          <section
            v-if="!transactionStore.isLoading"
            class="w-full mt-10 space-y-5"
          >
            <div
              class="w-full rounded-lg space-y-3 shadow-sm bg-accent p-3 px-10"
            >
              <div class="flex items-center justify-center">
                <img
                  :src="validatedPayee.imageUrl || staticData.userImage"
                  class="h-20 w-20 object-cover object-top rounded-full border border-accent"
                />
              </div>
              <div class="flex justify-between font-semibold text-midDark">
                <h2>User Name:</h2>
                <h2>{{ validatedPayee.userName }}</h2>
              </div>
              <div class="flex justify-between font-semibold text-midDark">
                <h2>Account Number:</h2>
                <h2>{{ validatedPayee.userId }}</h2>
              </div>
              <div class="flex justify-between font-semibold text-midDark">
                <h2>Amount:</h2>
                <h2>RS: {{ paymentOptions.amount }}</h2>
              </div>
            </div>
            <textarea
              v-model="paymentOptions.message"
              class="border border-gray p-2 text-accent rounded-lg h-20 w-full"
              placeholder="Message..."
            />
            <button
              @click="handleSendPayment"
              class="w-full h-10 rounded-md bg-blue text-white hover:bg-midDark duration-200 cursor-pointer font-bold"
            >
              Confirm
            </button>
          </section>
          <Loading v-else />
        </template>
      </TransitionComponent>
    </div>
  </div>
</template>
