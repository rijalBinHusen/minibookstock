<template>
  <div>
    <input checked type="checkbox" id="my-modal" class="modal-toggle" />
    <div id="my-modal" class="modal bg-base-200">
      <!-- hide the close button when show loader spinner -->
      <a
        v-if="currentForm !== 'Loader'"
        @click="closeModal"
        class="btn fixed btn-secondary right-0 top-0 m-10 justify-self-end"
      >
        <font-awesome-icon icon="times-circle" />
      </a>
      <div class="w-full mx-20 my-2 p-2">
        <component :is="forms[currentForm]"></component>
        <!-- <Loader /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from './Loader.vue';
import IncomingForm from '../../pages/Incoming/IncomingForm.vue';
import VehiclesForm from '../../pages/Vehicles/VehiclesForm.vue';
import OutputForm from '../../pages/Output/OutputForm.vue';
import ResultBookStockComparedShow from '../../pages/BookStock/ResultBookStockComparedShow.vue';
import SelectSheet from '../../pages/BookStock/SelectSheet.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { closeModalOrDialog } from '../../utils/launchForm';

const store = useStore();

const closeModal = () => {
  closeModalOrDialog()
};

const currentForm = computed(() => {
  return store.state.form?.form;
});

const forms = {
  Loader,
  IncomingForm,
  VehiclesForm,
  OutputForm,
  ResultBookStockComparedShow,
  SelectSheet,
};
</script>
