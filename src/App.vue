<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
    <Navbar />
    <!-- <component :is="comp"></component> -->
</template>

<script>
import Navbar from "./components/parts/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  }
}
</script>