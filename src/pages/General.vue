<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div>
        <p class="text-sm mb-2">Tilføy generell informasjon om prosjektet</p>
        <h2 class="text-sm mb-4">Hva slags jobb skal gjøres?</h2>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Fasadearbeid
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Malerarbeid
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Tømrerarbeid
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Muring</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Spesialjobb
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Blanding</div>
        </div>
      </div>
      <div class="text-sm mb-2">
        Vi anbefaler spir tungstillas til ditt bruksområde
      </div>

      <div>
        <p class="text-sm mb-4">Velg Stillas</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Spir stillas
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Ramme stillas
          </div>
        </div>
      </div>

      <div>
        <p class="text-sm mb-4">Leverandør</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Layher</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Haki</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Uviktig</div>
        </div>
      </div>

      <div>
        <p class="text-sm mb-4">Type</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Lett</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Tung</div>
        </div>
      </div>

      <div class="bg-[#24242F] rounded flex flex-row my-8">
        <div>
          <img
            src="../assets/images/GeneralSection/Lightbulb.svg"
            alt="Lightbulb"
          />
        </div>
        <div>
          <p class="text-sm mt-3 text-[#9E9E9E]">
            Tungstillas passer til jobber som krever tyngre belastningsklasse
          </p>
        </div>
      </div>

      <div>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Hvor skal jobben gjennomføres?</span>
            <span class="label-text-alt">Top Right label</span>
          </div>
          <input
            type="text"
            placeholder="Tast inn adresse"
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <div class="label">
            <span class="label-text-alt text-[#623CEA]"
              >Referanse vindhastighet: 22 m/s</span
            >
            <span class="label-text-alt">Bottom Right label</span>
          </div>
        </label>
      </div>

      <div class="">
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Estimert tid stillaset skal stå</span>
            <span class="label-text-alt">Top Right label</span>
          </div>
          <input
            type="text"
            placeholder="Ca antall dager"
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <div class="label">
            <span class="label-text-alt text-[#623CEA]">Bottom Left Label</span>
            <span class="label-text-alt">Bottom Right label</span>
          </div>
        </label>
      </div>

      <div>
        <p class="text-sm mb-4">
          Skal stillaset benyttes av minimum to personer samtidig?
        </p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Ja</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Nei</div>
        </div>
      </div>

      <div class="bg-[#24242F] rounded flex flex-row my-4">
        <div>
          <img
            src="../assets/images/GeneralSection/Clipboard.svg"
            alt="Clipboard"
            class="w-32 mt-8 mx-2"
          />
        </div>
        <div>
          <p class="text-sm text-[#9E9E9E] m-4">
            Stillas som er høyere enn 5 m og lengre enn 10 m som blir benyttet
            av flere enn to personer samtidig - må ha separate oppganger og
            trappetårn
          </p>
        </div>
      </div>

      <div>
        <h2 class="text-sm mb-2">Hva slags underlag skal stillaset stå på?</h2>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlock.svg"
              class="object-contain"
            />
            <p class="">Grus og stein</p>
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockAsphalt.svg"
              class="object-contain"
            />Asfalt
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockSand.svg"
              class="object-contain"
            />
            Grov sand
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockFineSand.svg"
              class="object-contain"
            />
            Fin sand
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockClay.svg"
              class="object-contain"
            />
            Leire
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockGrass.svg"
              class="object-contain"
            />
            Gress
          </div>
          <div class="btn btn-xl h-28 btn-outline hover:bg-[#23E6A1]">
            <img
              src="../assets/images/GeneralSection/TerrainBlockMixed.svg"
              class="object-contain"
            />
            Blandet
          </div>
        </div>
      </div>

      <div class="card-actions justify-end">
        <div class="m-4">
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4">
            Avslutt
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
  components: {},
  data() {
    return {};
  },
  methods: {
    goToNextPage() {
      // @ts-ignore
      window.setActiveSection("blueprint");
      const svgElement = document.getElementById("general-svg");
      const svgElementLine = document.getElementById("general-svg-line");
      if (svgElement && svgElementLine) {
        svgElement.style.stroke = "#23E6A1";
        svgElementLine.style.stroke = "#23E6A1";
      } else {
        console.error("timeline not found");
      }
    },
  },
};
</script>
