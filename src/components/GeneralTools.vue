<template>
  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded">
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
        id="top-view"
      >
        <i class="material-icons text-[#0084FF]">fullscreen</i>
      </div>
      <div><p class="text-xs text-center mt-2">Top View</p></div>
    </div>
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
        id="free-rotate"
      >
        <i class="material-icons text-[#E14767]">pan_tool</i>
      </div>
      <div><p class="text-xs text-center mt-2">Edit Labels</p></div>
    </div>
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#393924] rounded-lg border-2 border-[#E9D733]"
        id="delete-object"
      >
        <i class="material-icons text-[#E9D733]">delete</i>
      </div>
      <div><p class="text-xs text-center mt-2">Delete Object</p></div>
    </div>
    <div class="flex flex-col m-4">
      <div
        class="btn btn-md bg-[#221F41] rounded-lg border-2 border-[#623CEA]"
        id="reset-scene"
      >
        <i class="material-icons text-[#623CEA]">reset_tv</i>
      </div>
      <div><p class="text-xs text-center mt-2">Reset Scene</p></div>
    </div>
  </div>
</template>
