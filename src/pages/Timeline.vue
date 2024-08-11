<template>
  <div
    ref="selected"
    class="fixed -right-0 -bottom-12 mt-1 text-amber-300 font-semibold"
  >
    {{ value }}
  </div>
  <div
    id="scaffold-guidance"
    onclick="my_modal_3.showModal()"
    class="fixed -left-12 top-2 mt-1 btn bg-transparent border-none hover:bg-transparent text-amber-300 font-semibold shadow-lg tooltip tooltip-left"
    data-tip="help"
  >
    <span class="material-symbols-outlined"> help </span>
  </div>
  <dialog id="my_modal_3" class="modal">
    <div class="modal-box max-w-2xl h-screen bg-[#111115]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="text-lg font-bold">Guidance</h3>
      <p class="py-4">Add HTML/CSS Instructions here Anders</p>
    </div>
  </dialog>
  <div class="w-2">
    <ul class="timeline">
      <li class="ml-10 -top-4">
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="general-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="200"
              height="10"
              id="general-svg-line"
              stroke="white"
              stroke-width="2"
            >
              <line x1="-32" y1="0" x2="100" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-32 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="blueprint-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="102"
              height="10"
              stroke="white"
              stroke-width="2"
              id="blueprint-svg-line"
            >
              <line x1="18" y1="0" x2="102" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-20 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="roof-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="100"
              height="10"
              stroke="white"
              stroke-width="2"
              id="roof-svg-line"
            >
              <line x1="18" y1="0" x2="64" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-10 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="scaffold-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="absolute top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 10"
              width="100"
              height="10"
              stroke="white"
              stroke-width="2"
              id="scaffold-svg-line"
            >
              <line x1="18" y1="0" x2="86" y2="0" />
            </svg>
          </div>
        </div>
        <hr />
      </li>
      <li class="ml-16 -top-4">
        <hr />
        <div class="timeline-middle">
          <div class="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-5 h-5"
              stroke="white"
              stroke-width="1"
              id="supply-svg"
            >
              <path
                fill="none"
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { selectedStore } from "../store";

export default {
  setup() {
    const selected = selectedStore();

    // const depth = computed(() => componentStore.depth);
    const value = computed({
      // Make depth a computed property
      get: () => selected.selected,
      set: (value) => selected.updateSelected(value),
    });

    return {
      value,
    };
  },
};
</script>
