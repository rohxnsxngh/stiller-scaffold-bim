import { createApp } from "vue";
import "./theme/style.css";
import "./theme/index.css";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
