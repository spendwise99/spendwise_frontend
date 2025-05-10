<script setup lang="ts">
import { computed } from "vue";
import router from "../routes";
import { useUserStore } from "../store/userInfo";
import staticData from "../store/utils";
import { Icon } from "@iconify/vue";
import { notify } from "../store/helpers";

// Get the user store
const userSession = useUserStore();

// Safely access the user object using computed
const user = computed(() => userSession.user);

// Handle card click
const handleCardClick = () => {
  router.push("/profile");
};

// Copy account number
const copyAccountNumber = async () => {
  if (!user.value?.userId) return;

  try {
    await navigator.clipboard.writeText(user.value.userId);
    notify("Account No Copied");
  } catch (err) {
    notify("Unable To Copy Account Number", "error");
  }
};
</script>
masterCardLogo
<template>
  <div
    v-if="user"
    @click="handleCardClick"
    class="min-w-[450px] max-w-[450px] h-64 cursor-pointer bg-gradient-to-r from-blue via-70% to-midDark p-5 rounded-md"
  >
    <div class="flex justify-end">
      <img :src="staticData.visaLogo" class="w-16 mt[-10px]" />
    </div>

    <div class="mt-10 space-y-3">
      <h2 class="text-white text-sm tracking-widest">Account Number</h2>
      <h2
        @click.stop="copyAccountNumber"
        class="text-white text-md flex items-center gap-3"
        style="letter-spacing: 6px"
      >
        {{ user.userId }} <Icon icon="mdi:content-copy" />
      </h2>
    </div>

    <div class="flex justify-between mt-5 items-center">
      <section>
        <h2 class="text-white text-md tracking-widest">
          {{ user.firstName }} {{ user.lastName }}
        </h2>
        <h2 class="text-white text-sm tracking-widest">{{ user.email }}</h2>
      </section>
      <section>
        <h2 class="text-xl text-white font-semibold">£ {{ user.balance }}</h2>
      </section>
    </div>
  </div>
</template>
