import { createPinia } from 'pinia';
import * as OBC from "openbim-components";
import { defineStore } from 'pinia'


export const pinia = createPinia();

export const useStore = defineStore('navbar', {
 state: () => ({
    showNavbar: true,
    components: null as OBC.Components | null,
 }),
 actions: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar
    },
    setComponents(components: OBC.Components) {
      this.components = components;
    },
 }
})