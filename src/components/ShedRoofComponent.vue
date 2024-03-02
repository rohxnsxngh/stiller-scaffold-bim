<template>
  <div class="grid grid-cols-2 gap-8">
    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Høyde (m)</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-bordered w-full max-w-xs"
        />
        <div class="label">
          <span class="label-text-alt text-[#623CEA]"
            >Kalkulert vinkel: 18°</span
          >
        </div>
      </label>
    </div>

    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Roter tak</span>
        </div>
        <div
          class="btn btn-md w-1/2 bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
        >
          <img
            src="../assets/images/RoofSection/Rotate.svg"
            alt="Select"
            class="scale-25"
          />
        </div>
        <div class="label">
          <span class="label-text-alt text-xs">Rotér tak</span>
        </div>
      </label>
    </div>
  </div>

  <div>
    <p class="text-sm mb-2">Stikker taket ut fra fasaden (overheng)?</p>
    <div class="grid grid-cols-3 gap-3">
      <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Ja</div>
      <div class="btn btn-xs btn-outline hover:bg-[#23E6A1]">Nei</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-8">
    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Hvor mye ut?</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>
  </div>
</template>
