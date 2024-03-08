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
  }),
  actions: {
    updateLength(value: any) {
      this.length = value;
    },
    updateWidth(value: any) {
      this.width = value;
    },
  },
});
