<script setup lang="ts">
import CreditCard from "../components/CreditCard.vue";
import Header from "../components/Header.vue";
import QuickActionWidgets from "../components/QuickActionWidgets.vue";
import SendPaymentModal from "../components/SendPaymentModal.vue";
import Table from "../components/Table.vue";
import LineChart2 from "../components/LineChart2.vue";
import NewPayeeModal from "../components/NewPayeeModal.vue";
import TopUpModal from "../components/TopUpModal.vue";
import { addnewPyeeModal, sendMoneyModal, topUpModal } from "../store/Scopes";
import { onMounted, ref } from "vue";
import { useTransactionsStore } from "../store/TransactionsStore";
import Loading from "../components/Loading.vue";
import { usePayeeStore } from "../store/PayeesStore";
import { useUserStore } from "../store/userInfo";
import { useActivityLogs } from "../store/ActivityLogs";
import LeafLetMap from "../components/LeafLetMap.vue";

const columns = [
  { key: "sender", label: "Sent By" },
  { key: "receivedBy", label: "Sent To" },

  { key: "amount", label: "Amount" },
  { key: "message", label: "Type" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
];

const isPageLoading = ref(true);

const transactionStore = useTransactionsStore();
const payeeStore = usePayeeStore();
const userSession = useUserStore();
const logs = useActivityLogs();

onMounted(async () => {
  try {
    if (!userSession.user && localStorage.getItem("accessToken")) {
      await userSession.updateUserInfo();
    }

    if (!userSession.userIsAuthenticated) {
      return (window.location.href = "/login");
    }

    await Promise.all([
      payeeStore.getUserPayees(),
      transactionStore.GetAllUsersTransactions(),
      transactionStore.getCreditHistory(),
      logs.getActivityLogs(),
    ]);
  } catch (error) {
    console.error("Error loading home data:", error);
  } finally {
    isPageLoading.value = false;
  }
});
</script>

<template>
  <main class="p-4 space-y-6">
    <!-- Page Loading -->
    <Loading v-if="isPageLoading" class="w-full" />

    <!-- Main Content -->
    <template v-else>
      <!-- Header -->
      <section
        class="sticky top-0 z-50 bg-gradient-to-r from-blue to-midDark text-white p-4 shadow rounded-xl"
      >
        <Header />
      </section>

      <!-- Top Widgets -->
      <section class="flex flex-col lg:flex-row gap-6">
        <div class="w-full lg:w-1/3">
          <CreditCard />
        </div>

        <div class="w-full lg:w-1/3">
          <QuickActionWidgets
            @openPymentModal="sendMoneyModal = true"
            @openPayeeModal="addnewPyeeModal = true"
            @open-top-up-model="topUpModal = true"
          />
        </div>

        <div class="w-full lg:w-1/3">
          <LineChart2 />
        </div>
      </section>

      <!-- Transactions Table -->
      <!-- Transactions Table + Map side-by-side -->
      <section class="flex flex-col lg:flex-row gap-6">
        <!-- Table: 1/2 width -->
        <div class="w-full lg:w-1/2 bg-primary text-white p-6 rounded-xl">
          <h2 class="text-xl font-semibold mb-4">Recent Transactions</h2>
          <Table
            v-if="!transactionStore.isLoading"
            :columns="columns"
            :rows="transactionStore.currentUserAllTransaction"
            :rowsPerPage="5"
            :loggedUserId="userSession.user?.userId"
          />
          <Loading v-else class="mt-4" />
        </div>

        <!-- Map: 1/2 width -->
        <div class="w-full lg:w-1/2 p-6 rounded-xl">
          <h2 class="text-lg font-semibold text-white mb-4">Login History</h2>
          <LeafLetMap />
        </div>
      </section>

      <!-- Modals -->
      <SendPaymentModal v-if="sendMoneyModal" @close="sendMoneyModal = false" />
      <NewPayeeModal v-if="addnewPyeeModal" @close="addnewPyeeModal = false" />
      <TopUpModal v-if="topUpModal" @close="topUpModal = false" />
    </template>
  </main>
</template>
