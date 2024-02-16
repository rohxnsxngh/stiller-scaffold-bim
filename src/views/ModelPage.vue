<template>
  <div id="model" v-if="showDrawer"></div>
  <div id="marker"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createModelView } from "../index";
import { onMounted } from "vue";

let showDrawer = ref(true);

const menuButton = document.getElementById("menu-button");
menuButton?.addEventListener("click", () => {
  console.log("menu button clicked");
  showDrawer.value = !showDrawer.value;
});

onMounted(() => {
  createModelView();
});
</script>

<script lang="ts">
export default {
  components: {},
  data() {
    return {};
  },
};
</script>

<style scoped>
#model {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  position: fixed;
  overflow: hidden;
}
</style>
