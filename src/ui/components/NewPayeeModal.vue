<script setup lang="ts">
import { ref } from "vue";
import Stepper from "./Stepper.vue";
import { Icon } from "@iconify/vue";
import CInput from "./CInput.vue";
import TransitionComponent from "./TransitionComponent.vue";
import { usePayeeStore } from "../store/PayeesStore";
// import { type AppUser } from "../store/interfaces";
import staticData from "../store/utils";
// import { useUserStore } from "../store/userInfo";
import Loading from "./Loading.vue";
import { notify } from "../store/helpers";

const emit = defineEmits(["close"]);
const emitClose = () => emit("close");

const payeeStore = usePayeeStore();
interface Step {
  id: string;
  title: string;
  value: string;
  icon: string;
}

const steps: Step[] = [
  { id: "1", title: "Select Payee", value: "step1", icon: "mdi:user-add" },
  { id: "2", title: "Select Amount", value: "step2", icon: "mdi:verified" },
];

const currentStep = ref(0);
const accountNumber = ref("");
const payeeName = ref("");

// const payeeNotFound = ref(false);
// const userStore = useUserStore();

// const searchPayee = () => {
//   if (accountNumber.value.length < 5) {
//     notify("Enter a valid Account Number", "error");
//     return;
//   }

//   if (payeeName.value.length < 1) {
//     notify("Enter a valid User Name", "error");
//     return;
//   }

//   const foundUser = payeeStore.allAppUsers.find(
//     (item) =>
//       item.userId === accountNumber.value &&
//       item.userName?.toLowerCase() === payeeName.value.toLowerCase()
//   );
//   const currentUserId = userStore.user?.userId;

//   if (!foundUser || foundUser.userId === currentUserId) {
//     payeeNotFound.value = true;

//     const message = !foundUser
//       ? "Payee not found"
//       : "You cannot add yourself as a payee";

//     notify(message, "error");
//     return;
//   }

//   newPayee.value = foundUser;
//   payeeNotFound.value = false;
//   currentStep.value = 1;
// };
const validateUserName = (): boolean => {
  const searched = payeeStore.searchedPayee;

  if (!searched) return false;

  const inputName = payeeName.value.replace(/\s+/g, "").toLowerCase();

  console.log(inputName);
  return (
    searched.userName?.toLowerCase() === inputName ||
    searched.firstName?.toLowerCase() === inputName ||
    searched.lastName?.toLowerCase() === inputName
  );
};

const handleSearch = async () => {
  if (payeeName.value.trim().length < 1) {
    notify("Enter a valid User Name", "error");
    return;
  }

  const success = await payeeStore.serarchNewPayee(accountNumber.value);

  if (success && validateUserName()) {
    currentStep.value = 1;
  } else {
    notify("Username not found", "error");
  }
};

const stepBack = () => {
  currentStep.value = Math.max(currentStep.value - 1, 0);
};
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    @click.self="emitClose"
  >
    <div
      class="bg-primary overflow-hidden flex flex-col items-center justify-center gap-8 rounded-xl p-6 w-1/3 shadow-lg"
    >
      <section class="w-full flex items-center gap-3">
        <button
          v-if="currentStep > 0"
          @click="stepBack"
          class="text-3xl hover:bg-midDark duration-150 cursor-pointer bg-blue rounded-full text-white"
        >
          <Icon icon="mdi:keyboard-arrow-left" />
        </button>
        <h2 class="text-xl text-accent font-semibold">Add New Payee</h2>
      </section>

      <section class="w-full">
        <Stepper :steps="steps" :currentStep="currentStep" />
      </section>

      <TransitionComponent mode="out-in" transition="slide" :step="currentStep">
        <template #step0>
          <section v-if="!payeeStore.isLoading" class="w-full space-y-5">
            <h2 class="text-xl text-accent font-semibold">
              Enter Account Number
            </h2>
            <CInput
              v-model="accountNumber"
              placeholder="Account Number"
              icon="mdi:bank"
              width="w-full"
              type="text"
              focused
            />
            <CInput
              v-model="payeeName"
              placeholder="Name"
              icon="mdi:user"
              width="w-full"
              type="text"
              focused
            />
            <button
              @click="handleSearch"
              class="w-full h-10 rounded-md bg-blue text-white hover:bg-midDark duration-200 cursor-pointer font-bold"
            >
              Next
            </button>
          </section>
          <Loading v-else />
        </template>
        <template #step1>
          <section v-if="!payeeStore.isLoading" class="w-full">
            <div class="px-14 py-3 text-midDark bg-gray rounded-xl space-y-5">
              <div class="flex items-center justify-center">
                <img
                  :src="
                    payeeStore.searchedPayee?.imageUrl || staticData.userImage
                  "
                  class="h-20 w-20 object-cover object-top rounded-full border-accent border"
                />
              </div>
              <div class="flex justify-between w-full">
                <h3 class="text-xl font-semibold">User Name :</h3>
                <h3 class="text-xl font-semibold capitalize">
                  {{ payeeStore.searchedPayee?.userName }}
                </h3>
              </div>
              <div class="flex justify-between w-full">
                <h3 class="text-xl font-semibold">Account Number :</h3>
                <h3 class="text-xl font-semibold">
                  {{ payeeStore.searchedPayee?._id }}
                </h3>
              </div>
              <button
                @click="payeeStore.addnewPayee(accountNumber)"
                class="w-full h-10 rounded-md bg-blue text-white hover:bg-midDark duration-200 cursor-pointer font-bold"
              >
                Confirm
              </button>
            </div>
          </section>
          <Loading v-else />
        </template>
      </TransitionComponent>
    </div>
  </div>
</template>
