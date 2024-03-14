<template>
  <div class="card w-full h-screen bg-inherit shadow-xl relative">
    <div class="card-body p-2">
      <div>
        Tegn området rundt bygget der stillaset skal stå, eller bruk
        Autostillas-funksjonen til å generere stillas rundt hele bygget 
      </div>
      <div class="divider"></div>
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

      <div class="bg-[#24242F] rounded flex flex-row my-4">
        <div>
          <img
            src="../assets/images/GeneralSection/Clipboard.svg"
            alt="Clipboard"
            class="w-20 mt-4 mx-2"
          />
        </div>
        <div>
          <p class="text-sm text-[#9E9E9E] m-4">
            Dersom avstanden mellom gulvet og fasaden er mer enn 30 cm - kreves
            rekkverk motfasaden
          </p>
        </div>
      </div>

      <div class="card-actions justify-end">
        <div class="m-4">
          <div
            class="btn btn-sm mr-4 border-1 border-white text-white"
            id="reset-scaffolding"
          >
            Reset
          </div>
          <div
            class="btn btn-sm btn-outline bg-[#623CEA] border-1 border-white text-white font-thin"
            id="autogenerate-scaffolding"
          >
            <img
              src="../assets/images/ScaffoldSection/MagicWand.svg"
              alt="Magic Wand"
              class="w-4 mx-0.5"
            />
            Autogenerer stillas
          </div>
        </div>
      </div>

      <div class="bg-[#24242F] rounded my-4">
        <div class="grid grid-cols-3">
          <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/DrawScaffoldingOutline.svg"
              class="object-contain"
            />
            <p class="">Tegn omriss rundt bygning</p>
          </div>
          <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2"
            id="generate-scaffolding"
          >
            <img
              src="../assets/images/ScaffoldSection/GenerateScaffolding.svg"
              class="object-contain"
            />
            <p>Generer stillas fra omriss</p>
          </div>
          <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2"
            @click="toggleDrawer"
          >
            <img
              src="../assets/images/ScaffoldSection//PlaceIndividualScaffolding.svg"
              class="object-contain"
            />
            <p>Plasser individuelle elementer</p>
          </div>
        </div>
      </div>

      <!-- Drawer element -->
      <div
        v-if="showDrawer"
        class="fixed rounded-lg w-48 bg-[#111115] overflow-y-auto shadow-lg z-55 top-10 right-0"
      >
        <div class="">
          <button class="btn btn-circle bg-inherit ml-32" @click="toggleDrawer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col">
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-3 mb-2 bg-[#14141C]"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/PlaceIndividualScaffolding.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-3 mb-2 bg-[#14141C]"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/Staircase.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-3 mb-2 bg-[#14141C]"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/Railing.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-3 mb-2 bg-[#14141C]"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/Banister.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-3 mb-2 bg-[#14141C]"
            id="draw-scaffold"
          >
            <img
              src="../assets/images/ScaffoldSection/Rudder.svg"
              class="object-contain"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text"
                >Tast inn avstand fra vegg
                <span class="label-text text-xs"
                  >(19 cm - 29 cm er standard)
                </span>
              </span>
            </div>
            <input
              type="text"
              placeholder="Antall meter"
              class="input input-sm input-bordered w-full max-w-xs"
            />
            <div class="label"></div>
          </label>
        </div>

        <div>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Antall stillas etasjer</span>
            </div>
            <div class="flex flex-row gap-1 border-black">
              <div
                class="btn text-2xl w-1/12"
                @click="decrement"
                id="remove-scaffolding-level"
              >
                -
              </div>
              <div class="btn text-2xl">
                <input
                  type="text"
                  v-model="level"
                  class="w-6 bg-inherit"
                  readonly
                  disabled
                />
              </div>
              <div
                class="btn text-2xl w-1/12"
                @click="increment"
                id="add-scaffolding-level"
              >
                +
              </div>
            </div>
            <div class="label"></div>
          </label>
        </div>
      </div>

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
import { computed } from "vue";
import { useStore } from "../store";

export default {
  setup() {
    const componentStore = useStore();

    // const depth = computed(() => componentStore.depth);
    const level = computed({
      // Make depth a computed property
      get: () => componentStore.level,
      set: (value) => componentStore.updateScaffoldLevel(value),
    });

    return {
      level,
    };
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  methods: {
    increment() {
      this.level++;
    },
    decrement() {
      if (this.level > 0) {
        this.level--;
      }
    },
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("supply");
      const svgElement = document.getElementById("scaffold-svg");
      const svgElementLine = document.getElementById("scaffold-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "#23E6A1";
        svgElementLine.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("roof");
      const svgElement = document.getElementById("roof-svg");
      const svgElementLine = document.getElementById("roof-svg-line");
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
