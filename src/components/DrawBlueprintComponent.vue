<template>
  <div>
    <p class="text-sm mb-2">Bruk rektangel knappen eller polygon-knappen</p>
  </div>

  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
        id="startDrawingRectangle"
      >
        <img
          src="../assets/images/Select.svg"
          alt="Rectangle"
          class="scale-150"
        />
      </div>
      <div><p class="text-xs text-center mt-2">Tegn Plantegning</p></div>
    </div>
    <!-- <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
        id="startDrawingPolygon"
      >
        <img
          src="../assets/images/Delete.svg"
          alt="Polygon"
          class="scale-150"
        />
      </div>
      <div><p class="text-xs text-center mt-2">Polygon</p></div>
    </div> -->
  </div>

  <div class="grid grid-cols-8 gap-4">
    <div class="col-span-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Lengde (m)</span>
        </div>
        <input
          type="text"
          id="rectangle-length"
          placeholder="Antall meter"
          class="input input-md input-bordered w-full max-w-xs"
          v-model="length"
          disabled
        />
        <div class="label"></div>
      </label>
    </div>

    <div class="col-span-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Bredde (m)</span>
        </div>
        <input
          type="text"
          id="rectangle-width"
          placeholder="Antall meter"
          class="input input-md input-bordered w-full max-w-xs"
          v-model="width"
          disabled
        />
        <div class="label"></div>
      </label>
    </div>

    <div class="col-span-4" @click="setActiveTrue">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text text-sm">Lag tegning</span>
        </div>
        <div
          class="btn w-full btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
          id="create-blueprint"
        >
          <i class="material-icons">dashboard</i>
        </div>
      </label>
    </div>
  </div>

  <Toast
    ref="toast"
    type="success"
    message="Tips: Ønsker du å endre høyde kan du gjøre det ved å trykke på den svarte boksen på bygningen"
  />

  <div class="grid grid-cols-6 gap-4" v-if="isActive">
    <div class="col-span-4">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Bygningshøyde (m)</span>
        </div>
        <input
          type="text"
          id="extrusion-height"
          placeholder="Antall meter"
          class="input input-md input-bordered w-full max-w-xs"
          v-model="depth"
        />
        <div class="label"></div>
      </label>
    </div>

    <div class="col-span-2" @click="setActiveFalse">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text text-sm">Sett høyde</span>
        </div>
        <div
          class="btn w-full btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
          id="create-extrusion"
          :class="{ 'disabled-class': !isDepthValid }"
        >
          <i class="material-icons">expand</i>
        </div>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch } from "vue";
import { useStore } from "../store";
import Toast from "./Toast.vue";

export default {
  setup() {
    const componentStore = useStore();

    // Define reactive state using ref
    const showDraw = ref(false);
    const showUpload = ref(false);

    // Use computed properties to reactively access store state
    const length = computed({
      // Make length a computed property
      get: () => componentStore.length,
      set: (value) => componentStore.updateLength(value),
    });

    const width = computed({
      // Make width a computed property
      get: () => componentStore.width,
      set: (value) => componentStore.updateWidth(value),
    });

    const depth = computed({
      // Make depth a computed property
      get: () => componentStore.depth,
      set: (value) => {
        componentStore.updateDepth(value), console.error(value, depth.value);
      },
    });

    // Define methods
    const showDrawBlueprint = () => {
      showDraw.value = true;
      showUpload.value = false;
    };

    const isDepthValid = computed(() => {
      return depth.value > 0;
    });

    // Watch isDepthValid to see if it updates as expected
    watch(isDepthValid, (newVal) => {
      console.log("isDepthValid:", newVal);
    });

    return {
      showDraw,
      showUpload,
      length,
      width,
      depth,
      isDepthValid,
      showDrawBlueprint,
    };
  },
  data() {
    return {
      isActive: false,
    };
  },
  components: {
    Toast,
  },
  methods: {
    setActiveTrue() {
      this.isActive = true;
    },
    setActiveFalse() {
      this.isActive = false;
      //@ts-ignore
      this.$refs.toast.show();
    },
  },
};
</script>

<style scoped>
.disabled-class {
  pointer-events: none;
  opacity: 0.5;
}
</style>
