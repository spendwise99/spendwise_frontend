<script setup lang="ts">
import { Line } from "vue-chartjs";
import { computed } from "vue";
import dayjs from "dayjs";
import { useTransactionsStore } from "../store/TransactionsStore";

const transactionStore = useTransactionsStore();

const last10Transactions = computed(() => {
  const data = Array.isArray(transactionStore.chartsData)
    ? transactionStore.chartsData
    : [];

  return [...data]
    .sort((a, b) => {
      const dateTimeA = dayjs(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm");
      const dateTimeB = dayjs(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm");
      return dateTimeB.valueOf() - dateTimeA.valueOf();
    })
    .slice(0, 10)
    .reverse();
});

const chartData = computed(() => ({
  labels: last10Transactions.value.map((t) =>
    dayjs(`${t.date} ${t.time}`, "YYYY-MM-DD HH:mm").format("HH:mm")
  ),
  datasets: [
    {
      label: "Transaction Amount (£)",
      data: last10Transactions.value.map((t) => Math.abs(t.amount)),
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.3,
      segment: {
        borderColor: "#3b82f6",
      },
    },
  ],
}));

const chartOptions: any = {
  responsive: true,
  elements: {
    line: { tension: 0.3, borderWidth: 2 },
    point: {
      radius: 3,
      hoverRadius: 6,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.parsed.y;
          return `£${Math.abs(value).toFixed(2)}`;
        },
      },
    },
  },
  scales: {
    x: {
      type: "category",
      grid: { display: false },
      ticks: {
        display: false,
      },
    },
    y: {
      type: "linear",
      beginAtZero: true,
      suggestedMin: 0,
      grid: { display: false },
      ticks: {
        color: "#ccc",
        callback: (value: number) => `£${value.toFixed(0)}`,
      },
    },
  },
};
</script>

<template>
  <div class="relative rounded-lg h-62">
    <h3 class="text-sm font-semibold text-accent mb-1">Last 10 Transactions</h3>

    <div v-if="transactionStore.isLoading" class="text-gray-400 text-lg">
      Loading...
    </div>

    <template v-else>
      <Line :data="chartData" :options="chartOptions" />
    </template>
  </div>
</template>
