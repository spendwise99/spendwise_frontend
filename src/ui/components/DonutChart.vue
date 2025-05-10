<script setup lang="ts">
import { PolarArea } from "vue-chartjs";
import { ref } from "vue";
import dayjs from "dayjs";

const labels = Array.from({ length: 5 }, (_, i) =>
  dayjs()
    .subtract(2 - i, "month")
    .format("MMMM")
);

const monthlyAmounts = [1900, 3455, 2700, 3500, 2800];

const chartData = ref({
  labels,
  datasets: [
    {
      label: "Monthly Payments (£)",
      data: monthlyAmounts,
      backgroundColor: [
        "#C68EFD60",
        "#E69DB860",
        "#EF965160",
        "#A5158C60",
        "#F6DC4360",
      ],
      borderColor: "#ffffff",
      borderWidth: 4,
      hoverBackgroundColor: [
        "#C68EFD",
        "#E69DB8",
        "#EF9651",
        "#A5158C",
        "#F6DC43",
      ],
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "bottom" as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const value = tooltipItem.raw;
          return `£${value.toLocaleString()}`;
        },
      },
    },
  },
};
</script>

<template>
  <div class="w-auto mx-auto">
    <PolarArea :data="chartData" :options="chartOptions" />
  </div>
</template>
