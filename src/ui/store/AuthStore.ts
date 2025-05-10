import { defineStore } from "pinia";
import { api, notify, validateForm, type ValidationRules } from "./helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "./userInfo";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore("authStore", () => {
  const tabOptions = ref([
    { label: "Login", value: "login" },
    { label: "Sign Up", value: "signup" },
  ]);

  const userSession = useUserStore();
  const currentTab = ref("login");
  const otp = ref("");

  const loginFormData = ref({
    email: "",
    password: "",
  });

  const signupForm = ref({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    age: "",
  });
  const router = useRouter();
  const isLoading = ref(false);
  const isError = ref(false);

  //================SIGNUPFORM=========================
  const handleSignUp = async () => {
    const data = signupForm.value;

    const validationRules: ValidationRules = {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: true, type: "email" },
      phoneNumber: { required: true },
      age: { required: true, type: "number" },
    };
    console.log(signupForm.value, "===>");
    const { valid, errors } = validateForm(data, validationRules);

    if (!valid) {
      const firstError = Object.values(errors)[0];
      notify(firstError, "error");
      return;
    }
    localStorage.setItem("otpEmail", data.email);
    try {
      const payload = {
        ...data,
        phoneNumber: String(data.phoneNumber),
        userName: `${data.firstName} ${data.lastName}`.trim(),
      };
      isLoading.value = true;
      const response = await api.post("api/auth/signup", payload);
      console.log(response.data);
      router.push("/verify-otp");
      isLoading.value = false;
    } catch (error: any) {
      console.log(error);
      isLoading.value = false;
      notify(error?.response?.data?.message || "Signup failed", "error");
    } finally {
      isLoading.value = false;
    }
  };

  //===============OTPVERIFICATION==================
  const verifyOTP = async (otp: string) => {
    const otpStr = String(otp);
    const validationRules: ValidationRules = {
      otp: { required: true, minLength: 6 },
    };
    const { valid, errors } = validateForm({ otp: otpStr }, validationRules);

    if (!valid) {
      const firstError = Object.values(errors)[0];
      notify(firstError, "error");
      return;
    }

    const payload = {
      email: signupForm.value.email,
      otp: otpStr,
    };

    isLoading.value = true;
    try {
      const response = await api.post("api/auth/verify-otp", payload);
      console.log(response.data);
      router.push("/set-password");
      isLoading.value = false;
    } catch (error) {
      isError.value = true;
      notify("OTP Verification Failed", "error");
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  //===============SET_PASSWORD==================

  const setNewPassword = async (password: string) => {
    if (password.length < 4) {
      notify("Password Length Must be Greater than 4", "info");
      return;
    }
    isLoading.value = true;
    const payload = {
      email: signupForm.value.email,
      password: password,
    };
    try {
      const response = await api.post("/api/auth/set-password", payload);
      isLoading.value = false;
      currentTab.value = "login";
      router.push("/login");
      console.log(response.data);
    } catch (error) {
      notify("Unable to set Password");
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  //===============Login_USER=========================

  const handleLogin = async () => {
    const data = loginFormData.value;

    const validationRules: ValidationRules = {
      email: { required: true },
      password: { required: true },
    };

    const { valid, errors } = validateForm(data, validationRules);

    if (!valid) {
      const firstError = Object.values(errors)[0];
      notify(firstError, "error");
      return;
    }

    isLoading.value = true;

    try {
      const response = await api.post("/api/auth/login", data);
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem("user", JSON.stringify(user));
      notify("Login successful", "success");
      userSession.setToken(accessToken);
      userSession.setUser(user);
      router.push({ name: "Dashboard" });
    } catch (error) {
      notify("Invalid email or password", "error");
    } finally {
      isLoading.value = false;
    }
  };

  //===========REQUEST_NEW_OTP===========================
  const requestNewOtp = async () => {
    isLoading.value = true;
    const payload = {
      email: signupForm.value.email,
    };
    try {
      const response = await api.post("api/auth/request-otp", payload);
      notify("OTP send to registered email address", "success");
      console.log(response.data);
      isLoading.value = false;
      isError.value = false;
    } catch (error) {
      isLoading.value = false;
      isError.value = false;
      otp.value = "";
      notify("Unable to send OTP", "error");
      router.push({ name: "Login" });
    } finally {
      isLoading.value = false;
    }
  };

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (e) {
      return false;
    }
  };

  return {
    signupForm,
    isLoading,
    isError,
    tabOptions,
    currentTab,
    otp,
    loginFormData,
    handleLogin,
    isTokenValid,
    requestNewOtp,
    handleSignUp,
    verifyOTP,
    setNewPassword,
  };
});
