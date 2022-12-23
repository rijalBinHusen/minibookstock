<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
    <Navbar @navigate_to_navbar="toNav($event)" />
      <component :is="activeNav"></component>
    <Modal />
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Setting from "./pages/Setting.vue";
import Modal from "./components/parts/Modal.vue"
import MasterItem from "./pages/MasterItem.vue";
import Incoming from "./pages/Incoming.vue";
import VehiclesVue from "./pages/Vehicles.vue";

export default {
  name: "App",
  data() {
    return {
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
    Vehicles: VehiclesVue,
  },
  mounted() {
    // this.$store.dispatch("getStart")
  },
}
</script>