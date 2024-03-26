<template>
  <div class="grid grid-cols-5 gap-8">
    <div class="col-span-3">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Høyde (m)</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-sm input-bordered w-full max-w-xs mt-3"
          v-model="height"
        />
        <div class="label">
          <span class="label-text-alt text-[#623CEA]"
            >Kalkulert vinkel: 18°</span
          >
        </div>
      </label>
    </div>

    <div class="col-span-1">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text text-xs">Roter tak</span>
        </div>
        <div
          class="btn btn-sm w-full bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
          id="rotate-roof"
        >
          <img
            src="../assets/images/RoofSection/Rotate.svg"
            alt="Select"
            class="w-6"
          />
        </div>
        <div class="label">
          <span class="label-text-alt text-xs">Rotér tak</span>
        </div>
      </label>
    </div>

    <div class="col-span-1">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text text-xs">lage tak</span>
        </div>
        <div
          class="btn btn-sm w-full btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
          id="create-shed-roof"
        >
          <i class="material-icons">roofing</i>
        </div>
      </label>
    </div>
  </div>

  <div>
    <p class="text-sm my-2">Stikker taket ut fra fasaden (overheng)?</p>
    <div class="grid grid-cols-3 gap-3">
      <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Ja</div>
      <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Nei</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-8">
    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Hvor mye ut?</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-sm input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "../store";

export default {
  setup() {
    const componentStore = useStore();

    // const depth = computed(() => componentStore.depth);
    const height = computed({
      // Make depth a computed property
      get: () => componentStore.shedHeight,
      set: (value) => componentStore.updateShedRoofHeight(value),
    });

    return {
      height,
    };
  },
};
</script>
