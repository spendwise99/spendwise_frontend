<script setup lang="ts">
import { ref, watch } from "vue";
import { defineProps } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectedCountry = ref<"PK" | "GB">("PK");
const phoneNumber = ref("");

const countries = {
  PK: { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  GB: { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
};

watch([selectedCountry, phoneNumber], () => {
  const full = `${countries[selectedCountry.value].code}${phoneNumber.value}`;
  emit("update:modelValue", full);
});

watch(
  () => props.modelValue,
  (val) => {
    for (const key of Object.keys(countries) as ("PK" | "GB")[]) {
      const prefix = countries[key].code;
      if (val?.startsWith(prefix)) {
        selectedCountry.value = key;
        phoneNumber.value = val.replace(prefix, "");
        break;
      }
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
      <select
        v-model="selectedCountry"
        class="px-3 py-2 text-sm border-r appearance-none focus:outline-none"
      >
        <option value="PK">🇵🇰 +92</option>
        <option value="GB">🇬🇧 +44</option>
      </select>

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
