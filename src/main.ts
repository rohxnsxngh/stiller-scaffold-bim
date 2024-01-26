import { createApp } from "vue";
import "./theme/style.css";
import "./theme/index.css";
import App from "./App.vue";
import router from "./router";
import { pinia } from './store/index'

createApp(App).use(router).use(pinia).mount("#app");
