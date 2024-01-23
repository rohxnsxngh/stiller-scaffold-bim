<template>
  <div id="model"></div>
</template>

<script setup lang="ts">
import { createModelView } from "../index";
import { onMounted } from "vue";

onMounted(() => {
  createModelView();
});
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
