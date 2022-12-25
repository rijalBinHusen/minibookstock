<template>
    <div class="navbar mb-2 shadow-lg bg-base-200 text-base-content rounded-box">
  <div class="px-2 mx-2 navbar-start">
    <span class="text-lg font-bold">
            Book of stock
          </span>
  </div> 
  <div class="px-2 mx-2 navbar-center flex">
    <div class="flex items-stretch">
      <a v-for="nav in navs" :key="nav.title" @click="navigate(nav.name)" :class="['btn btn-ghost btn-sm rounded-btn uppercase', nav.name == active ? 'bg-base-100' : '']">
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
        { name: "Vehicles", title: "Kendaraan", icon: "truck-moving" },
        { name: "Incoming", title: "Icoming", icon: "dice-d6" },
        { name: "Output", title: "Output", icon: "shopping-cart" },
        { name: "MasterItem", title: "Master Item", icon: "layer-group" },
        // { name: "Importer", title: "Importer", icon: "file-upload" },
        // { name: "Exporter", title: "Exporter", icon: "file-download" },
        { name: "Setting", title: "Setting", icon: "cog" },
      ];

      const navigate = (nav) => {
        active.value = nav
        emit('navigate_to_navbar', nav)
      }
</script>