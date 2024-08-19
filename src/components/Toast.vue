<template>
    <div v-if="visible" :class="['toast toast-end', { hidden: !visible }]">
      <div :class="['alert', toastTypeClass]">
        <span>{{ message }}</span>
      </div>
    </div>
  </template>
  
  <script lang="">
  export default {
    props: {
      message: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        default: 3000 // Default duration is 3 seconds
      },
      type: {
        type: String,
        default: 'info', // Default type is 'info'
        validator(value) {
          return ['success', 'error', 'info', 'warning'].includes(value);
        }
      }
    },
    data() {
      return {
        visible: false
      };
    },
    computed: {
      toastTypeClass() {
        return `alert-${this.type}`;
      }
    },
    methods: {
      show() {
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, this.duration);
      }
    }
  };
  </script>
  
  <style scoped>
  .toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 50;
  }
  </style>
  