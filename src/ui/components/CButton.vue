<script setup lang="ts">
import { Icon } from "@iconify/vue";

const emit = defineEmits<{
  (e: "click"): void;
}>();

const props = defineProps<{
  width?: string;
  height?: string;
  color?: string;
  textColor?: string;
  rounded?: string;
  disabled?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}>();

const width = props.width || "w-full";
const height = props.height || "h-12";
const color = props.color || "bg-accent";
const textColor = props.textColor || "text-white";
const rounded = props.rounded || "rounded-md";
const iconPos = props.iconPosition || "left";
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center gap-2 text-white bg-dark px-4 font-semibold cursor-pointer',
      width,
      height,
      color,
      textColor,
      rounded,
      'transition duration-200 ease-in-out hover:opacity-90',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
    @click="emit('click')"
  >
    <Icon v-if="icon && iconPos === 'left'" :icon="icon" class="w-5 h-5" />
    <slot />
    <Icon v-if="icon && iconPos === 'right'" :icon="icon" class="w-5 h-5" />
  </button>
</template>
