<template>
  <!-- Modal element for final payment... can only be accessed after reaching the supply page -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box bg-[#111115] max-w-2xl h-screen">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="font-semibold text-4xl my-4">Få tilbud på leie</h3>
      <div class="divider"></div>
      <div class="overflow-x-auto p-6">
        <h3 class="font-semibold text-2xl">Oppsummering</h3>
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Element</th>
              <th>Antall</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr>
              <th>1</th>
              <td>Lett stillas</td>
              <td>***</td>
            </tr>
            <!-- row 2 -->
            <tr>
              <th>2</th>
              <td>OSB</td>
              <td>20 stk</td>
            </tr>
            <!-- row 3 -->
            <tr>
              <th>3</th>
              <td>Trappetårn</td>
              <td>2</td>
            </tr>

            <tr>
              <th>4</th>
              <td>Plattform</td>
              <td>2</td>
            </tr>

            <tr>
              <th>5</th>
              <td>Heis</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="m-4 flex justify-end">
          <div class="btn btn-sm btn-outline hover:bg-[#23E6A1] mr-4">
            Avbryt
          </div>
          <div
            class="btn btn-sm btn-outline hover:bg-[#23E6A1] border-2 border-[#23E6A1] hover:border-[#23E6A1]"
          >
            Få tilbud
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
