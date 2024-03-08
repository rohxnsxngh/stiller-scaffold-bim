<template>
  <div
    id="label-component"
    class="bg-[#111115] text-white px-2 flex pointer-events-auto rounded"
  >
    <General v-if="activeSection === 'general'" />
    <Blueprint v-if="activeSection === 'blueprint'" />
    <!-- <Scaffold v-if="activeSection === 'scaffold'" />
    <Roof v-if="activeSection === 'roof'" />
    <Supply v-if="activeSection === 'supply'" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeSection = ref("general"); // Default active section

const setActiveSection = (section: string) => {
  activeSection.value = section;
};

// @ts-ignore
window.setActiveSection = setActiveSection;

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
    return {
      activeSection: "general", // Default active section
    };
  },
  methods: {
    setActiveSection(section: string) {
      this.activeSection = section;
    },
  },
};
</script>
