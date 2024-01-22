<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <Navbar @navigate_to_navbar="toNav($event)" />
  <component style="min-height: 24rem" :is="activeNav"></component>
  <Modal v-if="formActive" />
  <Confirm v-if="dialogActive" />
  <FooterVue />
  <!-- <Toast /> -->
</template>

<script>
import Navbar from './components/Navbar.vue';
import Setting from './pages/Settings/Setting.vue';
import Modal from './components/parts/Modal.vue';
import MasterItem from './pages/MasterItems/MasterItem.vue';
import Incoming from './pages/Incoming/Incoming.vue';
// import VehiclesVue from './pages/Vehicles/Vehicles.vue';
import ConfirmDialogVue from './components/ConfirmDialog.vue';
import Output from './pages/Output/Output.vue';
import StockMaster from './pages/StockMasters/StockMaster.vue';
import SalesOrders from './pages/SalesOrders/SalesOrders.vue';
import StockCard from './pages/StockCards/StockCard.vue';
import SlowMoving from './pages/SlowMoving.vue';
import SummaryStockMaster from './pages/SummaryStockMaster.vue';
import Transaction from './pages/Transaction.vue';
import FooterVue from './components/Footer.vue';
import { getStockThatAvailable } from './pages/StockMasters/StockMaster';
import { CheckMigration } from './utils/databaseMigration';
import BookStock from "./pages/BookStock/index.vue"
import Toast from './components/parts/Toast.vue';

export default {
  name: 'App',
  data() {
    return {
      activeNav: 'Setting',
      form: '',
      subscribe: null,
      formActive: false,
      dialogActive: false,
    };
  },
  methods: {
    toNav(ev) {
      this.activeNav = ev;
    },
  },
  components: {
    Setting,
    Navbar,
    Modal,
    MasterItem,
    Incoming,
    // Vehicles: VehiclesVue,
    Confirm: ConfirmDialogVue,
    Output,
    StockMaster,
    SalesOrders,
    StockCard,
    SlowMoving,
    SummaryStockMaster,
    Transaction,
    BookStock,
    // Toast
  },
  mounted() {
    // subscribe mutation to know when modal or dialog trigger to activate it
    this.subscribe = this.$store.subscribe((mutation) => {
      // if the confirmation button clicked whatever yes or no
      if ('form' == mutation?.type && mutation?.payload) {
        this.formActive = true;
      } else if ('confirmPayload' == mutation?.type && mutation?.payload) {
        this.dialogActive = true;
      } else {
        this.formActive = false;
        this.dialogActive = false;
      }
    });
    getStockThatAvailable();
    CheckMigration();
  },
};
</script>
./pages/MasterItems/StockMaster