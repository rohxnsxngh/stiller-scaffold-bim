<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <GeneralTools />

      <div class="mb-8">
        <p class="text-sm mb-4 mt-8 font-semibold">Tildekking av stillas</p>
        <button
          id="delete-sheeting"
          class="btn btn-sm mb-2 border-white text-white text-xs"
        >
          Delete all
        </button>
        <div class="grid grid-cols-3 gap-3">
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            id="cloth-sheet"
          >
            <img
              src="../assets/images/SupplySection/Tablecloth.svg"
              class="object-contain"
            />
            <p class="">Duk</p>
          </div>
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            id="tarp-sheet"
          >
            <img
              src="../assets/images/SupplySection/Presenting.svg"
              class="object-contain"
            />
            <p>Presenning</p>
          </div>
          <div
            class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]"
            id="shrink-wrap-sheet"
          >
            <img
              src="../assets/images/SupplySection/ShrinkPlastic.svg"
              class="object-contain"
            />
            <p>Krympeplast</p>
          </div>
        </div>
      </div>

      <!-- <div class="bg-[#24242F] rounded flex flex-row my-4">
        <div>
          <img
            src="../assets/images/GeneralSection/Clipboard.svg"
            alt="Clipboard"
            class="w-32 mt-8 mx-6"
          />
        </div>
        <div>
          <div class="text-sm text-[#9E9E9E] m-4 p-6">
            <span class="font-semibold text-[#623CEA]">Udekket stillas</span>
            <p class="my-2">
              Anbefalt forankring hver 4m i høyden/vertikal. Stillasbredde
              0,7mbør kryssforankres for hver fjerde feste Stillasbredde 1m
              børkryssforankres for hver tredje feste
            </p>

            <span class="font-semibold text-[#623CEA]">
              Stillas dekket med netting</span
            >
            <p class="my-2">
              Anbefalt forankring hver 4m i høyden/vertikal. Kryssforankes
              forhvert tredje feste
            </p>

            <span class="font-semibold text-[#623CEA]">
              Stillas dekket med presenning
            </span>
            <p class="mt-2">
              Må forankret hver 2m i høyden/vertikal. Kryssforankes forhvert
              femte feste
            </p>
          </div>
        </div>
      </div> -->

      <div class="">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Forankringstetthet</span>
            <span class="label-text-alt">info</span>
          </div>
          <input
            type="text"
            placeholder="hver 2 m"
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <div class="label">
            <span class="label-text-alt text-[#623CEA]">Bottom Left Label</span>
            <span class="label-text-alt">Bottom Right label</span>
          </div>
        </label>
      </div>

      <BillOfMaterialsModalComponent />

      <div class="card-actions justify-end">
        <div class="m-4">
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
            @click="goToPreviousPage"
            id="go-to-previous-scaffold"
          >
            Tilbake
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            id="generate-supply"
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
import BillOfMaterialsModalComponent from "../components/BillOfMaterialsModalComponent.vue";
import GeneralTools from "../components/GeneralTools.vue";

export default {
  components: {
    BillOfMaterialsModalComponent,
    GeneralTools,
  },
  methods: {
    goToNextPage() {
      // @ts-ignore
      const svgElement = document.getElementById("scaffold-svg");
      const svgElementLine = document.getElementById("scaffold-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "#23E6A1";
        svgElementLine.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
      if (svgElement) {
        svgElement.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }

      // Open the modal
      const modalElement = document.getElementById("my_modal_1");
      if (modalElement && modalElement instanceof HTMLDialogElement) {
        modalElement.showModal();
      } else {
        console.error("Modal element not found or not an HTMLDialogElement");
      }
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("scaffold");
      // const svgElement = document.getElementById("scaffold-svg");
      // const svgElementCurrent = document.getElementById("supply-svg");
      // const svgElementLine = document.getElementById("scaffold-svg-line");
      // if (svgElement && svgElementLine && svgElementCurrent) {
      //   svgElement.style.stroke = "white";
      //   svgElementLine.style.stroke = "white";
      //   svgElementCurrent.style.stroke = "white";
      // } else {
      //   console.error("timeline not found");
      // }
      const svgElement = document.getElementById("roof-svg");
      const svgElementLine = document.getElementById("roof-svg-line");
      const svgElement2 = document.getElementById("scaffold-svg");
      const svgElementLine2 = document.getElementById("scaffold-svg-line");
      if (svgElement && svgElementLine && svgElement2 && svgElementLine2) {
        svgElement.style.stroke = "white";
        svgElementLine.style.stroke = "white";
        svgElement2.style.stroke = "white"
        svgElementLine2.style.stroke = "white";
      } else {
        console.error("timeline not found");
      }
    },
  },
};
</script>
