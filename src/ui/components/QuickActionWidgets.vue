<script setup lang="ts">
import { Icon } from "@iconify/vue/dist/iconify.js";
import { ref } from "vue";
import router from "../routes";
import { generatePDF } from "../store/pdfGenerator";

const quickActions = ref([
  {
    id: "1",
    title: "Send Payment",
    value: "sendMoney",
    icon: "mdi:paper-airplane-outline",
    color: "#C68EFD60",
  },
  {
    id: "2",
    title: "Statement",
    value: "statement",
    icon: "mdi:file-pdf-box",
    color: "#FCB45460",
  },
  {
    id: "4",
    title: "New Payee",
    value: "dispute",
    icon: "mdi:add-bold",
    color: "#DCA06D60",
  },
  {
    id: "5",
    title: "Top Up",
    value: "topup",
    icon: "mdi:attach-money",
    color: "#FFF08570",
  },
  // {
  //   id: "3",
  //   title: "Support",
  //   value: "support",
  //   icon: "mdi:customer-service",
  //   color: "#88304E60",
  // },
]);

const emit = defineEmits([
  "openPymentModal",
  "openPayeeModal",
  "openTopUpModel",
]);

const sendPayment = () => {
  emit("openPymentModal", true);
};
const openStatement = () => {
  generatePDF();
};

const openSupport = () => {
  router.push("/support");
};

const openDispute = () => {
  emit("openPayeeModal", true);
};

const topUpMoney = () => {
  emit("openTopUpModel", true);
};

const handleActionClick = (value: string) => {
  switch (value) {
    case "sendMoney":
      sendPayment();
      break;
    case "statement":
      openStatement();
      break;
    case "support":
      openSupport();
      break;
    case "dispute":
      openDispute();
      break;
    case "topup":
      topUpMoney();
      break;
    default:
      console.log("Unknown action");
  }
};
</script>

<template>
  <section class="flex gap-2 items-center w-[450px] justify-between flex-wrap">
    <div
      v-for="item in quickActions"
      :key="item.id"
      @click="handleActionClick(item.value)"
      class="p-2 cursor-pointer text-white bg-gradient-to-r from-blue to-midDark h-30 hover:bg-midDark hover:scale-105 duration-100 shadow-md font-semibold w-[210px] flex items-center rounded-lg justify-center gap-3"
    >
      <Icon class="text-4xl" :icon="item.icon" />
      <h2>{{ item.title }}</h2>
    </div>
  </section>
</template>
