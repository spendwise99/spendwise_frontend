<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import router from "../routes";
import { useUserStore } from "../store/userInfo";
import staticData from "../store/utils";

const userStore = useUserStore();

const handleNavigate = () => {
  router.push("/profile");
};
const handleReload = () => {
  window.location.reload();
};
</script>

<template>
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold">Spend Wise</h2>
    <div class="flex items-center gap-3">
      <button
        @click="userStore.logout"
        class="bg-red-500 flex items-center gap-2 text-white rounded-full px-5 font-semibold shadow-md h-8 hover:bg-red-400 cursor-pointer"
      >
        Logout
        <Icon icon="mdi:logout" />
      </button>
      <button
        @click="handleReload"
        class="bg-accent p-2 cursor-pointer shadow-md rounded-full text-2xl flex items-center justify-center px-2 text-white"
      >
        <Icon icon="mdi:reload" />
      </button>
      <img
        @click="handleNavigate"
        :src="userStore.user?.imageUrl || staticData.userImage"
        class="rounded-full h-12 w-12 object-cover border-2 object-top shadow-md border-accent cursor-pointer"
      />
    </div>
  </div>
</template>
