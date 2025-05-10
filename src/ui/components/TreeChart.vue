<template>
  <div style="height: 400px; width: 100%">
    <highcharts :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Highcharts from "highcharts";

// Import modules as side effects (correct approach for ES modules)
import "highcharts/modules/treemap";
import "highcharts/modules/treegraph";

const chartOptions = ref({
  chart: {
    inverted: true,
    type: "treegraph",
  },
  title: {
    text: "Treegraph Layout",
  },
  series: [
    {
      data: [
        { id: "1", name: "CEO" },
        { id: "2", name: "CTO", parent: "1" },
        { id: "3", name: "CFO", parent: "1" },
        { id: "4", name: "Engineer", parent: "2" },
        { id: "5", name: "Accountant", parent: "3" },
      ],
      marker: {
        symbol: "rect",
        radius: 0,
      },
      dataLabels: {
        align: "left",
        verticalAlign: "middle",
        style: {
          fontWeight: "bold",
          color: "#2aac8e",
        },
      },
    },
  ],
});
</script>
