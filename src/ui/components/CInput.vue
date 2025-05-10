<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Placeholder...",
  },
  icon: {
    type: String,
    default: "", // e.g., 'mdi:email'
  },
  width: {
    type: String,
    default: "w-full",
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
});

// Support both string and number types
const modelValue = defineModel<string | number>();

// Handle input events based on type
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  if (props.type === "number") {
    modelValue.value = target.valueAsNumber;
  } else {
    modelValue.value = target.value;
  }
}
</script>

<template>
  <div :class="['relative text-white', props.width]">
    <!-- Icon inside input -->
    <Icon
      v-if="props.icon"
      :icon="props.icon"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text pointer-events-none"
    />
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      :value="modelValue"
      @input="handleInput"
      :class="[
        'border border-gray-300 rounded-md w-full bg-transparent focus:outline-none',
        'pl-10', // space for the icon
        'p-3',
      ]"
    />
  </div>
</template>
