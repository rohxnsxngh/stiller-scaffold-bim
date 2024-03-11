<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
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
        <p class="text-sm mb-4 mt-8">Tildekking av stillas</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/SupplySection/Tablecloth.svg"
              class="object-contain"
            />
            <p class="">Duk</p>
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/SupplySection/Presenting.svg"
              class="object-contain"
            />
            <p>Presenning</p>
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/SupplySection/ShrinkPlastic.svg"
              class="object-contain"
            />
            <p>Krympeplast</p>
          </div>
        </div>
      </div>

      <div class="bg-[#24242F] rounded flex flex-row my-4">
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
      </div>

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
import BillOfMaterialsModalComponent from "../components/BillOfMaterialsModalComponent.vue";

export default {
  components: {
    BillOfMaterialsModalComponent,
  },
  methods: {
    goToNextPage() {
      // @ts-ignore
      // open modal
      const svgElement = document.getElementById("supply-svg");
      if (svgElement) {
        svgElement.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("scaffold");
      const svgElement = document.getElementById("scaffold-svg");
      const svgElementCurrent = document.getElementById("supply-svg");
      const svgElementLine = document.getElementById("scaffold-svg-line");
      if (svgElement && svgElementLine && svgElementCurrent) {
        svgElement.style.stroke = "white";
        svgElementLine.style.stroke = "white";
        svgElementCurrent.style.stroke = "white";
      } else {
        console.error("timeline not found");
      }
    },
  },
};
</script>
