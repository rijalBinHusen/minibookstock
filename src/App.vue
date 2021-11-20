<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
    <Navbar :navs="navbar" @navbar="toNav($event)" />
    <component @form="form = $event" :is="activeNav"></component>
    <Modal />
</template>

<script>
import Navbar from "./components/parts/Navbar.vue";
import Setting from "./components/Setting.vue";
import Modal from "./components/parts/Modal.vue"
import MasterItem from "./components/MasterItem.vue";
import Incoming from "./components/Incoming.vue";

export default {
  name: "App",
  data() {
    return {
      navbar: [
        { name: "Incoming", title: "Icoming", icon: "dice-d6" },
        { name: "Vehicles", title: "Vehicles", icon: "truck-moving" },
        { name: "Output", title: "Output", icon: "shopping-cart" },
        { name: "MasterItem", title: "Master Item", icon: "layer-group" },
        // { name: "Importer", title: "Importer", icon: "file-upload" },
        // { name: "Exporter", title: "Exporter", icon: "file-download" },
        { name: "Setting", title: "Setting", icon: "cog" },
      ],
      activeNav: "Setting",
      form: "",
    };
  },
  methods: {
    toNav(ev){
      this.activeNav = ev
    },
  },
  components: {
    Setting,
    Navbar,
    Modal,
    MasterItem,
    Incoming,
  },
  mounted() {
    this.$store.dispatch("getStart")
  },
}
</script>