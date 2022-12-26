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
            @selectedd="shift == $event"
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
            @selectedd="type == $event"
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

        <!-- 
          Item picker
         -->
         <PickItemVue 
          v-for="(stock, index) in stockMaster" 
          :key="stock.item" 
          :item="stock.item"
          :kd_produksi="stock.kd_produksi"
          :quantity="stock.quantity"
          :product_created="stock.product_created" 
          :index="index"
          @valueChanged="handleValueChanged"         
        />
         <!-- End of Item picker -->
        <div id="incoming_item_add" class="w-full text-right mb-2">
          <Button 
            type="button" 
            primary 
            @trig="addItem" 
            value="Add items" 
            small />
        </div>

        <!-- <Table
          v-if="items.length > 0"
          :contents="items"
          style="max-height: 200px; overflow: auto"
        /> -->

        <div id="incoming_add_submit" class="w-full">
          <!-- @trig="save"  -->
          <Button type="button" 
          primary value="Submit" />
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
import Table from "../components/elements/Table.vue";
import { ref, onMounted } from "vue";
import PickItemVue from "../components/PickItem.vue";
import { gettingStartedRecord, Jurnal_produk_masuk } from "../composables/Setting_JurnalId"

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
const stockMaster = ref([
  { item: '', quantity: "0", kd_produksi: '', product_created: new Date().getTime() }
])

// to add new item form
const addItem = () => {
  stockMaster.value.unshift(stockMaster.value.slice(-1))
}

// now index
const nowIndexProgressChanged = ref(null)
// timeout
const timeout = ref(null)

// value changed from child
const handleValueChanged = (e) => {
  // e = { index: props.index, value: { ...props, [key]: value} }
  const index = e["index"]
  const value = e["value"]

  // if the same index
  console.log(e)
  if(nowIndexProgressChanged.value === index) {
    clearTimeout(timeout)
    timeout.value = setTimeout(() => {
      // stockmaster[index] = { setKey: setValue }
      stockMaster.value[index] = value
    }, 300)
  }
  // else 
  else {
    // mark index
    nowIndexProgressChanged.value = index
    timeout.value = setTimeout(() => {
      // stockmaster[index] = { setKey: setValue }
      stockMaster.value[index] = value
      console.log(stockMaster.value)
    }, 300)
  }
}


onMounted( async () => {
  await gettingStartedRecord()
})

</script>
