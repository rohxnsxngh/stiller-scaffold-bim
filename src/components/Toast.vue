<template>
  <div v-if="visible" :class="['', { hidden: !visible }]">
    <div :class="toastTypeClass">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000, // Default duration is 3 seconds
    },
    type: {
      type: String,
      default: "info", // Default type is 'info'
      validator(value: string) {
        return ["success", "error", "info", "warning"].includes(value);
      },
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    toastTypeClass() {
      console.log("Toast type class:", `alert-${this.type}`); // Add this line for debugging
      return `alert alert-${this.type}`;
    },
  },
  methods: {
    show() {
      this.visible = false; // Reset visibility
      this.$nextTick(() => {
        this.visible = true;
        setTimeout(() => {
          this.visible = false;
        }, this.duration);
      });
    },
  },
};
</script>

<style scoped>
.alert {
  padding: 18px 24px;
  margin-bottom: 20px;
  border-radius: 12px;
  font-weight: bold;
  color: #111115;
  text-shadow: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1), inset 0 0 5px rgba(0, 0, 0, 0.1);
  border: 2px solid;
  transition: all 0.4s ease;
}

.alert-success {
  background: linear-gradient(to right, #00e676, #01200e);
  border-color: #008c3d;
  box-shadow: 0 2px 6px rgba(0, 230, 118, 0.4),
    inset 0 0 5px rgba(0, 200, 83, 0.4);
}

.alert-error {
  background: linear-gradient(to right, #ff3d00, #320b01);
  border-color: #a32200;
  box-shadow: 0 2px 6px rgba(255, 61, 0, 0.4),
    inset 0 0 5px rgba(221, 44, 0, 0.4);
}

.alert-info {
  background: linear-gradient(to right, #00b0ff, #002034);
  border-color: #006db3;
  box-shadow: 0 2px 6px rgba(0, 176, 255, 0.4),
    inset 0 0 5px rgba(0, 145, 234, 0.4);
}

.alert-warning {
  background: linear-gradient(to right, #ffd600, #342800);
  border-color: #b39000;
  box-shadow: 0 2px 6px rgba(255, 214, 0, 0.4),
    inset 0 0 5px rgba(255, 196, 0, 0.4);
}

.alert:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
