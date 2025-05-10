<script setup lang="ts">
import { ref } from "vue";
import CButton from "../components/CButton.vue";
import CInput from "../components/CInput.vue";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/Loading.vue";

const password = ref("");
const authStore = useAuthStore();
</script>

<template>
  <section class="flex items-center justify-center">
    <form
      v-if="!authStore.isLoading"
      @submit.prevent="authStore.setNewPassword(password)"
      class="flex flex-col gap-5"
    >
      <h2 class="text-4xl text-accent text-center">Enter New Password</h2>

      <CInput
        placeholder="Enter new Password"
        type="text"
        v-model="password"
        icon="mdi:password"
      />
      <CButton
        type="submit"
        width="w-full"
        height="h-10"
        color="bg-accent"
        textColor="text-white"
        >Save</CButton
      >
    </form>
    <Loading v-else />
  </section>
</template>
