import { defineStore } from "pinia";
import { api, notify } from "./helpers";
import { ref } from "vue";
import {
  type AllUsersResponse,
  type Payee,
  type PayeeApiResponse,
} from "./interfaces";
import { useUserStore } from "./userInfo";
import { addnewPyeeModal, topUpModal } from "./Scopes";
import { useTransactionsStore } from "./TransactionsStore";

export const usePayeeStore = defineStore("payeeStore", () => {
  const userPayeesList = ref<Payee[]>([]);
  const isLoading = ref(false);
  const userStore = useUserStore();
  const transactionsStore = useTransactionsStore();

  const getUserPayees = async () => {
    try {
      isLoading.value = true;
      const response = await api.get<PayeeApiResponse>("/api/payees/");
      // console.log(response.data.data);
      userPayeesList.value = response.data.data;
    } catch (error) {
      console.error(error);
      console.log(error);
      // notify("Unable to get user payees");
    } finally {
      isLoading.value = false;
    }
  };

  const addnewPayee = async (id: string) => {
    const payload = {
      payeeId: id,
    };

    try {
      isLoading.value = true;
      const response = await api.post("/api/payees/", payload);
      console.log(response.data);
      notify("Payee Added Successfully", "success");
      getUserPayees();
      isLoading.value = false;
      addnewPyeeModal.value = false;
    } catch (error) {
      notify("User Already Added", "error");
      addnewPyeeModal.value = false;
      console.log(error);
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  const deletePayee = async (id: string) => {
    const payload = {
      payeeId: id,
    };

    try {
      isLoading.value = true;
      await api.delete("/api/payees/", {
        data: payload,
      });
      getUserPayees();
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      notify("Unable to delete payee");
    } finally {
      isLoading.value = false;
    }
  };

  const topupAmount = async (amount: string) => {
    const payload = {
      amount,
    };
    try {
      isLoading.value = true;
      const response = await api.post("/api/transactions/top-up", payload);
      console.log(response.data);
      isLoading.value = false;
      topUpModal.value = false;
      userStore.updateUserInfo();
      transactionsStore.GetAllUsersTransactions();
    } catch (error) {
      isLoading.value = false;
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  };

  //==========GET all users===================
  const allAppUsers = ref<AllUsersResponse["data"]>([]);
  const getAllUsers = async () => {
    try {
      const response = await api.get("/api/users/all");
      allAppUsers.value = response.data.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return {
    isLoading,
    userPayeesList,
    allAppUsers,
    getUserPayees,
    getAllUsers,
    deletePayee,
    addnewPayee,
    topupAmount,
  };
});
