<template>
  <div>
    <p class="text-sm mb-2">Bruk rektangel knappen eller polygon-knappen</p>
  </div>

  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
    <div class="flex flex-col m-4">
      <div class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]">
        <img src="../assets/images/Select.svg" alt="Select" class="scale-150" />
      </div>
      <div><p class="text-xs text-center mt-2">Rektangel</p></div>
    </div>
    <div class="flex flex-col m-4">
      <div class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767]">
        <img src="../assets/images/Delete.svg" alt="Select" class="scale-150" />
      </div>
      <div><p class="text-xs text-center mt-2">Polygon</p></div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-8">
    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Lengde (m)</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>

    <div>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Bredde (m)</span>
        </div>
        <input
          type="text"
          placeholder="Antall meter"
          class="input input-bordered w-full max-w-xs"
        />
        <div class="label"></div>
      </label>
    </div>

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
        <div class="label"></div>
      </label>
    </div>
  </div>
</template>
