<script setup lang="ts">
import CInput from "../components/CInput.vue";
import CButton from "../components/CButton.vue";
import Tabs from "../components/Tabs.vue";

import Loading from "../components/Loading.vue";
import { useAuthStore } from "../store/AuthStore";
import PhoneInput from "../components/PhoneInput.vue";

const authStore = useAuthStore();
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
        <form
          v-if="authStore.currentTab === 'login'"
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
        <!-- Sign Up Form -->
        <form v-else @submit.prevent="authStore.handleSignUp" class="space-y-5">
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
          <CInput
            v-model="authStore.signupForm.email"
            placeholder="Email"
            type="email"
            required
            icon="mdi:email"
            width="w-full"
          />
          <!-- <CInput
            type="number"
            v-model="authStore.signupForm.phoneNumber"
            placeholder="Phone Number"
            icon="mdi:phone"
            width="w-full"
            required
          /> -->

          <PhoneInput v-model="authStore.signupForm.phoneNumber" />
          <CInput
            type="number"
            v-model="authStore.signupForm.age"
            placeholder="age"
            icon="mdi:numeric-9-plus-circle-outline"
            width="w-full"
            required
          />

          <CButton
            type="submit"
            width="w-full"
            height="h-10"
            color="bg-accent"
            textColor="text-black"
          >
            Sign Up
          </CButton>
        </form>
      </div>
    </Transition>
    <Loading v-else />
  </main>
</template>
