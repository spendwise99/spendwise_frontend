import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { useTransactionsStore } from "../store/TransactionsStore";
import { useUserStore } from "./userInfo";

export const generatePDF = () => {
  const doc = new jsPDF();
  const transactionStore = useTransactionsStore();
  const userSession = useUserStore();
  const creditHistory = Array.isArray(transactionStore.creditHistory)
    ? transactionStore.creditHistory
    : [];

  if (!creditHistory.length) {
    alert("No transactions available.");
    return;
  }

  // Sort by createdAt for date range
  const sorted = [...creditHistory].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const startDate = dayjs(sorted[0].createdAt).format("YYYY-MM-DD");
  const endDate = dayjs(sorted[sorted.length - 1].createdAt).format(
    "YYYY-MM-DD"
  );

  const userName = "Account Number: " + (creditHistory[0]?.userId || "N/A");

  // Header Info
  doc.setFontSize(12);
  doc.text("Credit History Report", 14, 15);
  doc.setFontSize(10);
  doc.text(
    `${userSession.user?.firstName + "" + userSession.user?.lastName}`,
    14,
    22
  );
  doc.text(`${userName}`, 14, 28);
  doc.text(`Statement Period: ${startDate} to ${endDate}`, 14, 34);

  // Table Headings
  const headers = [["Date", "Time", "Amount", "Status", "Transaction ID"]];

  // Table Body Rows
  const rows = creditHistory.map((txn) => [
    dayjs(txn.createdAt).format("YYYY-MM-DD"),
    dayjs(txn.createdAt).format("HH:mm"),
    `${txn.amount} £`,
    txn.status,
    txn._id.slice(0, 8) + "…",
  ]);

  // Table
  autoTable(doc, {
    startY: 40,
    head: headers,
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("Signature: ____________________", 14, pageHeight - 20);
  doc.text(
    `Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`,
    14,
    pageHeight - 10
  );

  // Save PDF
  doc.save(`Credit_History_${endDate}.pdf`);
};
