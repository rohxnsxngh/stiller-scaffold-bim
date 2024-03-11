<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div>Opprett tak på bygget</div>
      <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
        <div class="flex flex-col m-4">
          <div
            class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
          >
            <img
              src="../assets/images/Select.svg"
              alt="Select"
              class="scale-150"
            />
          </div>
          <div><p class="text-xs text-center mt-2">Select</p></div>
        </div>
        <div class="flex flex-col m-4">
          <div
            class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
          >
            <img
              src="../assets/images/Delete.svg"
              alt="Select"
              class="scale-150"
            />
          </div>
          <div><p class="text-xs text-center mt-2">Delete</p></div>
        </div>
      </div>

      <div class="mb-8">
        <p class="text-sm mb-2 mt-8">Velg et alternativ</p>
        <div class="grid grid-cols-3 gap-3">
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showFlatRoof"
          >
            <img
              src="../assets/images/RoofSection/FlatRoof.svg"
              class="object-contain"
            />
            <p class="">Flatt</p>
          </div>
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showGableRoof"
          >
            <img
              src="../assets/images/RoofSection/GableRoof.svg"
              class="object-contain"
            />
            <p>Saltak</p>
          </div>
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showShedRoof"
          >
            <img
              src="../assets/images/RoofSection/ShedRoof.svg"
              class="object-contain"
            />
            <p>Pulttak</p>
          </div>
        </div>
      </div>

      <ShedRoofComponent v-if="showShed" />
      <GableRoofComponent v-if="showGable" />
      <FlatRoofComponent v-if="showFlat" />

      <div class="card-actions justify-end">
        <div class="m-4">
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
          @click="goToPreviousPage">
            Tilbake
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            @click="goToNextPage"
          >
            Neste
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ShedRoofComponent from "../components/ShedRoofComponent.vue";
import FlatRoofComponent from "../components/FlatRoofComponent.vue";
import GableRoofComponent from "../components/GableRoofComponent.vue";

export default {
  components: {
    ShedRoofComponent,
    FlatRoofComponent,
    GableRoofComponent,
  },
  data() {
    return {
      showShed: false,
      showGable: false,
      showFlat: false,
    };
  },
  methods: {
    showShedRoof() {
      this.showShed = true;
      this.showGable = false;
      this.showFlat = false;
    },
    showGableRoof() {
      this.showShed = false;
      this.showGable = true;
      this.showFlat = false;
    },
    showFlatRoof() {
      this.showShed = false;
      this.showGable = false;
      this.showFlat = true;
    },
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("scaffold");
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("blueprint");
    },
  },
};
</script>
