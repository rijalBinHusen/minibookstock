<template>
  <div class="navbar mb-2 shadow-lg bg-base-200 text-base-content rounded-box">
    <div class="px-2 mx-2 navbar-start">
      <!-- Burger -->
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg id="drop-down-toggle" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-primary rounded-box w-52">
          <li  v-for="nav in dropdownNavs" :key="nav.title" >
            <a :id="'navigation-'+nav.title.replace(' ', '-')" @click="navigate(nav.name)" :class="['text-sm text-black rounded-btn uppercase', nav.name == active ? 'bg-base-100' : '']">
                {{ nav.title }}
              <font-awesome-icon class="m-2" :icon="nav.icon" />
            </a>
          </li>
        </ul>
      </div>
      <!-- End of Burger -->
      <span class="text-lg font-bold">
        Book of stock
      </span>
    </div>
    <div class="px-2 mx-2 navbar-center flex">
      <div class="flex items-stretch">
        <a :id="'navgiation-'+nav.title.replace(' ', '-')" v-for="nav in navs" :key="nav.title" @click="navigate(nav.name)" :class="['btn btn-ghost btn-sm rounded-btn uppercase', nav.name == active ? 'bg-base-100' : '']">
                <span class="hidden md:block">
          {{ nav.title }}
          </span>
          <font-awesome-icon class="m-2" :icon="nav.icon" />
        </a>
      </div>
    </div>
    <div class="navbar-end">
        <span class="btn btn-ghost btn-sm rounded-btn">
          Credit
          <font-awesome-icon class="ml-2" icon="info-circle" />
        </span>
    </div>
</div>

</template>

<script setup>
import { ref } from 'vue';


      const emit = defineEmits(['navigate_to_navbar'])

      const active = ref(null)

      const navs = [
        { name: "Incoming", title: "produk masuk", icon: "dice-d6" },
        // { name: "Vehicles", title: "Kendaraan", icon: "truck-moving" },
        { name: "Output", title: "produk keluar", icon: "shopping-cart" },
        // { name: "Exporter", title: "Exporter", icon: "file-download" },
      ];

      const dropdownNavs = [
        { name: "StockMaster", title: "stock master", icon: "box" },
        { name: "SalesOrders", title: "sales orders", icon: "newspaper" },
        { name: "StockCard", title: "kartu stock", icon: "list-ol" },
        { name: "SlowMoving", title: "slow moving", icon: "tape" },
        { name: "MasterItem", title: "master Item", icon: "layer-group" },
        { name: "Setting", title: "setting", icon: "cog" },
      ]

      const navigate = (nav) => {
        active.value = nav
        emit('navigate_to_navbar', nav)
      }
</script>
