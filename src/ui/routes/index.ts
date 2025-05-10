import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import publicRoutes from "./publicRoutes";
import privateRoutes from "./PrivateRoutes";
import { useUserStore } from "../store/userInfo";

const router = createRouter({
  history:
    import.meta.env.MODE === "development"
      ? createWebHistory()
      : createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes],
});

router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();

  // Restore user info if accessToken exists
  if (!userStore.user && localStorage.getItem("accessToken")) {
    await userStore.updateUserInfo();
  }

  // Block unauthenticated access
  if (to.meta.requiresAuth && !userStore.userIsAuthenticated) {
    return next("/login");
  }

  // Redirect admin to /admin only if they go to root or dashboard
  if (
    userStore.userIsAuthenticated &&
    userStore.user?.role === "admin" &&
    ["/", "/dashboard"].includes(to.path)
  ) {
    return next("/admin");
  }

  next();
});

export default router;
