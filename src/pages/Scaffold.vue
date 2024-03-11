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
              <div class="btn text-2xl w-1/12" @click="decrement">-</div>
              <div class="btn text-2xl">{{ count }}</div>
              <div class="btn text-2xl w-1/12" @click="increment">+</div>
            </div>
            <div class="label"></div>
          </label>
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
          <div class="btn btn-sm mr-4 border-1 border-white text-white">
            Reset
          </div>
          <div
            class="btn btn-sm btn-outline bg-[#623CEA] border-1 border-white text-white font-thin"
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
          <div class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2">
            <img
              src="../assets/images/ScaffoldSection/DrawScaffoldingOutline.svg"
              class="object-contain"
            />
            <p class="">Tegn omriss rundt bygning</p>
          </div>
          <div class="btn btn-xl h-32 btn-outline hover:bg-[#23E6A1] m-2">
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
        class="fixed inset-48 rounded w-64 bg-white bg-[#111115] overflow-y-auto shadow-lg z-55"
      >
        <!-- <div class="card-body p-2">
            <div>
              Tegn området rundt bygget der stillaset skal stå, eller bruk
              Autostillas-funksjonen til å generere stillas rundt hele bygget 
            </div>
            <div class="divider"></div>
          </div> -->
        <!-- Scrollable content -->
        <!-- Add your content here -->
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
export default {
  data() {
    return {
      count: 3,
      showDrawer: false,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      if (this.count > 0) {
        this.count--;
      }
    },
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("supply");
    },
    goToPreviousPage() {
      // @ts-ignore
      window.setActiveSection("roof");
    },
  },
};
</script>
