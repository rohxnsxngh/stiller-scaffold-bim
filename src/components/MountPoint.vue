<template>
  <div
    id="label-component"
    class="bg-black text-white p-2 flex pointer-events-auto rounded overflow-hidden"
    @click="clicktest"
  >
    <General />
  </div>
</template>

<script setup lang="ts">
const clicktest = () => {
  console.log("clicked");
};
</script>

<script lang="ts">
import General from "./General.vue";
import Blueprint from "./Blueprint.vue";
import Scaffold from "./Scaffold.vue";
import Roof from "./Roof.vue";
import Supply from "./Supply.vue";

export default {
  components: {
    General,
    Blueprint,
    Scaffold,
    Roof,
    Supply,
  },
  data() {
    return {};
  },
};
</script>
