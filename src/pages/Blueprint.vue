<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div>Oppgi byggets ytre mål</div>
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
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
            @click="goToPreviousPage"
          >
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
import DrawBlueprint from "../components/DrawBlueprintComponent.vue";
import UploadBlueprint from "../components/UploadBlueprintComponent.vue";

export default {
  components: {
    DrawBlueprint,
    UploadBlueprint,
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
      window.setActiveSection("general");
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
