import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "./helpers";

export const useAdminStore = defineStore("admin/store", () => {
  interface User {
    _id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    age: number;
    imageUrl: string;
    isVerified: boolean;
    balance: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    role: "user" | "admin" | string;
  }

  interface Transaction {
    _id: string;
    sender: User;
    recipient: User;
    amount: number;
    status: "pending" | "completed" | "failed" | string;
    message: string;
    balanceAfterSender: number;
    balanceAfterRecipient: number;
    processedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface TransactionSummary {
    totalTransactions: number;
    completedTransactions: number;
    failedTransactions: number;
    totalAmountTransferred: number;
    uniqueUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    totalAdmins: number;
    totalRegularUsers: number;
    highestTransaction: number;
    averageTransaction: number;
    mostActiveSender: {
      userName: string;
      transactionCount: number;
    } | null;
  }

  interface Queries {
    _id: string;
    email: string;
    subject: string;
    message: string;
    date: string; // or `Date` if you plan to parse it
    createdAt: string; // or `Date`
    updatedAt: string; // or `Date`
    __v: number;
  }

  const isLoading = ref(false);
  const allTransactions = ref<Transaction[]>([]);
  const allQueries = ref<Queries[]>([]);

  const usersAndTransactionSummary = ref<TransactionSummary>({
    totalTransactions: 0,
    completedTransactions: 0,
    failedTransactions: 0,
    totalAmountTransferred: 0,
    uniqueUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0,
    highestTransaction: 0,
    averageTransaction: 0,
    mostActiveSender: null,
  });

  const getAllTransactions = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/transactions/all/admin");
      allTransactions.value = response.data.transactions;
      usersAndTransactionSummary.value = summarizeTransactions(
        response.data.transactions
      );
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  const summarizeTransactions = (
    transactions: Transaction[]
  ): TransactionSummary => {
    const totalTransactions = transactions.length;
    const completedTransactions = transactions.filter(
      (t) => t.status === "completed"
    ).length;
    const failedTransactions = transactions.filter(
      (t) => t.status === "failed"
    ).length;
    const totalAmountTransferred = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const highestTransaction = Math.max(...transactions.map((t) => t.amount));
    const averageTransaction =
      totalTransactions > 0 ? totalAmountTransferred / totalTransactions : 0;

    const usersMap = new Map<string, User>();
    const senderCountMap = new Map<string, { count: number; user: User }>();

    for (const t of transactions) {
      usersMap.set(t.sender._id, t.sender);
      usersMap.set(t.recipient._id, t.recipient);

      if (senderCountMap.has(t.sender._id)) {
        senderCountMap.get(t.sender._id)!.count++;
      } else {
        senderCountMap.set(t.sender._id, { count: 1, user: t.sender });
      }
    }

    const allUsers = Array.from(usersMap.values());
    const verifiedUsers = allUsers.filter((u) => u.isVerified).length;
    const unverifiedUsers = allUsers.length - verifiedUsers;
    const totalAdmins = allUsers.filter((u) => u.role === "admin").length;
    const totalRegularUsers = allUsers.length - totalAdmins;
    const uniqueUsers = allUsers.length;

    const mostActiveSenderEntry = [...senderCountMap.values()].sort(
      (a, b) => b.count - a.count
    )[0];
    const mostActiveSender = mostActiveSenderEntry
      ? {
          userName: mostActiveSenderEntry.user.userName,
          transactionCount: mostActiveSenderEntry.count,
        }
      : null;

    return {
      totalTransactions,
      completedTransactions,
      failedTransactions,
      totalAmountTransferred,
      highestTransaction,
      averageTransaction,
      uniqueUsers,
      verifiedUsers,
      unverifiedUsers,
      totalAdmins,
      totalRegularUsers,
      mostActiveSender,
    };
  };

  const getSupportEmails = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/contact/");
      allQueries.value = response.data.data;
    } catch (error) {
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    allTransactions,
    allQueries,
    usersAndTransactionSummary,
    getAllTransactions,
    getSupportEmails,
  };
});
