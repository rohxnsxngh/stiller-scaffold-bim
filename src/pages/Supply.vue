<template>
  <div class="card w-full h-screen bg-inherit shadow-xl">
    <div class="card-body p-2">
      <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
        <div class="flex flex-col m-4">
          <div
            class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
          >
            <img
              src="../assets/images/Select.png"
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
              src="../assets/images/Delete.png"
              alt="Select"
              class="scale-150"
            />
          </div>
          <div><p class="text-xs text-center mt-2">Delete</p></div>
        </div>
      </div>

      <div class="card-actions justify-end">
        <div class="m-4">
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4">
            Tilbake
          </div>
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1]">Neste</div>
        </div>
      </div>
    </div>
  </div>
</template>
