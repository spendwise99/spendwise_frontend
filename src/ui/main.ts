import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "@/style.css";
import { createPinia } from "pinia";
import "vue3-toastify/dist/index.css";
import vSelect from "vue-select";

import { useUserStore } from "./store/userInfo";
import HighchartsVue from "highcharts-vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { useAuthStore } from "./store/AuthStore";
import TransitionComponent from "./components/TransitionComponent.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  ArcElement,
  RadialLinearScale
);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(HighchartsVue);
// app.use(toast);
app.component("v-select", vSelect);
app.component("TransitionComponent", TransitionComponent);

const authStore = useAuthStore();
const userStore = useUserStore();
const token = localStorage.getItem("accessToken");
const userData = localStorage.getItem("user");

if (token && userData && authStore.isTokenValid(token)) {
  userStore.userIsAuthenticated = true;
  userStore.setToken(token);
  userStore.updateUserInfo();
  // userStore.setUser(JSON.parse(userData));
}

app.mount("#app");
