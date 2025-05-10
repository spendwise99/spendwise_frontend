<script setup lang="ts">
import CButton from "../components/CButton.vue";
import CInput from "../components/CInput.vue";
import { useAuthStore } from "../store/AuthStore";
import Loading from "../components/Loading.vue";
import { watch } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Redirect if email is empty
watch(
  () => authStore.signupForm.email,
  (newEmail) => {
    if (newEmail === "") {
      router.push("/login");
    }
  }
);
console.log(authStore.isError);
</script>

<template>
  <section class="flex justify-center items-center">
    <!-- Loading Spinner -->
    <Loading v-if="authStore.isLoading" />

    <!-- Main OTP Input Form -->
    <form
      v-else-if="!authStore.isError"
      @submit.prevent="authStore.verifyOTP(authStore.otp)"
      class="flex flex-col gap-5"
    >
      <h2 class="text-4xl text-white text-center">Enter OTP</h2>
      <span class="text-white"
        >Otp has been sent to your registered email address</span
      >
      <CInput
        placeholder="Enter OTP"
        type="number"
        v-model="authStore.otp"
        icon="mdi:verified-user"
      />
      <CButton
        type="submit"
        width="w-full"
        height="h-10"
        color="bg-accent"
        textColor="text-white"
      >
        Submit
      </CButton>
    </form>

    <!-- Resend OTP Section when Error Occurs -->
    <form
      v-else
      @submit.prevent="authStore.requestNewOtp"
      class="flex flex-col gap-5"
    >
      <h2 class="text-4xl text-accent text-center">OTP Verification Failed</h2>
      <span>OTP expired or incorrect. Please request a new one.</span>
      <CButton
        type="submit"
        width="w-full"
        height="h-10"
        color="bg-accent"
        textColor="text-black"
      >
        Resend OTP
      </CButton>
    </form>
  </section>
</template>
