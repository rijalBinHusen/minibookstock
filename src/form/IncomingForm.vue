<template>
  <div>
    <div
      id="incoming_add_form"
      class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
    >
      <div id="incoming_add_mode" class="grid justify-items-center">
        <!-- <Select 
            tipe="primary" 
                :options="[
                    { status: 0, option: 'No paper'},
                    { status: 1, option: 'With paper' }
                ]"
            value="status"
            text="option"
        /> -->
      </div>

      <div id="incoming_add_form" class="grid justify-items-center">
        <!-- incoming info paper dll -->
        <div id="incoming_info" class="grid grid-cols-3 gap-4">
          <!-- date picker -->
          <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Tanggal</span>
            </label>
            <date-picker
              id="date-picker"
              class="input input-outline input-primary input-sm"
              v-model="date"
              :upper-limit="date"
            ></date-picker>
          </div>
          <!-- end of date picker -->

          <!-- Shift -->
          <div class="form-control">
            <label for="shift" class="label">
              <span class="label-text">Shift</span>
            </label>
            <Select
            @selectedd="shift = $event"
              id="shift"
                :options="[
                    { shift: 1 },
                    { shift: 2 },
                    { shift: 3 },
                ]"
              value="shift"
              text="shift"
              size="primary small"
            />
          </div>
          <!-- end of Shift -->

          <!-- Coming from -->
          <div class="form-control">
            <label for="type" class="label">
              <span class="label-text">Asal produk</span>
            </label>
            <Select
            @selectedd="type = $event"
              id="type"
              :options="Jurnal_produk_masuk"
              value="id"
              text="nama_jurnal"
              size="primary small"
            />
          </div>
          <!-- End of coming from -->
        </div>

        <div id="incoming_paper" class="grid grid-cols-3 gap-4">
          <Input
            label="Nomor dokumen"
            @send="paper_id = $event"
            small
            placeholder="Nomor dokumen"
            tipe="primary"
          />
          <Input
            label="Yang menyerahkan"
            @send="diserahkan = $event"
            small
            placeholder="Yang menyerahkan"
            tipe="primary"
          />
          <Input
            label="Penerima"
            small
            @send="diterima = $event"
            placeholder="Penerima"
            tipe="primary"
          />
        </div>

        <!-- Item picker -->
         <PickItemVue @stock-added="handleStock"/>
         <!-- End of Item picker -->
        

        <div id="incoming_add_submit" class="w-full mt-4">
          <Button type="button" 
          @trig="handleSubmit" 
          primary value="Submit" 
          small
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Select from "../components/elements/Forms/Select.vue";
import Input from "../components/elements/Forms/Input.vue";
import Button from "../components/elements/Button.vue";
import PickItemVue from "../components/PickItem.vue";
import { ref, onMounted } from "vue";
import { gettingStartedRecord, Jurnal_produk_masuk } from "../composables/Setting_JurnalId"
import { createIncoming } from "../composables/Incoming"
import { closeModalOrDialog } from "../composables/launchForm"

// date record
const date = ref(new Date())
// shift record
const shift = ref(1)
// type incom product
const type = ref(null)
// paper id record
const paper_id = ref(null)
// handed by record
const diserahkan = ref(null)
// receiver product
const diterima = ref(null)
// master stock
const stockChild = ref([])

// to add new item form
const handleStock = (e) => {
  stockChild.value = e.map((stock) => stock?.id)
}

const handleSubmit = () => {
  if(date.value && shift.value && type.value && paper_id.value && diserahkan.value && diterima.value && stockChild.value) {
    // create incoming transaction
    createIncoming(stockChild.value, paper_id.value, date.value, shift.value, diterima.value, type.value, diserahkan.value, null)
    // close modal
    closeModalOrDialog()
  } else {
    alert("Tidak boleh ada form yang kosong")
  }
}


onMounted( async () => {
  await gettingStartedRecord()
})

</script>
