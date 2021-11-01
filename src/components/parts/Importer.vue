<template>
  <div class="bg-base-200 w-6/12 p-2">
    <p class="text-3xl text-center">Import Data</p>
    <form @submit.prevent>
      <Input 
        type="file"
        tipe="primary"
        accept=".js"
        label="Import awal"
        button="Import"
        ref="importerField"
        @change="impor($event)"
      />
      <Input 
        type="file"
        tipe="primary"
        accept=".js"
        label="Import data"
        button="Import"
      />
    </form>
  </div>
</template>

<script>
import Input from "../elements/Forms/Input.vue"
export default {
  name: "ImporterForm",
  methods: {
    impor(ev) {
      const reader = new FileReader();

      //when reading is completed load
      reader.onload = (event) => this.send(event.target.result);

      reader.readAsText(ev.target.files[0]);
    },
    send(val) {
      //send data to vuex
    //   this.$store.dispatch("ExIm/importerData", val);
      console.log(val);
      console.log(btoa(val))
    },
  },
  components: {
    Input,
  },
};
</script>