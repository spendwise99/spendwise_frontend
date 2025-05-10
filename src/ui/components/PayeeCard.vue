<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import Loading from "./Loading.vue";
import staticData from "../store/utils";
import { usePayeeStore } from "../store/PayeesStore";

const payeeStore = usePayeeStore();

const dropdownVisible = ref<string | null>(null);

const toggleDropdown = (id: string) => {
  dropdownVisible.value = dropdownVisible.value === id ? null : id;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".payee-dropdown")) {
    dropdownVisible.value = null;
  }
};

onMounted(() => {
  payeeStore.getUserPayees();
  payeeStore.userPayeesList = [];
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <main>
    <div
      v-if="!payeeStore?.isLoading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    >
      <div
        v-for="payee in payeeStore?.userPayeesList"
        :key="payee._id"
        class="relative bg-gradient-to-r from-blue to-midDark via-90% rounded-xl shadow hover:shadow-lg transition-all duration-200 p-4 flex items-center gap-4"
      >
        <img
          :src="payee.imageUrl || staticData.userImage"
          alt="Payee image"
          class="w-16 h-16 rounded-full object-cover object-top border border-gray-200"
        />
        <div class="flex-1 overflow-hidden">
          <h3 class="text-base font-semibold capitalize text-white truncate">
            {{ payee.userName }}
          </h3>
          <h2 class="text-xs text-white truncate">{{ payee.email }}</h2>
          <h2 class="text-sm text-white truncate">{{ payee._id }}</h2>
        </div>

        <div class="relative payee-dropdown">
          <Icon
            icon="mdi:dots-vertical"
            class="text-2xl text-gray-500 cursor-pointer"
            @click.stop="toggleDropdown(payee._id)"
          />
          <div
            v-if="dropdownVisible === payee._id"
            class="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg z-50"
          >
            <ul class="text-sm text-gray-700">
              <li
                class="px-4 py-2 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                @click="payeeStore.deletePayee(payee._id)"
              >
                <Icon icon="mdi:delete-empty" /> Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Loading v-else />
    <div class="w-full text-center py-5 text-xl">
      <h3 v-if="payeeStore?.userPayeesList.length == 0">No Pyees Added yet</h3>
    </div>
  </main>
</template>
