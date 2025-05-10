import { defineStore } from "pinia";
import { ref } from "vue";
import { api, notify } from "./helpers";
import { sendMoneyModal } from "./Scopes";
import { useUserStore } from "./userInfo";
import {
  type AllTransactionResponse,
  type ChartData,
  type CreditHistory,
  type SimplifiedTransaction,
  type TableDataInterface,
  type TransactionsInterface,
} from "./interfaces";
import dayjs from "dayjs";

export const useTransactionsStore = defineStore("transactions", () => {
  const isLoading = ref(false);
  const userStore = useUserStore();

  const creditHistory = ref<CreditHistory[]>([]);

  const userTransactions = ref<TransactionsInterface[]>([]);
  const tableData = ref<TableDataInterface[]>([]);
  const currentUserAllTransaction = ref<SimplifiedTransaction[]>([]);
  const chartsData = ref<ChartData[]>([]);

  //============SEND_PAYMENt=================
  async function SendPayment(
    amount: string,
    recipientId: string,
    message: string = ""
  ) {
    const payload = {
      amount: amount,
      recipientId: recipientId,
      message: message || "empty Message",
    };
    try {
      isLoading.value = true;
      await api.post("/api/transactions/send", payload);
      // console.log(response.data);
      notify("Payment Sent Successfully", "success");
      sendMoneyModal.value = false;
      isLoading.value = false;
      userStore.updateUserInfo();
      GetAllUsersTransactions();
      getCreditHistory();
    } catch (error) {
      notify("Unable to send payment", "error");
      isLoading.value = false;
      console.log(error);
    }
  }

  async function GetAllUsersTransactions() {
    try {
      isLoading.value = true;
      const response = await api.get("/api/transactions/all");
      // console.log("response", response.data);
      currentUserAllTransaction.value = getDataForChartsAndTable(
        response.data.transactions
      );
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      notify("Unable to get transaction", "error");
    }
  }

  const getDataForChartsAndTable = (
    data: AllTransactionResponse[]
  ): SimplifiedTransaction[] => {
    return data.map((item) => ({
      transactionID: item._id,
      senderID: item.sender._id,
      receiverID: item.recipient._id,
      sender: item.sender.firstName, // + " " + item.sender.lastName,
      receivedBy: item.recipient.firstName, // + " " + item.recipient.lastName,
      amount: item.amount,
      status: item.status,
      senderImage: item.sender.imageUrl,
      receiverImage: item.recipient.imageUrl,
      message: item.message,
      balaceAfterRecipient: item.balanceAfterRecipient,
      balanceAfterSender: item.balanceAfterSender,
      date: dayjs(item.processedAt).format("YYYY-MM-DD"),
      time: dayjs(item.processedAt).format("HH:mm A"),
    }));
  };

  const getCreditHistory = async () => {
    isLoading.value = true;
    try {
      const { data } = await api.get("/api/transactions/credit-history");
      creditHistory.value = data.creditHistory;
      chartsData.value = getChartsData(data.creditHistory);
      // console.log(chartsData.value, "====chardatafinal");
      isLoading.value = false;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const getChartsData = (data: CreditHistory[]) => {
    return data.map((item) => {
      return {
        amount: item.amount,
        credited:
          item.status === "CREDITED" || item.isTopUp
            ? true
            : item.status === "DEBITED"
            ? false
            : null,
        date: dayjs(item.createdAt).format("YYYY-MM-DD"),
        time: dayjs(item.createdAt).format("HH:mm A"),
      };
    });
  };

  return {
    isLoading,
    userTransactions,
    tableData,
    chartsData,
    creditHistory,
    currentUserAllTransaction,
    SendPayment,
    GetAllUsersTransactions,
    getCreditHistory,
    getChartsData,
  };
});
