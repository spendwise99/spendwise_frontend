<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/userInfo";
import { useAdminStore } from "../store/AdminStore";
import { usePayeeStore } from "../store/PayeesStore";
import staticData from "../store/utils";
import Loading from "../components/Loading.vue";

const router = useRouter();
const userSession = useUserStore();
const adminStore = useAdminStore();
const payeeStore = usePayeeStore();

onMounted(async () => {
  if (userSession.user?.role !== "admin") {
    router.push("/dashboard");
  }

  try {
    await Promise.all([
      adminStore.getAllTransactions(),
      adminStore.getSupportEmails(),
      payeeStore.getAllUsers(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const searchQuery = ref("");
const filterUsers = computed(() => {
  return payeeStore.allAppUsers.filter((item) =>
    item.userName?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const supportSearch = ref("");

const filterQueries = computed(() =>
  adminStore.allQueries.filter(
    (item) =>
      item.email.toLowerCase().includes(supportSearch.value.toLowerCase()) ||
      item.subject.toLowerCase().includes(supportSearch.value.toLowerCase())
  )
);
</script>

<template>
  <main class="grid md:grid-cols-4 mx-auto gap-6 p-6">
    <section
      class="sticky top-0 z-50 col-span-4 bg-white p-6 shadow-lg rounded-xl"
    >
      <Header />
    </section>

    <section
      v-if="!adminStore.isLoading"
      class="bg-white shadow rounded-xl col-span-4 md:col-span-2 p-6"
    >
      <div class="text-2xl font-semibold text-gray-800 mb-6 border-b-2 pb-3">
        <h2>Total Transactions Summary</h2>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Total Transactions:</strong>
            {{ adminStore.usersAndTransactionSummary.totalTransactions }}
          </p>
          <p class="text-lg text-gray-600">
            <strong>Completed Transactions:</strong>
            {{ adminStore.usersAndTransactionSummary.completedTransactions }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Failed Transactions:</strong>
            {{ adminStore.usersAndTransactionSummary.failedTransactions }}
          </p>
          <p class="text-lg text-gray-600">
            <strong>Total Amount Transferred:</strong> ${{
              adminStore.usersAndTransactionSummary.totalAmountTransferred.toFixed(
                2
              )
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Unique Users:</strong>
            {{ adminStore.usersAndTransactionSummary.uniqueUsers }}
          </p>
          <p class="text-lg text-gray-600">
            <strong>Verified Users:</strong>
            {{ adminStore.usersAndTransactionSummary.verifiedUsers }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Unverified Users:</strong>
            {{ adminStore.usersAndTransactionSummary.unverifiedUsers }}
          </p>
          <p class="text-lg text-gray-600">
            <strong>Total Admins:</strong>
            {{ adminStore.usersAndTransactionSummary.totalAdmins }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Total Regular Users:</strong>
            {{ adminStore.usersAndTransactionSummary.totalRegularUsers }}
          </p>
          <p class="text-lg text-gray-600">
            <strong>Highest Transaction:</strong> ${{
              adminStore.usersAndTransactionSummary.highestTransaction.toFixed(
                2
              )
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p class="text-lg text-gray-600">
            <strong>Average Transaction:</strong> ${{
              adminStore.usersAndTransactionSummary.averageTransaction.toFixed(
                2
              )
            }}
          </p>
        </div>

        <div
          v-if="adminStore.usersAndTransactionSummary.mostActiveSender"
          class="bg-gray-100 p-4 rounded-xl mt-6"
        >
          <p class="text-lg font-semibold text-gray-800">
            <strong>Most Active Sender:</strong>
            {{
              adminStore.usersAndTransactionSummary.mostActiveSender.userName
            }}
            with
            {{
              adminStore.usersAndTransactionSummary.mostActiveSender
                .transactionCount
            }}
            transactions
          </p>
        </div>
        <div v-else class="bg-gray-100 p-4 rounded-xl mt-6">
          <p class="text-lg text-gray-600">No active sender found</p>
        </div>
      </div>
    </section>
    <Loading v-else />
    <section
      v-if="!adminStore.isLoading"
      class="col-span-4 md:col-span-1 flex flex-col gap-2 h-[500px] no-scrollbar rounded-xl overflow-y-auto"
    >
      <div
        class="sticky top-0 shadow rounded-xl bg-white p-4 flex items-center gap-4 justify-between text-lg font-semibold"
      >
        App Users List
        <input
          type="text"
          v-model="searchQuery"
          class="border border-gray text-sm py-1 rounded-full px-2 flex-1"
          placeholder="Search..."
        />
      </div>
      <div
        v-for="user in filterUsers"
        :key="user.userId"
        class="bg-white rounded-lg shadow p-2 flex flex-col items-start justify-center"
      >
        <div class="flex items-center gap-2 justify-center">
          <div>
            <img
              :src="user.imageUrl || staticData.userImage"
              alt="User Image"
              class="w-12 h-12 object-top object-cover rounded-full mb-4"
            />
          </div>
          <div class="flex flex-col gap-0">
            <h2 class="text-md font-semibold mb-2">{{ user.userName }}</h2>
            <!-- <h2 class="text-sm text-gray-500 mb-2">{{ user.email }}</h2> -->
            <h2 class="text-sm text-gray-500 mb-2">{{ user.userId }}</h2>
          </div>
        </div>
        <!-- <p class="text-sm text-gray-500">Role: {{ user.role }}</p> -->
      </div>
    </section>
    <Loading v-else />
    <section
      v-if="!adminStore.isLoading"
      class="col-span-4 md:col-span-1 flex flex-col gap-2 h-[500px] no-scrollbar rounded-xl overflow-y-auto"
    >
      <div
        class="sticky top-0 shadow rounded-xl bg-white p-4 flex items-center gap-4 justify-between text-lg font-semibold"
      >
        Customer Queries
        <input
          type="text"
          v-model="supportSearch"
          class="border border-gray text-sm py-1 rounded-full px-2 flex-1"
          placeholder="Search..."
        />
      </div>
      <div
        v-for="item in filterQueries"
        :key="item._id"
        class="bg-white rounded-lg shadow p-2 flex flex-col items-start justify-center"
      >
        <div class="flex items-center gap-2 justify-center">
          <div class="flex flex-col gap-0">
            <h2 class="text-md font-semibold mb-2">Email : {{ item.email }}</h2>
            <h2 class="text-sm underline text-gray-500 mb-2">
              Subject : {{ item.subject }}
            </h2>
            <h2 class="text-sm text-gray-500 mb-2">
              Message : {{ item.message.slice(0, 40) }}
            </h2>
          </div>
        </div>
        <!-- <p class="text-sm text-gray-500">Role: {{ user.role }}</p> -->
      </div>
    </section>
    <Loading v-else />
  </main>
</template>
