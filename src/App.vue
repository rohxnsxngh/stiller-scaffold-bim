<script setup lang="ts">
import { navStore } from "./store/index";
const store = navStore();
</script>

<template>
  <div>
    <Navbar v-if="store.showNavbar" />
    <router-view />
  </div>
</template>

<script lang="ts">
import Navbar from "./pages/Navbar.vue";
import Drawer from "./pages/Drawer.vue";

export default {
  components: {
    Navbar,
    Drawer,
  },
  data() {
    return {};
  },
};
</script>
