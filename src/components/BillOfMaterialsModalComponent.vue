<template>
  <!-- Modal element for final payment... can only be accessed after reaching the supply page -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box bg-[#111115] max-w-2xl h-screen">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="font-semibold text-4xl my-4">Få tilbud på leie</h3>
      <div class="divider"></div>
      <div class="overflow-x-auto p-6">
        <h3 class="font-semibold text-2xl">Oppsummering</h3>
        <p class="text-sm my-2 font-semibold text-green-300" v-if="squareMeterScaffoldingCoverage > 0">
          Total Square Footage of Scaffolding Cover:
          {{ squareMeterScaffoldingCoverage }} square meters
        </p>
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Element</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr>
              <th>1</th>
              <td>Light scaffolding</td>
              <td>{{ scaffolding }}</td>
            </tr>
            <!-- row 2 -->
            <tr>
              <th>2</th>
              <td>Internal Staircase</td>
              <td>{{ internalScaffolding }}</td>
            </tr>
            <!-- row 3 -->
            <tr>
              <th>3</th>
              <td>External Staircase</td>
              <td>{{ externalScaffolding }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="m-4 flex justify-end">
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4">
            Avbryt
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
          >
            Få tilbud
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

    return {
      scaffolding,
      internalScaffolding,
      externalScaffolding,
      squareMeterScaffoldingCoverage,
    };
  },
};
</script>
