import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api, type UserInterface } from "./helpers";

export const useUserStore = defineStore("user/store", () => {
  const router = useRouter();
  const isLoading = ref(false);

  const user = ref<UserInterface | null>(null);
  const token = ref<string | null>(null);
  const userIsAuthenticated = ref(false);

  const setUser = (userData: UserInterface) => {
    user.value = userData;
    userIsAuthenticated.value = true;
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  //========UpdateUser====================

  const updateUserInfo = async () => {
    try {
      isLoading.value = false;
      const response = await api.get("/api/users/");
      // console.log(response.data);
      setUser(response.data.data);
      // notify("Userinfo Updated Successfully", "info");
    } catch (error) {
      isLoading.value = false;
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    user.value = null;
    token.value = null;
    userIsAuthenticated.value = false;

    router.push("/login");
  };

  return {
    user,
    token,
    userIsAuthenticated,
    isLoading,
    setUser,
    updateUserInfo,
    setToken,
    logout,
  };
});
