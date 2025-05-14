<script setup lang="ts">
import { ref } from "vue";
import CInput from "../components/CInput.vue";
import CButton from "../components/CButton.vue";
import Tabs from "../components/Tabs.vue";
import Loading from "../components/Loading.vue";
import { useAuthStore } from "../store/AuthStore";
import PhoneInput from "../components/PhoneInput.vue";
import { clearAllLocalStorage, notify } from "../store/helpers";

const authStore = useAuthStore();

const step = ref(1);

const emailOtp = ref("");
const phoneOtp = ref("");
const password = ref("");

const allowedDomains = ["gmail.com", "yahoo.com", "yopmail.com"];

const verifyEmail = async () => {
  const email = authStore.signupForm.email.trim();
  const domain = email.split("@")[1];

  if (!email || !allowedDomains.includes(domain)) {
    notify(
      "Only gmail.com, yahoo.com, and yopmail.com emails are allowed.",
      "error"
    );
    return;
  }

  const success = await authStore.SendOTP("EMAIL", email);
  if (success) step.value = 2;
};

const verifyEmailOtp = async () => {
  const success = await authStore.ValidateOTP(
    "EMAIL",
    emailOtp.value,
    authStore.signupForm.email
  );
  if (success) step.value = 3;
};

const verifyPhone = async () => {
  const phone = authStore.signupForm.phoneNumber;
  if (!phone) {
    notify("Please enter a valid phone number", "error");
    return;
  }

  const success = await authStore.SendOTP("MOBILE", phone);
  if (success) step.value = 4;
};

const verifyPhoneOtp = async () => {
  const phone = authStore.signupForm.phoneNumber;
  const success = await authStore.ValidateOTP("MOBILE", phoneOtp.value, phone);
  if (success) step.value = 5;
};

const completeSignUp = async () => {
  const success = await authStore.handleNewSignUp();
  if (success) {
    step.value = 6;
  }
};

const submitPassword = async () => {
  const isValid = validatePassword(password.value);
  if (!isValid) return;

  await authStore.setNewPassword(password.value);

  clearAllLocalStorage();
  authStore.currentTab = "login";
  step.value = 1;
};

const validatePassword = (pwd: string): boolean => {
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  if (pwd.length < 8) {
    notify("Password must be at least 8 characters long", "error");
    return false;
  }

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    notify(
      "Password must include uppercase, lowercase, number, and special character",
      "error"
    );
    return false;
  }

  return true;
};
</script>

<template>
  <main class="w-3/4 max-w-md mx-auto">
    <h2 class="text-6xl text-accent text-center mb-10">Spend Wise</h2>

    <Tabs
      v-if="!authStore.isLoading"
      :tabs="authStore.tabOptions"
      v-model="authStore.currentTab"
      size="sm"
      :fullWidth="true"
      class="mb-6"
    />

    <Transition
      v-if="!authStore.isLoading"
      name="fade"
      mode="out-in"
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div :key="authStore.currentTab">
        <!-- Login Form -->
        <!-- Login Form -->
        <div v-if="authStore.currentTab === 'login'">
          <div v-if="authStore.isLocked" class="text-red-600 text-center py-4">
            Your account is locked. Please try again after 24 hours.
          </div>
          <form
            v-else
            @submit.prevent="authStore.handleLogin"
            class="space-y-5"
          >
            <CInput
              v-model="authStore.loginFormData.email"
              placeholder="Enter your email"
              icon="mdi:email"
              width="w-full"
            />
            <CInput
              type="password"
              v-model="authStore.loginFormData.password"
              placeholder="Enter your password"
              icon="mdi:lock"
              width="w-full"
            />
            <CButton
              type="submit"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Login
            </CButton>
          </form>
        </div>

        <!-- Sign Up Form (Step-by-step) -->
        <form v-else @submit.prevent="" class="space-y-5">
          <!-- Step 1: Enter Email -->
          <template v-if="step === 1">
            <CInput
              v-model="authStore.signupForm.email"
              placeholder="Enter your email"
              type="email"
              icon="mdi:email"
              required
              width="w-full"
            />
            <CButton
              @click="verifyEmail"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Verify Email
            </CButton>
          </template>

          <!-- Step 2: Email OTP -->
          <template v-else-if="step === 2">
            <CInput
              v-model="emailOtp"
              placeholder="Enter Email OTP"
              type="text"
              icon="mdi:lock-check"
              required
              width="w-full"
            />
            <CButton
              @click="verifyEmailOtp"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Verify OTP
            </CButton>
          </template>

          <!-- Step 3: Enter Phone -->
          <template v-else-if="step === 3">
            <PhoneInput v-model="authStore.signupForm.phoneNumber" />
            <CButton
              @click="verifyPhone"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Verify Phone
            </CButton>
          </template>

          <!-- Step 4: Phone OTP -->
          <template v-else-if="step === 4">
            <CInput
              v-model="phoneOtp"
              placeholder="Enter Phone OTP"
              type="text"
              icon="mdi:lock-check"
              required
              width="w-full"
            />
            <CButton
              @click="verifyPhoneOtp"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Verify OTP
            </CButton>
          </template>

          <!-- Step 5: Final Info -->
          <template v-else-if="step === 5">
            <CInput
              v-model="authStore.signupForm.firstName"
              placeholder="First Name"
              icon="mdi:user"
              width="w-full"
              required
            />
            <CInput
              v-model="authStore.signupForm.lastName"
              placeholder="Last Name"
              icon="mdi:user"
              width="w-full"
              required
            />

            <CButton
              @click="completeSignUp"
              type="submit"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Submit
            </CButton>
          </template>

          <template v-else-if="step === 6">
            <CInput
              v-model="password"
              type="password"
              placeholder="Create Password"
              icon="mdi:lock"
              width="w-full"
            />
            <CButton
              @click="submitPassword"
              width="w-full"
              height="h-10"
              color="bg-accent"
              textColor="text-black"
            >
              Set Password
            </CButton>
          </template>
        </form>
      </div>
    </Transition>

    <Loading v-else />
  </main>
</template>
