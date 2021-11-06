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
    async send(val) {
      this.$store.commit("form", "Loader")
      window.location.href = "#my-modal";
      // sperate by new line
      let newLine = val.split("\n");
      // iterate and sperate by comma
      for (let i = 0; i < newLine.length; i ++) {
        let comma = newLine[i].split(",")

        let model = {
            Group: {
              id: comma[1],
              warehouse: comma[2],
              name_group: comma[3],
              status: true
            },
            Item: {
              id: comma[1], 
              item_group: comma[2],
              item_kode: comma[3],
              item_name: comma[4],
            },
            Master: {
              id: comma[1],
              master_item: comma[2],
              master_ed: comma[3],
              master_qty: comma[4],
            },
            Mutation: {
              id: comma[1],
              tanggal: comma[2],
              shift: comma[3],
              parent: comma[4],
              type: comma[5],
              location: comma[6],
              item: comma[7],
              qty: comma[8]
            },
            Output: {
              id: comma[1],
              document: comma[2],
              destination: comma[3],
              handed: comma[4],
              responsible: comma[5],
              detail: comma[6],
              vehicle: comma[7],
            },
            Incoming: {
              id: comma[1],
              idPaper: comma[2],
              comeFrom: comma[3],
              handed: comma[4],
              received: comma[5],
              detail: comma[6],
              responsible: comma[7],
            },
            Vehicle: {
              id: comma[1],
              quee: comma[2],
              licensePlate: comma[3],
              location: comma[4],
              register: comma[5],
              loadStart: comma[6],
              loadFinish: comma[7],
            }
          };  
          // if(comma.length === 5)
          await this.$store.dispatch("append", {
            store: comma[0], obj: model[comma[0]]
          })
      }
      window.location.href = "#";
    },
  },
  components: {
    Input,
  },
};
</script>