<template>
  <div class="card w-full h-screen bg-inherit shadow-xl relative">
    <div class="card-body p-2">
      <div>
        Tegn området rundt bygget der stillaset skal stå, eller bruk
        Autostillas-funksjonen til å generere stillas rundt hele bygget 
      </div>
      <div class="divider"></div>
      <GeneralTools />

      <div class="bg-[#24242F] rounded">
        <div class="flex flex-row mt-4">
          <div>
            <img
              src="../assets/images/GeneralSection/Clipboard.svg"
              alt="Clipboard"
              class="w-20 mt-4 mx-2"
            />
          </div>
          <div>
            <p class="text-sm text-[#9E9E9E] m-4">
              BETA: Bruk ‘Autogenerer stillas’ til å automatisk generere stillas
              rundt hele bygningen du har tegnet! PS: Fungerer ikke på
              BIM-objekter
            </p>
          </div>
        </div>
        <div
          class="btn btn-sm btn-outline bg-[#623CEA] border-1 border-white text-white font-thin w-72 mb-2 ml-10"
          id="autogenerate-scaffolding"
          @click="triggerToast"
        >
          <img
            src="../assets/images/ScaffoldSection/MagicWand.svg"
            alt="Magic Wand"
            class="w-4 mx-0.5"
          />
          Autogenerer stillas
        </div>
      </div>

      <ToastComponent ref="toastAuto" type="success" message="Voila!" />

      <div class="bg-[#14141C] rounded mt-4">
        <div class="card-actions justify-left">
          <div class="p-4">
            <div class="text-sm font-semibold my-1">Slett stillas</div>
            <div class="join join-horizontal my-2">
              <button
                class="btn btn-sm join-item order-1 border-white text-white"
                id="delete-row-scaffolding"
              >
                Slett rad
              </button>
              <button
                class="btn btn-sm join-item order-1 border-white text-white"
                id="delete-column-scaffolding"
              >
                Slett kolonne
              </button>
              <button
                class="btn btn-sm join-item order-1 border-white text-white"
                id="reset-scaffolding"
              >
                Slett all stillas
              </button>
            </div>
            <!-- <div
              class="btn btn-sm btn-outline bg-[#623CEA] border-1 border-white text-white font-thin w-full mt-3"
              id="autogenerate-scaffolding"
            >
              <img
                src="../assets/images/ScaffoldSection/MagicWand.svg"
                alt="Magic Wand"
                class="w-4 mx-0.5"
              />
              Autogenerer stillas
            </div> -->
          </div>
        </div>
      </div>

      <div class="bg-[#24242F] rounded my-4">
        <div class="grid grid-cols-3">
          <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2"
            id="draw-scaffold"
            @click="toggleDisabledButton"
          >
            <img
              src="../assets/images/ScaffoldSection/DrawScaffoldingOutline.svg"
              class="object-contain"
            />
            <p class="">Tegn omriss rundt bygning</p>
          </div>
          <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2 disabled"
            id="generate-scaffolding"
            data-disabled="true"
          >
            <img
              src="../assets/images/ScaffoldSection/GenerateScaffolding.svg"
              class="object-contain"
            />
            <p>Generer stillas fra omriss</p>
          </div>
          <!-- <div
            class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2"
            @click="toggleDrawer"
          >
            <img
              src="../assets/images/ScaffoldSection//PlaceIndividualScaffolding.svg"
              class="object-contain"
            />
            <p>Plasser individuelle elementer</p>
          </div> -->
        </div>
      </div>

      <!-- Drawer element -->
      <div
        v-if="showDrawer"
        class="fixed rounded-lg w-48 bg-[#111115] overflow-y-auto shadow-lg z-55 top-15 right-0 border border-white"
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
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-8 mb-2 bg-[#14141C]"
            id="scaffold-external-staircase"
          >
            <img
              src="../assets/images/ScaffoldSection/PlaceIndividualScaffolding.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-8 mb-2 bg-[#14141C]"
            id="scaffold-internal-staircase"
          >
            <img
              src="../assets/images/ScaffoldSection/Staircase.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-8 mb-2 bg-[#14141C]"
          >
            <img
              src="../assets/images/ScaffoldSection/Railing.svg"
              class="object-contain"
            />
          </div>
          <div
            class="btn btn-xl h-32 w-32 btn-outline hover:bg-[#23E6A1] ml-8 mb-2 bg-[#14141C]"
          >
            <img
              src="../assets/images/ScaffoldSection/Banister.svg"
              class="object-contain"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-8">
        <!-- <div>
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
        </div> -->

        <div>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Antall stillas etasjer</span>
            </div>
            <div class="flex flex-row gap-1 border-black">
              <div
                class="btn text-2xl w-1/12"
                id="remove-scaffolding-level"
                :class="{ 'disabled-class': !isScaffolding }"
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
                  :class="{ 'disabled-class': !isScaffolding }"
                />
              </div>
              <div
                class="btn text-2xl w-1/12"
                id="add-scaffolding-level"
                :class="{ 'disabled-class': !isScaffolding }"
              >
                +
              </div>
            </div>
            <div class="label"></div>
          </label>
        </div>
      </div>

      <ToastComponent
        ref="toast"
        type="info"
        message="Kamera endret til ‘Se ovenfra’ og ‘Isometrisk"
      />

      <div class="card-actions justify-end">
        <div class="m-4">
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4"
            @click="goToPreviousPage"
            id="go-to-previous-roof"
          >
            Tilbake
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
            @click="goToNextPage"
            id="go-to-next-supply"
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
import { supplyStore, useStore } from "../store";
import GeneralTools from "../components/GeneralTools.vue";
import ToastComponent from "../components/Toast.vue";

export default {
  setup() {
    const componentStore = useStore();

    // const depth = computed(() => componentStore.depth);
    const level = computed({
      // Make depth a computed property
      get: () => componentStore.level,
      set: (value) => componentStore.updateScaffoldLevel(value),
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

    const isScaffolding = computed(() => {
      return scaffolding.value > 0;
    });

    return {
      level,
      isScaffolding,
      scaffolding,
      internalScaffolding,
      externalScaffolding,
    };
  },
  components: {
    GeneralTools,
    ToastComponent,
  },
  data() {
    return {
      showDrawer: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    toggleDisabledButton() {
      console.log("toggle");
      const div = document.getElementById("generate-scaffolding");
      if (div !== null) {
        const isDisabled = div.getAttribute("data-disabled") === "true";

        if (isDisabled) {
          div.removeAttribute("data-disabled");
          div.classList.remove("disabled");
        } else {
          div.setAttribute("data-disabled", "true");
          div.classList.add("disabled");
        }
      } else {
        console.error("Element with ID 'generate-scaffolding' not found.");
      }
      //@ts-ignore
      this.$refs.toast.show();
    },
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("supply");
      const svgElement = document.getElementById("roof-svg");
      const svgElementLine = document.getElementById("roof-svg-line");
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
      const svgElement = document.getElementById("blueprint-svg");
      const svgElementLine = document.getElementById("blueprint-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "white";
        svgElementLine.style.stroke = "white";
      } else {
        console.error("timeline not found");
      }
    },
    triggerToast() {
      //@ts-ignore
      this.$refs.toastAuto.show();
    },
  },
};
</script>

<style scoped>
.disabled-class {
  pointer-events: none;
  opacity: 0.5;
}
</style>
