<script setup lang="ts">
import { ref } from "vue";
import Stepper from "./Stepper.vue";
import { Icon } from "@iconify/vue"; // Shorter import
import { notify } from "../store/helpers";
import CInput from "./CInput.vue";
import TransitionComponent from "./TransitionComponent.vue";
import { usePayeeStore } from "../store/PayeesStore";
import Loading from "./Loading.vue";

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
  { id: "1", title: "Select Amount", value: "step1", icon: "mdi:attach-money" },
  { id: "2", title: "Confirm", value: "step2", icon: "mdi:verified" },
];

const currentStep = ref(0);
const topUpAmount = ref("");

const handleTopUp = () => {
  if (topUpAmount.value.length < 3) {
    notify("Topup Amount can't be less then 100", "error");
    return;
  }
  currentStep.value = 1;
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
      <section class="w-full flex text-accent items-center gap-3">
        <button
          v-if="currentStep > 0"
          @click="stepBack"
          class="text-3xl hover:bg-midDark duration-150 cursor-pointer bg-blue rounded-full text-white"
        >
          <Icon icon="mdi:keyboard-arrow-left" />
        </button>
        <h2 class="text-xl font-semibold">Top Up Balance</h2>
      </section>

      <section class="w-full">
        <Stepper :steps="steps" :currentStep="currentStep" />
      </section>

      <TransitionComponent mode="out-in" transition="slide" :step="currentStep">
        <template #step0>
          <section class="w-full text-accent space-y-5">
            <h2 class="text-xl font-semibold">Enter Amount</h2>
            <CInput
              v-model="topUpAmount"
              placeholder="Amount"
              icon="mdi:attach-money"
              width="w-full"
              type="text"
              focused
            />
            <button
              @click="handleTopUp"
              class="w-full h-10 rounded-md bg-blue text-white hover:bg-indigo-300 duration-200 cursor-pointer font-bold"
            >
              Next
            </button>
          </section>
        </template>
        <template #step1>
          <section
            v-if="!payeeStore.isLoading"
            class="w-full text-accent space-y-5"
          >
            <h3 class="text-xl font-semibold">You are About to Topup</h3>
            <h3 class="text-xl font-semibold">RS : {{ topUpAmount }}</h3>
            <button
              @click="payeeStore.topupAmount(topUpAmount)"
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
