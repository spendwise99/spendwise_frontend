<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import type { PropType } from "vue";

interface Step {
  id: string;
  title: string;
  value: string;
  icon: string;
}

const props = defineProps({
  steps: {
    type: Array as PropType<Step[]>,
    required: true,
  },
  currentStep: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="flex items-center">
    <template v-for="(item, index) in props.steps" :key="item.id">
      <div
        :style="{
          color: props.currentStep >= index ? '#3A59D1' : '#ccc',
          backgroundColor: props.currentStep >= index ? '#AFDDFF' : '',
        }"
        class="flex items-center border justify-center rounded-full p-4 transition-all duration-500 ease-in-out"
      >
        <Icon :icon="item.icon" width="24" height="24" />
      </div>

      <div
        v-if="index !== props.steps.length - 1"
        :style="{
          backgroundColor: index < props.currentStep ? '#FFA955' : '#F7CFD8',
        }"
        class="flex-1 h-1.5 mx-1 rounded-sm transition-all duration-500 ease-in-out"
      ></div>
    </template>
  </div>
</template>
