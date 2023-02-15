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
        @trig="getBookStock"
        id="button-show-record-book-of-stock"
      />
    </span>
    <Datatable
      :heads="['Kode item', 'Stock awal', 'Masuk', 'keluar', 'akhir']"
      :keys="['item_id', 'stockAwalShift1', 'incomeShift1', 'outputShift1', 'stockAwalShift2']"
      :datanya="state"
      keydata="id"
      no
      id="table-buku-stock"
    />
  </div>  
</template>

<script setup>
import { onMounted } from "vue";
import { getBookStock, state, date } from "./func"
import Datatable from "../../components/parts/Datatable.vue";
import datePicker from "vue3-datepicker"
import Button from "../../components/elements/Button.vue"

onMounted(() => {
    getBookStock()
})
</script>