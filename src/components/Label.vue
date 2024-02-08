<template>
  <div
    id="label"
    class="bg-black text-white p-2 flex pointer-events-auto rounded overflow-hidden"
    @click="clicktest"
  >
    <p contenteditable="true" class="overflow-hidden">Depth</p>
    <button
      class="btn btn-xs btn-success ml-2 overflow-hidden"
      id="label-enter"
    ></button>
  </div>
</template>

<script setup lang="ts">
const clicktest = () => {
  console.log("clicked");
};
</script>

<script lang="ts">
export default {
  name: "Label",
};
</script>
