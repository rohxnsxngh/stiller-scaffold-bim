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
      <div><p class="text-xs text-center mt-2">Rektangel</p></div>
    </div>
    <div class="flex flex-col m-4">
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
    </div>
  </div>

  <div class="grid grid-cols-7 gap-4">
    <div class="col-span-3">
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
        />
        <div class="label"></div>
      </label>
    </div>

    <div class="col-span-3">
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
        />
        <div class="label"></div>
      </label>
    </div>

    <div class="col-span-1">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text text-sm">blåkopi</span>
        </div>
        <div class="btn w-full" id="create-blueprint"> <i class="material-icons">dashboard</i></div>
      </label>
    </div>
  </div>

  <div class="grid grid-cols-3 gap-8">
   

    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Høyde (m)</span>
        </div>
        <input
          type="text"
          id="extrusion-height"
          placeholder="Antall meter"
          class="input input-md input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>
  </div>

  
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '../store';

export default {
  setup() {
    const componentStore = useStore();

    // Define reactive state using ref
    const showDraw = ref(false);
    const showUpload = ref(false);

    // Use computed properties to reactively access store state
    const length = computed(() => componentStore.length);
    const width = computed(() => componentStore.width);

    // Define methods
    const showDrawBlueprint = () => {
      showDraw.value = true;
      showUpload.value = false;
    };

    return {
      showDraw,
      showUpload,
      length,
      width,
      showDrawBlueprint,
    };
 },
};
</script>
