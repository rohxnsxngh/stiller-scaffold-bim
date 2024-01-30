<template>
  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content">
      <!-- Page content here -->
      <div class="flex flex-row place-content-between">
        <div class="ml-10">
          <h1 class="text-4xl text-white font-semibold">Projects</h1>
        </div>
        <div class="mr-10">
          <label
            for="my-drawer"
            class="btn drawer-button bg-red-500 hover:bg-red-400 text-white"
            ><span class="material-symbols-outlined"> menu </span></label
          >
        </div>
      </div>
      <div class="p-6">
        <div class="card card-compact w-96 bg-gray-900 shadow-xl">
          <figure>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjDMShhy_6f4jEfrAAHojraxPEqzRrieCppV6nRnxrFsrqzvhjvs-pb3IR9DwodjRXLQA&usqp=CAU"
              alt="Project"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title justify-center">Project 1</h2>
            <div class="card-actions justify-end"></div>
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
        <router-link :to="{ name: 'Home' }">
          <label class="btn btn-ghost text-xl w-full mb-5 text-red-500"
            >Logo</label
          ></router-link
        >
        <div
          class="card w-full bg-red-500 shadow-xl mb-10 hover:bg-red-400 hover:translate-x-6 duration-300"
        >
          <!-- <router-link :to="{ name: 'ModelPage' }"> -->
          <a href="/model">
            <div class="card-body">
              <h2 class="card-title text-white justify-center text-3xl">
                New Model
              </h2>
              <span
                class="material-symbols-outlined text-black text-7xl text-center"
              >
                deployed_code_update
              </span>
            </div>
          </a>
          <!-- </router-link> -->
        </div>
        <div
          class="card w-full bg-red-500 shadow-xl hover:bg-red-400 hover:translate-x-6 duration-300"
        >
          <router-link :to="{ name: 'ProjectsPage' }">
            <div class="card-body">
              <h2 class="card-title text-white justify-center text-3xl">
                Projects
              </h2>
              <span
                class="material-symbols-outlined text-black text-7xl text-center"
              >
                deployed_code_account
              </span>
            </div>
          </router-link>
        </div>
      </ul>
    </div>
  </div>
</template>
