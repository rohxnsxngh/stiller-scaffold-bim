<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div class="font-semibold">Oppgi byggets ytre mål</div>
      <GeneralTools />

      <div class="mb-8">
        <p class="text-sm mb-2 mt-8 font-semibold">Velg et alternativ</p>
        <div class="grid grid-cols-3 gap-3">
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showDrawBlueprint"
          >
            <img
              src="../assets/images/BlueprintSection/Blueprint.svg"
              class="object-contain"
            />
            <p class="">Tegne selv</p>
          </div>
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            @click="showUploadBlueprint"
          >
            <img
              src="../assets/images/BlueprintSection/UploadBlueprint.svg"
              class="object-contain"
            />
            <p>Opplastning</p>
          </div>
        </div>
      </div>

      <!-- Conditional rendering of components -->
      <DrawBlueprint v-if="showDraw" />
      <UploadBlueprint v-if="showUpload" />

      <div class="card-actions justify-end">
        <div class="m-4">
          <!-- <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
            @click="goToPreviousPage"
            id="go-to-previous-general"
          >
            Tilbake
          </div> -->
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            @click="goToNextPage"
            id="go-to-next-roof"
          >
            Neste
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DrawBlueprint from "../components/DrawBlueprintComponent.vue";
import UploadBlueprint from "../components/UploadBlueprintComponent.vue";
import GeneralTools from "../components/GeneralTools.vue";

export default {
  components: {
    DrawBlueprint,
    UploadBlueprint,
    GeneralTools,
  },
  data() {
    return {
      showDraw: false,
      showUpload: false,
    };
  },
  methods: {
    showDrawBlueprint() {
      this.showDraw = true;
      this.showUpload = false;
    },
    showUploadBlueprint() {
      this.showDraw = false;
      this.showUpload = true;
    },
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("roof");
      // const svgElement = document.getElementById("blueprint-svg");
      // const svgElementLine = document.getElementById("blueprint-svg-line");
      // if (svgElement && svgElementLine) {
      //   svgElement.style.stroke = "#23E6A1";
      //   svgElementLine.style.stroke = "#23E6A1";
      // } else {
      //   console.error("timeline not found");
      // }
      const svgElement = document.getElementById("general-svg");
      const svgElementLine = document.getElementById("general-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "#23E6A1";
        svgElementLine.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
    // goToPreviousPage() {
    //   // @ts-ignore
    //   window.setActiveSection("general");
    //   const svgElement = document.getElementById("general-svg");
    //   const svgElementLine = document.getElementById("general-svg-line");
    //   if (svgElement && svgElementLine) {
    //     svgElement.style.stroke = "white";
    //     svgElementLine.style.stroke = "white";
    //   } else {
    //     console.error("timeline not found");
    //   }
    // },
  },
};
</script>
