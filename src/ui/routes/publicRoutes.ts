import type { RouteRecordRaw } from "vue-router";

const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/screens/LoginScreen.vue"),
    meta: { layout: "AuthLayout" },
  },
  {
    path: "/regiseration",
    name: "Registeration",
    component: () => import("@/screens/RegistrationScreen.vue"),
    meta: { layout: "AuthLayout" },
  },
  {
    path: "/verify-otp",
    name: "VerifyOTP",
    component: () => import("@/screens/OTPScreen.vue"),
    meta: { layout: "AuthLayout" },
  },
  {
    path: "/set-password",
    name: "SetPasword",
    component: () => import("@/screens/SetPasswordScreen.vue"),
    meta: { layout: "AuthLayout" },
  },
];

export default publicRoutes;
