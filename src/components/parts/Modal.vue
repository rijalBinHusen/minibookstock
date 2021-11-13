<template>
  <div id="my-modal" class="modal bg-base-200">
    <a
      @click="close"
      v-if="form !== 'ListGudang'"
      class="btn fixed btn-secondary right-0 top-0 m-10 justify-self-end"
    >
      <font-awesome-icon icon="times-circle" />
    </a>
    <div class="w-full mx-20 my-2 p-2">
      <component :is="form"></component>
      <!-- <Loader /> -->
    </div>
  </div>
</template>

<script>
import Loader from "./Loader.vue";
import IncomingForm from "../IncomingForm.vue";

export default {
  name: "Modal",
  props: {
    form: {
      type: String,
      required: true,
    },
  },
  components: {
    Loader,
    IncomingForm,
  },
  methods: {
    close(){
      this.$store.commit("form", { form: "", document: "" });
      this.window.location.href = "#";
    }
  },
  computed: {
    form() {
      return this.$store.state.form.form;
    },
  },
};
</script>
