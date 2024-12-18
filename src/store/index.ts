import { createPinia } from "pinia";
import * as OBC from "openbim-components";
import { defineStore } from "pinia";

export const pinia = createPinia();

export const navStore = defineStore("navbar", {
  state: () => ({
    showNavbar: true,
    components: null as OBC.Components | null,
  }),
  actions: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    setComponents(components: OBC.Components) {
      this.components = components;
    },
  },
});

export const useStore = defineStore("component", {
  state: () => ({
    length: 0,
    width: 0,
    depth: 0,
    height: 0,
    shedHeight: 0,
    level: 1,
  }),
  actions: {
    updateLength(value: any) {
      this.length = value;
    },
    updateWidth(value: any) {
      this.width = value;
    },
    updateDepth(value: any) {
      this.depth = value;
    },
    updateRoofHeight(value: any) {
      this.height = value;
    },
    updateShedRoofHeight(value: any) {
      this.shedHeight = value;
    },
    updateScaffoldLevel(value: any) {
      this.level = value;
    },
  },
});

export const supplyStore = defineStore("supply", {
  state: () => ({
    scaffolding: 0,
    internalScaffolding: 0,
    externalScaffolding: 0,
    elevator: 0,
    lift: 0,
    squareMetersOfScaffolding: 0,
    squareMetersOfBuilding: 0,
  }),
  actions: {
    updateScaffolding(value: any) {
      this.scaffolding = value;
    },
    updateInternalScaffolding(value: any) {
      this.internalScaffolding = value;
    },
    updateExternalScaffolding(value: any) {
      this.externalScaffolding = value;
    },
    updateSquareMetersOfScaffolding(value: any) {
      this.squareMetersOfScaffolding = value;
    },
    updateSquareMetersOfBuilding(value: any) {
      this.squareMetersOfBuilding = value;
    },
  },
});

export const selectedStore = defineStore("selected", {
  state: () => ({
    selected: "Selected Tool",
  }),
  actions: {
    updateSelected(value: any) {
      this.selected = value;
    },
  },
});

export const uploadImageStore = defineStore("image", {
  state: () => ({
    scale: 1,
  }),
  actions: {
    updateScale(value: any) {
      this.scale = value;
    },
  },
});
