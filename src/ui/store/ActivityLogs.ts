// stores/activityLogs.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "./helpers";
import type { Activity, ActivityLog } from "./interfaces";

export const useActivityLogs = defineStore("activitylogs", () => {
  const userLogs = ref<ActivityLog[]>([]);
  const loading = ref(false);

  const createActivityLog = async (logData: Activity) => {
    const payload = {
      activity: logData,
    };
    try {
      const response = await api.post("/api/activity", payload);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getActivityLogs = async () => {
    loading.value = true;
    try {
      const response = await api.get("/api/activity");
      userLogs.value = response.data.activities;
      console.log(response.data);
      loading.value = false;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    getActivityLogs,
    createActivityLog,
    userLogs,
    loading,
  };
});
