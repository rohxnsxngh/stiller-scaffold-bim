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
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid;
  transition: all 0.3s ease;
}

.alert-success {
  background-color: #00e676;
  color: #004d40;
  border-color: #00c853;
}

.alert-error {
  background-color: #ff3d00;
  color: #ffffff;
  border-color: #dd2c00;
}

.alert-info {
  background-color: #00b0ff;
  color: #01579b;
  border-color: #0091ea;
}

.alert-warning {
  background-color: #ffd600;
  color: #ff6f00;
  border-color: #ffc400;
}

.alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
</style>
