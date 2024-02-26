<script setup lang="ts">
import { useNavbarStore } from "./store/index";
const store = useNavbarStore();
</script>

<template>
  <div>
    <Navbar v-if="store.showNavbar" />
    <router-view />
  </div>
</template>

<script lang="ts">
import Navbar from "./components/Navbar.vue";
import Drawer from "./components/Drawer.vue";

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
