<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div>Opprett tak på bygget</div>
      <GeneralTools />

      <div class="mb-8">
        <p class="text-sm mb-2 mt-8">Velg et alternativ</p>
        <div class="grid grid-cols-3 gap-3">
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showFlatRoof"
            id="create-flat-roof"
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
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
            @click="goToPreviousPage"
            id="go-to-previous-blueprint"
          >
            Tilbake
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            @click="goToNextPage"
            id="go-to-next-scaffold"
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
import GeneralTools from "../components/GeneralTools.vue";

export default {
  components: {
    ShedRoofComponent,
    FlatRoofComponent,
    GableRoofComponent,
    GeneralTools,
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
      // const svgElement = document.getElementById("roof-svg");
      // const svgElementLine = document.getElementById("roof-svg-line");
      // if (svgElement && svgElementLine) {
      //   svgElement.style.stroke = "#23E6A1";
      //   svgElementLine.style.stroke = "#23E6A1";
      // } else {
      //   console.error("timeline not found");
      // }
      const svgElement = document.getElementById("blueprint-svg");
      const svgElementLine = document.getElementById("blueprint-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "#23E6A1";
        svgElementLine.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("blueprint");
      // const svgElement = document.getElementById("blueprint-svg");
      // const svgElementLine = document.getElementById("blueprint-svg-line");
      // if (svgElement && svgElementLine) {
      //   svgElement.style.stroke = "white";
      //   svgElementLine.style.stroke = "white";
      // } else {
      //   console.error("timeline not found");
      // }
      const svgElement = document.getElementById("general-svg");
      const svgElementLine = document.getElementById("general-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "white";
        svgElementLine.style.stroke = "white";
      } else {
        console.error("timeline not found");
      }
    },
  },
};
</script>
