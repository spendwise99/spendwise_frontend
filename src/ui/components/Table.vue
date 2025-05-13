<script setup lang="ts">
import { ref, computed, watch } from "vue";
import staticData from "../store/utils";
import type { SimplifiedTransaction } from "../store/interfaces";

const props = defineProps<{
  columns: { key: string; label: string }[];
  rows: SimplifiedTransaction[];
  rowsPerPage?: number;
  loggedUserId?: string;
}>();

const currentPage = ref(1);
const perPage = ref(props.rowsPerPage || 4);

const totalPages = computed(() => Math.ceil(props.rows.length / perPage.value));

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return props.rows.slice(start, start + perPage.value);
});

watch(
  () => props.rows,
  () => {
    currentPage.value = 1;
  }
);

function getTransactionType(
  senderID: string,
  receiverID: string,
  message: string
): string {
  if (message.toLowerCase().includes("top-up")) {
    return "Top-Up";
  }

  if (senderID === props.loggedUserId) {
    return "Debited";
  } else if (receiverID === props.loggedUserId) {
    return "Credited";
  }

  return "Other";
}
</script>

<template>
  <div class="w-full overflow-x-auto">
    <table class="min-w-full text-left border border-gray-300 rounded-md">
      <thead
        class="bg-gradient-to-r from-blue to-midDark text-sm text-white uppercase"
      >
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="py-2 px-4 border-b border-gray-300"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in paginatedRows"
          :key="index"
          class="hover:bg-gray-600"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="py-2 px-4 border-b border-gray-200"
          >
            <template v-if="col.key === 'transactionID'">
              {{ row.transactionID.slice(0, 8) }}...
            </template>

            <template v-else-if="col.key === 'sender'">
              <div class="flex items-center gap-2">
                <img
                  :src="row.senderImage || staticData.userImage"
                  alt="Sender"
                  class="w-8 h-8 rounded-full object-cover object-top"
                />
                <span>{{ row.sender }}</span>
              </div>
            </template>

            <template v-else-if="col.key === 'receivedBy'">
              <div class="flex items-center gap-2">
                <img
                  :src="row.receiverImage || staticData.userImage"
                  alt="Recipient"
                  class="w-8 h-8 rounded-full object-cover object-top"
                />
                <span>{{ row.receivedBy }}</span>
              </div>
            </template>

            <template v-else-if="col.key === 'message'">
              {{
                getTransactionType(row.senderID, row.receiverID, row.message)
              }}
            </template>

            <template v-else-if="col.key === 'status'">
              <span
                :class="{
                  'text-green-600': row.status === 'completed',
                  'text-yellow-600': row.status === 'pending',
                  'text-red-600': row.status === 'failed',
                }"
              >
                {{ row.status }}
              </span>
            </template>

            <template v-else>
              {{ row[col.key as keyof SimplifiedTransaction] }}
            </template>
          </td>
        </tr>

        <tr v-if="!rows.length">
          <td
            :colspan="columns.length"
            class="text-center h-52 py-4 text-white"
          >
            <h2>No Record Found</h2>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4 text-sm text-white">
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 bg-gray rounded hover:bg-gray-600"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Prev
        </button>
        <button
          class="px-3 py-1 bg-gray rounded hover:bg-gray-600"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
