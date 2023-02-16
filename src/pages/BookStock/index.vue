<template>
  <div>
    <span class="flex items-center justify-center">
      <span class="text-3xl">Tanggal</span><date-picker
        class="ml-2 bg-base-200 p-2 rounded"
        v-model="date"
        id="date-book-of-stock"
      >
      </date-picker>
      <Button
        primary
        value="Tampilkan"
        type="button"
        small
        class="ml-2"
        @trig="getRecord"
        id="button-show-record-book-of-stock"
      />
    </span>
    <Datatable
      v-if="renderTable"
      :heads="headsTable"
      :keys="rowTable"
      :datanya="state"
      keydata="id"
      no
      id="table-buku-stock"
    />
  </div>  
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getBookStock, state, date } from "./func"
import Datatable from "../../components/parts/Datatable.vue";
import datePicker from "vue3-datepicker"
import Button from "../../components/elements/Button.vue"

const renderTable = ref(false)

const headsTable = [
  'Kode item', 'Nama item', 
  'Stock awal 1', 'Masuk 1', 'keluar 1',
  'Stock awal 2', 'Masuk 2', 'keluar 2',
  'Stock awal 3', 'Masuk 3', 'keluar 3',
  'Stock awal 4', 'Masuk 4', 'keluar 4',
]

const rowTable = [
  'item_id', 'itemName', 
  'stockAwalShift1', 'incomeShift1', 'outputShift1', 
  'stockAwalShift2', 'incomeShift2', 'outputShift2',
  'stockAwalShift3', 'incomeShift3', 'outputShift3', 
  'quantity', 'incomeShift4', 'outputShift4'
]

const getRecord = async () => {
  renderTable.value = false
  await getBookStock()
  setTimeout(() => {
    renderTable.value = true
  }, 400)
}

onMounted(() => {
  getRecord()
})
</script>