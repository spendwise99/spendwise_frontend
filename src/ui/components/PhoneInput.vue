<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectedCountry = ref<"GB">("GB");
const phoneNumber = ref("");

const countries = {
  GB: { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
};

watch([selectedCountry, phoneNumber], () => {
  const full = `${countries[selectedCountry.value].code}${phoneNumber.value}`;
  emit("update:modelValue", full);
});

watch(
  () => props.modelValue,
  (val) => {
    const prefix = countries.GB.code;
    if (val?.startsWith(prefix)) {
      selectedCountry.value = "GB";
      phoneNumber.value = val.replace(prefix, "");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div
      class="flex items-center border border-gray-300 rounded-md text-white overflow-hidden"
    >
      <span class="px-3 py-2 text-sm border-r select-none">🇬🇧 +44</span>
      <input
        v-model="phoneNumber"
        type="tel"
        pattern="[0-9]*"
        placeholder="Enter phone number"
        class="flex-1 px-3 py-2 text-sm focus:outline-none h-12 border-none text-white"
      />
    </div>
  </div>
</template>
