<template>
      <div
        id="incoming_add_form"
        class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
      >  
      <!-- NO DO -->
      <!-- NO SO -->
      <!-- REGISTER -->
      <!-- PLAT NOMOR -->
      <!-- CUSTOMER -->
        <div id="incoming_add_form" class="grid justify-items-center">
            <div id="incoming_paper" class="flex justify-self-start gap-4">
              <!-- NO DO -->
            <Input
              label="Nomor DO"
              @send="incoming.idPaper = $event"
              placeholder="Masukkan nomor DO"
              tipe="primary"
            />
              <!-- NO SO -->
            <Input
              label="Nomor SO"
              @send="incoming.handed = $event"
              placeholder="Masukkan Nomor SO"
              tipe="primary"
            />
        </div>
            
            <div id="incoming_items" class="grid grid-cols-3 gap-4 mb-2">
              <!-- PLAT NOMOR -->
            <Input
              label="Plat nomor"
              @send="mutation.item = $event"
              placeholder="Masukkan plat nomor"
              tipe="primary"
              />
                <!-- CUSTOMER -->  
            <Input
              label="Customer"
              @send="mutation.qty = $event"
              placeholder="Nama Customer"
              tipe="primary"
            />
              <!-- REGISTER -->
            <Input
              label="Register"
              @send="tgl = $event"
              placeholder="Register"
              tipe="primary"
            />
          </div>
  
          <div id="incoming_add_submit" class="w-full">
            <Button type="button" @trig="save" primary value="Submit" />
          </div>
        </div>
      </div>
  </template>
  
  <script>
  import datePicker from "vue3-datepicker";
  import Select from "../components/elements/Forms/Select.vue";
  import Input from "../components//elements/Forms/Input.vue";
  import Button from "../components//elements/Button.vue";
  import Table from "../components//elements/Table.vue";
  
  export default {
    name: "IncomingForm",
    data() {
      return {
          datetime: new Date(),
          incoming: {
              idPaper: "",
              comeFrom: "",
              handed: "",
              received: "",
              detail: "",
              responsible: "",
          },
          mutation: {
              date: new Date(),
              shift: "",
              parent: "",
              type: "",
              location: "",
              item: "",
              qty: "",
          },
      };
    },
    methods: {
      save() {
        this.$store.dispatch("Incoming/append", {
          tanggal: this.tanggal,
          shift: this.shift,
          come: this.come,
          paperId: this.paperId,
          handBy: this.handBy,
          received: this.received,
          items: this.items,
        });
      },
      add() {
        if (this.item && this.qty && this.tgl)
          this.items.unshift({
            item: this.item,
            qty: this.qty,
            tgl: this.tgl,
          });
      },
    },
    components: {
      Select,
      Input,
      Button,
      Table,
      datePicker,
    },
    mounted() {
      this.$store.state.form.document 
          ? console.log(this.$store.getters["Mutation/incomingId"](
              this.$store.state.form.document 
          ))
          : ""
    },
  };
  </script>
  