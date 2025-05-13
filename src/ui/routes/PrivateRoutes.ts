import type { RouteRecordRaw } from "vue-router";

const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/screens/HomeScreen.vue"),
    meta: {
      layout: "BaseLayout",
      requiresAuth: true,
      icon: "mdi:view-dashboard",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/screens/UserProfileScreen.vue"),
    meta: {
      layout: "BaseLayout",
      requiresAuth: true,
      icon: "mdi:account",
    },
  },

  {
    path: "/payees",
    name: "Payees",
    component: () => import("@/screens/PayeesScreen.vue"),
    meta: {
      layout: "BaseLayout",
      requiresAuth: true,
      icon: "mdi:users",
    },
  },

  {
    path: "/support",
    name: "Support",
    component: () => import("@/screens/SupportScreen.vue"),
    meta: {
      layout: "BaseLayout",
      requiresAuth: true,
      icon: "mdi:lifebuoy",
    },
  },

  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/screens/AdminScreen.vue"),
    meta: {
      layout: "BaseLayout",
      requiresAuth: true,
      icon: "mdi:shield-account",
    },
  },
];

export default privateRoutes;
