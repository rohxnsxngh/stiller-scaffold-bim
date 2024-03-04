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
      <div role="tablist" class="tabs tabs-bordered tab-xl">
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          class="tab text-xl mx-14"
          aria-label="Kontaktinformasjon"
          checked
        />
        <div role="tabpanel" class="tab-content">
          <div class="grid grid-cols-2 gap-8 p-6">
            <div>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Fullt navn (Kontaktperson)</span>
                </div>
                <input
                  type="text"
                  placeholder="Anders Gill"
                  class="input input-md input-bordered w-full max-w-xs"
                />
                <div class="label"></div>
              </label>
            </div>

            <div>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Epost</span>
                </div>
                <input
                  type="text"
                  placeholder="test@test.com"
                  class="input input-md input-bordered w-full max-w-xs"
                />
                <div class="label"></div>
              </label>
            </div>

            <div>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Telefon</span>
                </div>
                <input
                  type="text"
                  placeholder="+47 48087363"
                  class="input input-md input-bordered w-full max-w-xs"
                />
                <div class="label"></div>
              </label>
            </div>

            <div>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Ønsket oppstart</span>
                </div>
                <input
                  type="date"
                  placeholder="12.05.2024"
                  class="input input-md input-bordered w-full max-w-xs"
                />
                <div class="label"></div>
              </label>
            </div>
          </div>
          <div>
            <label class="form-control w-full p-6">
              <div class="label">
                <span class="label-text">Noe mer du ønsker å tilføye?</span>
              </div>
              <textarea
                placeholder="comment here"
                class="textarea textarea-bordered textarea-sm w-full max-w-xl"
              ></textarea>
              <div class="label"></div>
            </label>
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

        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          class="tab text-xl mx-14"
          aria-label="Oppsummering"
        />
        <div role="tabpanel" class="tab-content">
          <div class="overflow-x-auto p-10">
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
      </div>
    </div>
  </dialog>
</template>
