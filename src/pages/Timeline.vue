<template>
  <div
    ref="selected"
    id="selected-tool"
    class="fixed -right-0 -bottom-12 mt-1 text-amber-300 font-semibold"
  >
    {{ value }}
  </div>
  <div
    class="fixed -right-20 -bottom-80 mt-1 text-slate-300 font-semibold bg-[#111115] w-32 p-2 rounded-lg"
  >
    <p class="font-bold mb-2">Kamera</p>
    <div
      v-for="(button, index) in buttons"
      :key="index"
      :id="button.id"
      :class="[
        'btn btn-sm text-slate-300 bg-[#111115] hover:text-green-300',
        { 'text-[#23E6A1]': activeButton === index },
      ]"
      @click="setActive(index)"
    >
      {{ button.label }}
    </div>
  </div>
  <div
    class="fixed -right-20 -bottom-48 mt-1 text-slate-300 font-semibold bg-[#111115] w-72 p-2 rounded-lg"
  >
    <p>
      Stillas:
      <span class="text-green-300">{{ squareMeterScaffoldingCoverage }}</span>
      square meters
    </p>
    <p>
      Stillas-seksjoner:
      <span class="text-green-300">{{ scaffolding }} </span> scaffolding
    </p>
    <p>
      Tildekning:
      <span class="text-green-300"> {{ squareMeterBuildingCoverage }} </span>
      square meters
    </p>
  </div>
  <div
    id="scaffold-guidance"
    onclick="my_modal_3.showModal()"
    class="fixed -left-12 top-2 mt-1 btn bg-transparent border-none hover:bg-transparent text-amber-300 font-semibold tooltip tooltip-left"
    data-tip="help"
  >
    <span class="material-symbols-outlined"> help </span>
  </div>
  <dialog id="my_modal_3" class="modal">
    <div class="modal-box max-w-2xl h-screen bg-[#111115]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="text-lg font-bold">Guidance</h3>
      <p class="py-4">Add HTML/CSS Instructions here Anders</p>
    </div>
  </dialog>
  <div class="w-2">
    <ul class="timeline">
      <li class="ml-6 -top-4">
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="general-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="200"
              height="10"
              id="general-svg-line"
              stroke="white"
              stroke-width="2"
            >
              <line x1="-32" y1="0" x2="132" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-40 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="blueprint-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="102"
              height="10"
              stroke="white"
              stroke-width="2"
              id="blueprint-svg-line"
            >
              <line x1="18" y1="0" x2="60" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-10 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="roof-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="100"
              height="10"
              stroke="white"
              stroke-width="2"
              id="roof-svg-line"
            >
              <line x1="18" y1="0" x2="64" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-10 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="scaffold-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="100"
              height="10"
              stroke="white"
              stroke-width="2"
              id="scaffold-svg-line"
            >
              <line x1="18" y1="0" x2="86" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-16 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="supply-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { selectedStore, supplyStore } from "../store";

export default {
  setup() {
    const selected = selectedStore();

    // const depth = computed(() => componentStore.depth);
    const value = computed({
      // Make depth a computed property
      get: () => selected.selected,
      set: (value) => selected.updateSelected(value),
    });

    const supply = supplyStore();

    // Use computed properties to reactively access store state
    const scaffolding = computed({
      // Make length a computed property
      get: () => supply.scaffolding,
      set: (value) => supply.updateScaffolding(value),
    });

    const internalScaffolding = computed({
      // Make width a computed property
      get: () => supply.internalScaffolding,
      set: (value) => supply.updateInternalScaffolding(value),
    });

    const externalScaffolding = computed({
      // Make depth a computed property
      get: () => supply.externalScaffolding,
      set: (value) => supply.updateExternalScaffolding(value),
    });

    const squareMeterScaffoldingCoverage = computed({
      // Make depth a computed property
      get: () => supply.squareMetersOfScaffolding,
      set: (value) => supply.updateSquareMetersOfScaffolding(value),
    });

    const squareMeterBuildingCoverage = computed({
      // Make depth a computed property
      get: () => supply.squareMetersOfBuilding,
      set: (value) => supply.updateSquareMetersOfBuilding(value),
    });

    return {
      value,
      scaffolding,
      internalScaffolding,
      externalScaffolding,
      squareMeterScaffoldingCoverage,
      squareMeterBuildingCoverage,
    };
  },
  data() {
    return {
      activeButton: 1,
      buttons: [
        {
          label: "Orthographic",
          id: "toggle-orthographic",
        },
        {
          label: "Perspective",
          id: "toggle-perspective",
        },
      ],
    };
  },
  methods: {
    setActive(index: number) {
      this.activeButton = index;
    },
    updateActiveButton(index: number) {
      this.activeButton = index;
    },
  },
};
</script>
