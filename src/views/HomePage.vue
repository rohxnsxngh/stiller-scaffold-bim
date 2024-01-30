<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <div class="hero min-h-screen bg-base-200">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl text-white font-bold">
              Scaffolding done with innovation
            </h1>
            <p class="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <label
              for="my-drawer"
              class="btn drawer-button bg-red-500 hover:bg-red-400 text-white"
              >Get started</label
            >
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <a class="btn btn-ghost text-xl text-red-500 mb-10">Logo</a>
        <div class="card w-full bg-red-500 shadow-xl mb-10 hover:bg-red-400 hover:translate-x-6 duration-300">
          <div class="card-body">
            <h2 class="card-title text-white justify-center text-3xl">New Model</h2>
            <span class="material-symbols-outlined text-black text-7xl text-center">
              deployed_code_update
            </span>
          </div>
        </div>
        <div class="card w-full bg-red-500 shadow-xl hover:bg-red-400 hover:translate-x-6 duration-300">
          <div class="card-body">
            <h2 class="card-title text-white justify-center text-3xl">Projects</h2>
            <span class="material-symbols-outlined text-black text-7xl text-center">
              deployed_code_account
            </span>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
