import { createPinia } from 'pinia';
import { defineStore } from 'pinia'


export const pinia = createPinia();

export const useNavbarStore = defineStore('navbar', {
 state: () => ({
    showNavbar: true
 }),
 actions: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar
    }
 }
})