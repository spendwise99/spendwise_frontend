<script setup lang="ts">
import { Bar } from "vue-chartjs";
import { computed } from "vue";
import dayjs from "dayjs";
import { useTransactionsStore } from "../store/TransactionsStore";

// Store
const transactionStore = useTransactionsStore();

console.log(transactionStore.chartsData);
const chartData = computed(() => {
  // Get the 10 most recent transactions
  const lastTen = [...transactionStore.chartsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .reverse(); // Oldest to newest for chart display

  return {
    labels: lastTen.map((t) => dayjs(t.date).format("MMM D, HH:mm")),
    datasets: [
      {
        label: "Transaction Amount",
        data: lastTen.map((t) => (t.credited ? t.amount : -t.amount)),
        backgroundColor: "#10b981",
        borderWidth: 0,
        barThickness: 40,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `$${context.parsed.y.toLocaleString("en-US")}`,
      },
    },
  },
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
      backgroundColor: "#fff",
    },
  },
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { display: false },
      title: {
        display: false,
        text: "Net Amount",
      },
    },
  },
};
</script>

<template>
  <div class="h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
