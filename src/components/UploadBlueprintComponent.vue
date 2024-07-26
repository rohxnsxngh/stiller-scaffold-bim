<template>
  <div>
    <p class="text-sm mb-2">Opplastning</p>
  </div>

  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767] indicator"
        id="upload-ifc"
      >
        <span
          class="indicator-item badge badge-transparent bg-transparent border-transparent"
        >
          <img
            src="../assets/images/BlueprintSection/Locked.svg"
            alt="Locked"
            class="scale-25"
        /></span>
        <img src="../assets/images/Delete.svg" alt="Select" class="w-4" />
      </div>
      <div><p class="text-xs text-center mt-2">IFC</p></div>
    </div>
    <div class="flex flex-col m-4" @click="showBlueprintScaling" id="upload-image-blueprint">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767] indicator"
        id="upload-blueprint"
      >
        <span
          class="indicator-item badge badge-transparent bg-transparent border-transparent"
        >
          <img
            src="../assets/images/BlueprintSection/Locked.svg"
            alt="Locked"
            class="scale-25"
        /></span>
        <img src="../assets/images/Delete.svg" alt="Select" class="w-4" />
      </div>
      <div><p class="text-xs text-center mt-2">2D plan</p></div>
    </div>
  </div>

  <div class="bg-[#14141C]" v-if="show2DUpload">
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text"> last opp én plan per scene</span>
      </div>
      <input
        type="text"
        id="scale-image-blueprint"
        placeholder="skala"
        class="input input-md input-bordered w-full"
        v-model="scale"
      />
      <div class="label"></div>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      show2DUpload: false,
      scale: null
    };
  },
  methods: {
    showBlueprintScaling() {
      this.show2DUpload = !this.show2DUpload;
    },
  },
};
</script>
