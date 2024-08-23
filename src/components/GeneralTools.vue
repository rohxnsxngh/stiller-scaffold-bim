<template>
  <div class="bg-[#14141C] grid grid-cols-4 gap-4 rounded p-1">
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
        id="top-view"
      >
        <i class="material-icons text-[#0084FF]">fullscreen_exit</i>
      </div>
      <div><p class="text-xs text-center mt-2">Top View</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#3A1D23] rounded-lg border-2 border-[#E14767]"
        id="free-rotate"
      >
        <i class="material-icons text-[#E14767]">pan_tool</i>
      </div>
      <div><p class="text-xs text-center mt-2">Rotate</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#393924] rounded-lg border-2 border-[#E9D733]"
        id="delete-object"
      >
        <i class="material-icons text-[#E9D733]">delete</i>
      </div>
      <div><p class="text-xs text-center mt-2">Delete Object</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#221F41] rounded-lg border-2 border-[#623CEA]"
        id="reset-scene"
      >
        <i class="material-icons text-[#623CEA]">reset_tv</i>
      </div>
      <div><p class="text-xs text-center mt-2">Reset Scene</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#355E3B] rounded-lg border-2 border-[#0BDA51]"
        id="move-geometry"
      >
        <i class="material-symbols-outlined text-[#0BDA51]">drag_pan</i>
      </div>
      <div><p class="text-xs text-center mt-2">Move Building</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#393924] rounded-lg border-2 border-[#E9D733]"
        id="delete-building"
      >
        <i class="material-icons text-[#E9D733]"> home_work</i>
      </div>
      <div><p class="text-xs text-center mt-2">Delete Building</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#592E00] rounded-lg border-2 border-[#FF8C00]"
        id="rotate-geometry"
      >
        <i class="material-symbols-outlined text-[#FF8C00]">settings_backup_restore</i>
      </div>
      <div><p class="text-xs text-center mt-2">Rotate Building</p></div>
    </div>
    <div class="flex flex-col mx-4">
      <div
        class="btn btn-md bg-[#122A45] rounded-lg border-2 border-[#0084FF]"
        id="screenshot-button"
      >
        <i class="material-icons text-blue-400"> photo_camera</i>
      </div>
      <div><p class="text-xs text-center mt-2">Capture Scene</p></div>
    </div>
  </div>
</template>
