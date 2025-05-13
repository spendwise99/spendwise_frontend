import type { UserInterface } from "./helpers";

export interface Payee {
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
}

export interface PayeeApiResponse {
  message: string;
  data: Payee[];
}

export interface AppUser {
  userId: string;
  email: string;
  imageUrl: string;
  age: number;
  userName?: string; // optional because not all users have this field
}

export interface AllUsersResponse {
  message: string;
  data: AppUser[];
}

export interface TransactionsInterface {
  _id: string;
  userId: string;
  status: "CREDITED" | "DEBITED";
  recipientId: string;
  isTopUp: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransactionsResponse {
  success: boolean;
  creditHistory: TransactionsInterface[];
}

export interface TableDataInterface {
  tid: string;
  userName: string;
  userId: string;
  recipientId: string;
  recipientName?: string;
  status: "CREDITED" | "DEBITED";
  amount: number;
  date: string;
  time: string;
  userImage: string;
}

export interface AllTransactionResponse {
  _id: string;
  sender: UserInterface;
  recipient: UserInterface;
  amount: number;
  status: "completed" | "pending" | "failed";
  message: string;
  balanceAfterSender: number;
  balanceAfterRecipient: number;
  processedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SimplifiedTransaction {
  transactionID: string;
  sender: string;
  senderID: string;
  receiverID: string;
  receivedBy: string;
  amount: number;
  status: string;
  senderImage: string;
  receiverImage: string;
  message: string;
  balaceAfterRecipient: number;
  balanceAfterSender: number;
  date: string; // formatted like "YYYY-MM-DD"
  time: string; // formatted like "HH:mm A"
}

export interface CreditHistory {
  _id: string;
  userId: string;
  recipientId: string;
  status: "CREDITED" | "DEBITED";
  isTopUp: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChartData {
  amount: number;
  credited: boolean | null;
  date: string;
  time: string;
}

// interfaces/ActivityLog.ts
export interface Activity {
  city: string;
  ipAddress: string;
  region: string;
  country: string;
  postal: string;
  org: string;
  location: string;
  timezone: string;
}

export interface ActivityLog {
  _id: string;
  userId: string;
  activity: Activity;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ActivityLogsResponse {
  activities: ActivityLog[];
  message: string;
}
