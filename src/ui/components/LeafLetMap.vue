<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useActivityLogs } from "../store/ActivityLogs";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "./Loading.vue";

const logs = useActivityLogs();
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

const setupMap = () => {
  if (!mapContainer.value) return;

  if (map) {
    map.remove();
  }

  map = L.map(mapContainer.value).setView([30.1968, 71.4782], 5);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }
  ).addTo(map);

  const grouped = new Map<string, any[]>();

  logs.userLogs.forEach((log: any) => {
    const [latStr, lngStr] = log.activity.location.split(",");
    const key = `${latStr.trim()},${lngStr.trim()}`;
    const entry = {
      ip: log.activity.ipAddress,
      region: log.activity.region,
      city: log.activity.city,
      org: log.activity.org,
      time: new Date(log.createdAt).toLocaleString("en-US"),
    };

    if (grouped.has(key)) {
      grouped.get(key)!.push(entry);
    } else {
      grouped.set(key, [entry]);
    }
  });

  const bounds: L.LatLngTuple[] = [];

  grouped.forEach((info, key) => {
    const [lat, lng] = key.split(",").map(Number);
    bounds.push([lat, lng]);

    const marker = L.marker([lat, lng]).addTo(map!);

    const popupContent = info
      .map(
        (i) => `
          <div>
            <strong>Region:</strong> ${i.region}<br/>
            <strong>City:</strong> ${i.city}<br/>
            <strong>IP:</strong> ${i.ip}<br/>
            <strong>Org:</strong> ${i.org}<br/>
            <strong>Time:</strong> ${i.time}
          </div>
        `
      )
      .join("<hr/>");

    marker.on("click", () => {
      map!.setView([lat, lng], 10, { animate: true });
      marker.bindPopup(popupContent).openPopup();
    });
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
};

onMounted(() => {
  if (!logs.loading && logs.userLogs.length > 0) {
    setupMap();
  }
});

watch(
  () => logs.userLogs,
  (newLogs) => {
    if (!logs.loading && newLogs.length > 0) {
      setupMap();
    }
  }
);
</script>

<template>
  <main>
    <Loading v-if="logs.loading" />

    <h1
      v-else-if="logs.userLogs.length <= 0"
      class="text-center text-accent text-lg"
    >
      No Activity Found
    </h1>

    <div
      v-else
      ref="mapContainer"
      class="w-full z-50 h-[420px] rounded-xl shadow-md"
    ></div>
  </main>
</template>

<style>
.leaflet-popup-content {
  font-size: 14px;
  color: #333;
}
</style>
