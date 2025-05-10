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
import { onMounted } from "vue";
import { useTransactionsStore } from "../store/TransactionsStore";
import Loading from "../components/Loading.vue";
import { usePayeeStore } from "../store/PayeesStore";
import { useUserStore } from "../store/userInfo";

const columns = [
  { key: "sender", label: "Sent By" },
  { key: "receivedBy", label: "Sent To" },

  { key: "amount", label: "Amount" },
  { key: "message", label: "Type" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
  // { key: "time", label: "Time" },
];
const transactionStore = useTransactionsStore();
const payeeStore = usePayeeStore();
const userSession = useUserStore();

onMounted(async () => {
  await Promise.all([
    payeeStore.getAllUsers(),
    transactionStore.GetAllUsersTransactions(),
    transactionStore.getCreditHistory(),
  ]);
});
</script>

<template>
  <main class="grid grid-cols-1 gap-4 py-2">
    <section
      class="sticky top-0 z-50 md:col-span-4 bg-gradient-to-r from-blue to-midDark text-white p-4 shadow rounded-xl"
    >
      <Header />
    </section>

    <section class="flex items-start gap-10">
      <CreditCard class="col-span-1" />
      <QuickActionWidgets
        @openPymentModal="sendMoneyModal = true"
        @openPayeeModal="addnewPyeeModal = true"
        @open-top-up-model="topUpModal = true"
      />
      <LineChart2 class="flex-1" />
    </section>
    <!-- 
    <section class="grid grid-cols-1 gap-4">
      <div
        class="col-span-1 space-y-5 bg-primary text-white p-4 shadow rounded-xl"
      >
        <h2 class="text-xl font-semibold mb-4">Account Details</h2>
        <div class="flex flex-col lg:flex-row gap-5 items-center">
          <CreditCard />
        </div>
      </div>

      <div class="bg-primary text-white p-4 shadow rounded-xl">
        <h2 class="text-xl font-semibold mb-4">Actions</h2>
        <QuickActionWidgets
          @openPymentModal="sendMoneyModal = true"
          @openPayeeModal="addnewPyeeModal = true"
          @open-top-up-model="topUpModal = true"
        />
      </div>
    </section> -->

    <!-- Full-Width Table -->
    <section class="md:col-span-4 bg-primary text-white p-4 shadow rounded-xl">
      <h2 class="text-xl font-semibold mb-4">Recent Transactions</h2>
      <Table
        v-if="!transactionStore.isLoading"
        :columns="columns"
        :rows="transactionStore.currentUserAllTransaction"
        :rowsPerPage="5"
        :loggedUserId="userSession.user?.userId"
      />
      <Loading v-else />
    </section>

    <!-- Bottom Full-Width Payees -->
    <!-- <section class="md:col-span-4 bg-primary text-white p-4 shadow rounded-xl">
      <h2 class="text-xl font-semibold mb-4">Payees</h2>
      <PayeeCard />
    </section> -->

    <!-- Modals -->
    <SendPaymentModal v-if="sendMoneyModal" @close="sendMoneyModal = false" />
    <NewPayeeModal v-if="addnewPyeeModal" @close="addnewPyeeModal = false" />
    <TopUpModal v-if="topUpModal" @close="topUpModal = false" />
  </main>
</template>
