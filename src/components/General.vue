<template>
  <div class="card w-full h-screen bg-black shadow-xl">
    <div class="card-body p-2">
      <div>
        <p class="text-sm">Add general information about the project</p>
        <h2 class="text-sm">What kind of work is to be done?</h2>
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
      <div class="bg-black">
        We recommend spire heavy scaffolding for your area of ​​use
      </div>

      <div>
        <p class="text-sm">Velg Stillas</p>
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
        <p class="text-sm">Leverandør</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Layher</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Haki</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Uviktig</div>
        </div>
      </div>

      <div>
        <p class="text-sm">Type</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Lett</div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Tung</div>
        </div>
      </div>

      <div>
        Tungstillas passer til jobber som krever tyngre belastningsklasse
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
        <p class="text-sm">Skal stillaset benyttes av minimum to personer samtidig?</p>
        <div class="grid grid-cols-3 gap-3">
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Ja
          </div>
          <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">
            Nei
          </div>
        </div>
      </div>

      <div class="card-actions justify-end">
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
  </div>
</template>
