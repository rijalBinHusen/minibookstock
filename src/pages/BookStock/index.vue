<template>
  <div>
    <span class="flex items-center justify-center">
      <div class="form-control ml-2">
        <label for="date-picker" class="label">
          <span class="label-text">Tanggal</span>
        </label>
        <date-picker
          id="date-picker"
          class="input input-outline input-primary input-sm"
          v-model="date"
        ></date-picker>
      </div>
      <SelectShift class="ml-2 mr-2 w-24" :shift="nowShift" @selectedShift="nowShift = $event" />
      <div class="form-control ml-2">
        <label class="label">
          <span class="label-text">Aksi</span>
        </label>
        <Button
          v-if="showBtn" 
          primary
          value="Tampilkan"
          type="button"
          small
          class="ml-2"
          @trig="getRecord"
          id="button-show-record-book-of-stock"
        />
        <Button
          v-if="!showBtn && renderTable"
          primary
          value="Export"
          type="button"
          small
          class="ml-2"
          @trig="printStock"
          id="button-export-record-book-of-stock"
        />
      </div>
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
import { onMounted, ref, watch, computed } from "vue";
import { getBookStock, state, date, nowShift, printStock  } from "./func"
import Datatable from "../../components/parts/Datatable.vue";
import datePicker from "vue3-datepicker"
import Button from "../../components/elements/Button.vue"
import SelectShift from "../../components/parts/SelectShift.vue"

const renderTable = ref(false)

const showBtn = ref(false)

watch([date, nowShift], (newVal, oldVal) => {
  // date
  if(newVal[0] !== oldVal[0]) {
    showBtn.value = true
  }
  // nowShift
  if(newVal[1] !== oldVal[1]) {
    reRenderTable()
  }
})

const headsTable =['Kode item', 'Nama item', 'Stock awal', 'Masuk', 'keluar', 'Stock akhir']

const rowTable = computed(() => {
  if(nowShift.value == 1 ) {
    return ['itemKode', 'itemName', 'stockAwalShift1', 'incomeShift1', 'outputShift1', 'stockAwalShift2']
  } 
  
  else if(nowShift.value == 2) {
    return ['itemKode', 'itemName', 'stockAwalShift2', 'incomeShift2', 'outputShift2', 'stockAwalShift3']
  }

  else if(nowShift.value == 3) {
    return ['itemKode', 'itemName', 'stockAwalShift3', 'incomeShift3', 'outputShift3', 'stockAwalShift4']
  }

  else if(nowShift.value == 4) {
    return ['itemKode', 'itemName', 'stockAwalShift4', 'incomeShift4', 'outputShift4', 'quantity']
  }
})

const reRenderTable = () => {
  renderTable.value = false
  setTimeout(() => {
    renderTable.value = true
  }, 150)
}

const getRecord = async () => {
  showBtn.value = false
  renderTable.value = false
  await getBookStock()
  reRenderTable()
}

onMounted(() => {
  getRecord()
})
</script>