<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import BaseLayout from "@/layouts/BaseLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
const route = useRoute();

const layouts: Record<string, any> = {
  BaseLayout,
  AuthLayout,
};

const layoutComponent = computed(() => {
  const layout = route.meta.layout as string;
  return layouts[layout] || layouts.BaseLayout;
});
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<style></style>
