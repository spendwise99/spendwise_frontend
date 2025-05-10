<script setup lang="ts">
const props = defineProps<{
  tabs: { label: string; value: string }[];
  modelValue: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  color?: "accent" | "gray"; // Add more as needed
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-5 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

function selectTab(value: string) {
  emit("update:modelValue", value);
}

const colorMap = {
  accent: {
    base: "bg-blue-500",
    textActive: "text-black",
    textInactive: "text-accent-600 hover:text-accent-800",
  },
  gray: {
    base: "bg-dark",
    textActive: "text-gray-900",
    textInactive: "text-white hover:text-gray-600 cursor-pointer",
  },
};

const theme = colorMap[props.color || "gray"];
</script>

<template>
  <div
    :class="[
      'inline-flex p-1 rounded-md shadow-inner transition-all',
      fullWidth ? 'w-full justify-between' : '',
      theme.base,
    ]"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      @click="selectTab(tab.value)"
      :class="[
        'font-medium rounded-md transition-all duration-200',
        sizes[size || 'md'],
        fullWidth ? 'flex-1 text-center' : '',
        modelValue === tab.value
          ? ['bg-white shadow', theme.textActive]
          : theme.textInactive,
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
