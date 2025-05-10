<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import privateRoutes from "../routes/PrivateRoutes";

const isExpanded = ref(true);
const toggleSidebar = () => (isExpanded.value = !isExpanded.value);

const sidebarRoutes = computed(() =>
  privateRoutes.filter(
    (route) => route.name && !route.redirect && route.name !== "Admin"
  )
);

const route = useRoute();
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div
      :class="[
        'bg-midDark text-white transition-all duration-300 flex-shrink-0',
        isExpanded ? 'w-64' : 'w-16',
        'h-screen fixed top-0 left-0 z-50',
      ]"
    >
      <div class="flex justify-between items-center p-4">
        <span v-if="isExpanded" class="text-lg font-semibold">Menu</span>
        <button @click="toggleSidebar" class="text-white">
          <Icon icon="mdi:microsoft-xbox-controller-menu" class="text-4xl" />
        </button>
      </div>

      <ul
        class="mt-14 space-y-2 flex flex-col items-start justify-between ml-4"
      >
        <li
          v-for="r in sidebarRoutes"
          :key="r.path"
          :class="[
            'p-2 rounded w-full',
            route.path === r.path
              ? 'bg-blue font-semibold'
              : 'hover:bg-gray-700',
          ]"
        >
          <router-link
            :to="r.path"
            class="flex items-center space-x-5 text-white w-full"
          >
            <Icon :icon="r.meta?.icon || 'mdi:chevron-right'" class="text-xl" />
            <span v-if="isExpanded">{{ r.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <main
      class="flex-1 px-5 py-4 overflow-y-auto h-screen transition-all duration-300"
      :class="isExpanded ? 'ml-64' : 'ml-16'"
    >
      <slot />
    </main>
  </div>
</template>
