<script setup lang="ts">
import { Icon } from "@iconify/vue";
import router from "../routes";

const handleBack = () => {
  router.back();
};
</script>

<template>
  <button
    @click="handleBack"
    class="flex absolute top-3 left-3 items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
  >
    <Icon icon="mdi:arrow-left" class="text-xl" />
  </button>
</template>
