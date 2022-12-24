<template>
  <div id="my-modal" class="modal bg-base-200">
    <a
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
</template>

<script setup>
import Loader from "./Loader.vue";
import IncomingForm from "../IncomingForm.vue";
import Vehicles from "../../form/Vehicles.vue";
import { useStore } from 'vuex'
import { computed, onMounted } from "vue";

const store = useStore()

const closeModal = () => {
  store.commit("form", { form: "", document: "" });
  window.location.href = "#";
}

const currentForm = computed(() => {
  return store.state.form.form
})

const forms = {
  Loader, IncomingForm, Vehicles
}

onMounted(() => {
  window.addEventListener('keydown', function (e) {
      if(e.keyCode == 27) {
        closeModal()
      }
    })
})

</script>
