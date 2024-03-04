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
          class="input input-sm input-bordered w-full max-w-xs"
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
          class="btn btn-sm w-1/3 bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
        >
          <img
            src="../assets/images/RoofSection/Rotate.svg"
            alt="Select"
            class="w-6"
          />
        </div>
        <div class="label">
          <span class="label-text-alt text-xs">Rotér tak</span>
        </div>
      </label>
    </div>
  </div>

  <div class="bg-[#24242F] rounded flex flex-row my-4">
    <div>
      <img
        src="../assets/images/RoofSection/Info.svg"
        alt="Clipboard"
        class="w-32 mt-8 mx-2"
      />
    </div>
    <div>
      <p class="text-sm text-[#9E9E9E] m-4">
        På tak med takfall mer enn 20 grader, må man ha rekkverk som er minst 1
        m høyt. Rekkverket må være tett og ha en høyde avhengig av fallhøyden og
        avstanden fra kanten på taket til rekkverket.
      </p>
    </div>
  </div>

  <div>
    <p class="text-sm my-2">Stikker taket ut fra fasaden (overheng)?</p>
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
          class="input input-sm input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>
  </div>
</template>
