<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <router-link :to="{ name: 'Home' }">
        <label class="btn btn-ghost text-xl text-red-500"
          >Logo</label
        ></router-link
      >
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li class="bg-red-500 text-white font-semibold rounded">
          <a href="/model">New Model</a>
        </li>
        <span class="material-symbols-outlined mx-2 text-3xl"> login </span>
      </ul>
    </div>
  </div>
</template>
