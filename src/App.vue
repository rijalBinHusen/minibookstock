<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
    <Navbar :navs="navbar" @navbar="toNav($event)" />
    <!-- <component :is="comp"></component> -->
</template>

<script>
import Navbar from "./components/parts/Navbar.vue";

export default {
  name: "App",
  data() {
    return {
      navbar: [
        { name: "Incoming", title: "Icoming", icon: "dice-d6" },
        { name: "Vehicles", title: "Vehicles", icon: "truck-moving" },
        { name: "Output", title: "Output", icon: "shopping-cart" },
        { name: "MasterItems", title: "Master Items", icon: "layer-group" },
        // { name: "Importer", title: "Importer", icon: "file-upload" },
        // { name: "Exporter", title: "Exporter", icon: "file-download" },
        { name: "Setting", title: "Setting", icon: "cog" },
      ],
    };
  },
  methods: {
    toNav(ev){
      console.log(ev);
    },
  },
  components: {
    Navbar,
  }
}
</script>