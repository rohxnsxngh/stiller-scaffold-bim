<template>
  <div>
    <p class="text-sm mb-2">Opplastning</p>
  </div>

  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
    <div class="flex flex-col m-4" @click="hideBlueprintScaling">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767] indicator"
        id="upload-ifc"
        @click="hideBlueprintScaling"
      >
        <!-- <span
          class="indicator-item badge badge-transparent bg-transparent border-transparent"
        >
          <img
            src="../assets/images/BlueprintSection/Locked.svg"
            alt="Locked"
            class="scale-25"
        /></span> -->
        <img
          src="../assets/images/Delete.svg"
          alt="Select"
          class="w-4"
          @click="hideBlueprintScaling"
        />
      </div>
      <div><p class="text-xs text-center mt-2">IFC</p></div>
    </div>
    <div
      class="flex flex-col m-4"
      id="upload-image-blueprint"
      @click="showBlueprintScaling"
    >
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767] indicator"
        id="upload-blueprint"
        @click="showBlueprintScaling"
      >
        <input
          id="2D-hidden-file-input"
          type="file"
          accept="image/*"
          class="hidden"
          @click="showBlueprintScaling"
        />
        <!-- <span
          class="indicator-item badge badge-transparent bg-transparent border-transparent"
        >
          <img
            src="../assets/images/BlueprintSection/Locked.svg"
            alt="Locked"
            class="scale-25"
        /></span> -->
        <img src="../assets/images/Delete.svg" alt="Select" class="w-4" />
      </div>
      <div><p class="text-xs text-center mt-2">2D plan</p></div>
    </div>
  </div>

  <div class="bg-[#14141C]" v-if="show2DUpload">
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">
          Skalering av bilde (1 = standard størrelse)</span
        >
      </div>
      <input
        id="scale-image-blueprint"
        type="text"
        placeholder="skala"
        class="input input-md input-bordered w-full"
        v-model="scale"
      />
      <div
        class="btn my-4 w-full btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
        id="scale-image-blueprint-button"
      >
        Endre størrelse
      </div>
      <div class="label"></div>
    </label>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { uploadImageStore } from "../store";

export default {
  setup() {
    const uploadStore = uploadImageStore();

    // const depth = computed(() => componentStore.depth);
    const scale = computed({
      // Make depth a computed property
      get: () => uploadStore.scale,
      set: (value) => uploadStore.updateScale(value),
    });

    return {
      scale,
    };
  },
  components: {},
  data() {
    return {
      show2DUpload: false,
    };
  },
  methods: {
    showBlueprintScaling() {
      this.show2DUpload = true;
    },
    hideBlueprintScaling() {
      this.show2DUpload = false;
    },
  },
};
</script>
