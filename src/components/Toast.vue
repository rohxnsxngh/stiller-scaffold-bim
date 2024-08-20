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
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.8);
  border: 4px solid;
  transition: all 0.4s ease;
}

.alert-success {
  background: linear-gradient(to right, #00e676, #00c853);
  border-color: #008c3d;
  box-shadow: 0 0 20px #00e676, inset 0 0 20px #00e676;
}

.alert-error {
  background: linear-gradient(to right, #ff3d00, #dd2c00);
  border-color: #a32200;
  box-shadow: 0 0 20px #ff3d00, inset 0 0 20px #ff3d00;
}

.alert-info {
  background: linear-gradient(to right, #00b0ff, #0091ea);
  border-color: #006db3;
  box-shadow: 0 0 20px #00b0ff, inset 0 0 20px #00b0ff;
}

.alert-warning {
  background: linear-gradient(to right, #ffd600, #ffc400);
  border-color: #b39000;
  box-shadow: 0 0 20px #ffd600, inset 0 0 20px #ffd600;
}

.alert:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.8);
}
</style>
