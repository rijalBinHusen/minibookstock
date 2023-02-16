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
          <span class="label-text">[]</span>
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
import { getBookStock, state, date } from "./func"
import Datatable from "../../components/parts/Datatable.vue";
import datePicker from "vue3-datepicker"
import Button from "../../components/elements/Button.vue"
import SelectShift from "../../components/parts/SelectShift.vue"

const renderTable = ref(false)

const nowShift = ref(1)
const showBtn = ref(false)

watch([date], () => {
  showBtn.value = true
})

const headsTable =['Kode item', 'Nama item', 'Stock awal', 'Masuk', 'keluar', 'Stock akhir']

const rowTable = computed(() => {
  let res = [ 'item_id', 'itemName' ]

  if(nowShift.value == 1 ) {
    res = res.concat(['stockAwalShift1', 'incomeShift1', 'outputShift1', 'stockAwalShift2'])
  } 
  
  else if(nowShift.value == 2) {
    res = res.concat(['stockAwalShift2', 'incomeShift2', 'outputShift2', 'stockAwalShift3'])
  }

  else if(nowShift.value == 3) {
    res = res.concat(['stockAwalShift3', 'incomeShift3', 'outputShift3', 'quantity'])
  }

  else if(nowShift.value == 4) {
    res = res.concat(['quantity', 'incomeShift4', 'outputShift4', 'quantity'])
  }
  return res
})

const reRenderTable = () => {
  renderTable.value = false
  setTimeout(() => {
    renderTable.value = true
  }, 400)
}

const getRecord = async () => {
  showBtn.value = false
  reRenderTable()
  await getBookStock()
}

onMounted(() => {
  getRecord()
})
</script>