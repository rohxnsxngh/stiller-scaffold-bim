<template>
  <!-- Modal element for final payment... can only be accessed after reaching the supply page -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box bg-[#111115] max-w-2xl h-screen">
      <form method="dialog">
        <button
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          id="close-modal-button"
        >
          ✕
        </button>
      </form>
      <h3 class="font-semibold text-4xl my-4">Oppsummering</h3>
      <div class="divider"></div>
      <div class="overflow-x-auto p-6">
        <h3 class="font-semibold text-2xl">Oppsummering</h3>
        <p
          class="text-sm my-2 font-semibold"
          v-if="squareMeterScaffoldingCoverage > 0"
        >
          Total Square Footage of Scaffolding Cover:
          <span class="text-green-300">{{
            squareMeterScaffoldingCoverage
          }}</span>
          square meters
        </p>

        <p
          class="text-sm my-2 font-semibold"
          v-if="squareMeterBuildingCoverage > 0"
        >
          Total Square Footage of Buildings Modeled:
          <span class="text-green-300"> {{ squareMeterBuildingCoverage }}</span>
          square meters
        </p>

        <p class="text-sm my-2 font-semibold" v-if="scaffolding > 0">
          Total Amount of Scaffolding:
          <span class="text-green-300"> {{ scaffolding }}</span>
          scaffolding
        </p>
        <!-- <table class="table table-zebra">

          <thead>
            <tr>
              <th></th>
              <th>Element</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
     
            <tr>
              <th>1</th>
              <td>Light scaffolding</td>
              <td>{{ scaffolding }}</td>
            </tr>
        
            <tr>
              <th>2</th>
              <td>Internal Staircase</td>
              <td>{{ internalScaffolding }}</td>
            </tr>
        
            <tr>
              <th>3</th>
              <td>External Staircase</td>
              <td>{{ externalScaffolding }}</td>
            </tr>
          </tbody>
        </table> -->
      </div>
      <div>
        <div class="m-4 flex justify-end">
          <form method="dialog">
            <div
              class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
              @click="goToPreviousPage"
            >
              Avbryt
            </div>
          </form>

          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            @click="goToNextPage"
          >
            Tilbake til anbudet
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts">
import { computed } from "vue";
import { supplyStore } from "../store";

export default {
  setup() {
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
      scaffolding,
      internalScaffolding,
      externalScaffolding,
      squareMeterScaffoldingCoverage,
      squareMeterBuildingCoverage,
    };
  },
  methods: {
    goToNextPage() {
      // @ts-ignore
      const svgElement = document.getElementById("supply-svg");
      if (svgElement) {
        svgElement.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("supply");
      const svgElement = document.getElementById("supply-svg");
      if (svgElement) {
        svgElement.style.stroke = "white";
      } else {
        console.error("timeline not found");
      }

      // Open the modal
      const modalElement = document.getElementById("my_modal_1");
      if (modalElement && modalElement instanceof HTMLDialogElement) {
        modalElement.close();
      } else {
        console.error("Modal element not found or not an HTMLDialogElement");
      }
    },
  },
};
</script>
