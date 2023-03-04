<template>
  <div>
    <div v-if="renderTable" class="flex items-center mb-9">
      <div class="flex flex-auto mt-7">
        <input accept=".xls, .ods" type="file" id="filePickerReport" class="hidden" ref="file_pickerReport" @change="compareExcelReport">
        <Button
              primary
              value="Compare Laporan"
              type="button"
              small
              class="w-52 "
              @trig="file_pickerReport.click()"
          />
      </div>

      <div class="flex flex-auto">
        <div class="form-control ml-2 justify-self-center">
          <label for="date-picker" class="label">
            <span class="label-text">Tanggal</span>
          </label>
          <date-picker
            id="date-picker"
            class="input input-outline input-primary input-sm"
            v-model="date"
          ></date-picker>
        </div>

        <SelectShift class="ml-2 mr-2 w-24 justify-self-center" :shift="nowShift" @selectedShift="nowShift = $event" />

        <div class="form-control ml-2 justify-self-center">
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
      </div>
      
      <div class="flex-2 mt-7">
        <input accept=".xls, .ods" type="file" id="filePickerBook" class="hidden" ref="filePickerBook" @change="compareExcelBook">
        <Button
              primary
              value="Compare buku stock"
              type="button"
              small
              class="w-52"
              @trig="filePickerBook.click()"
          />
      </div>
    </div>
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
import { onMounted, ref, watch, computed, toRefs } from "vue";
import { getBookStock, state, date, nowShift, printStock, compareWithReport, compareWithManualBookStock } from "./func"
import Datatable from "../../components/parts/Datatable.vue";
import datePicker from "vue3-datepicker"
import Button from "../../components/elements/Button.vue"
import SelectShift from "../../components/parts/SelectShift.vue"
import ReadExcel from "../../utils/ReadExcel";
import { launchFormAndsubscribeMutation, closeModalOrDialog, launchForm, loaderMessage } from "../../utils/launchForm";

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

const file_pickerReport = ref()
const compareExcelReport = async () => {
  // if input null
  if(!file_pickerReport.value.files[0]) {
    return;
  }
  // bring up the loader
  launchForm('Loader', false)
  loaderMessage('Memabaca File Excel')
  // get the first file on input element
  const file = file_pickerReport.value.files[0]
    // read file and convert to array
    const result = await ReadExcel(file)
    // set the sheetname, is the first sheet
    let sheetName = result['sheetNames'][0]
    // get all row in the sheet
    let sheet = result['sheets'][sheetName]
    // get the ref of column, it contain the begin and the last column row, e.g A1:F300
    let infoRow = sheet["!ref"].split(":")
    // get length of row, this will return 300
    let lengthRow = +infoRow[1].match(/\d+/)[0]
    // compare with bookstock
    await compareWithReport(sheet, lengthRow)

    launchForm('ResultBookStockComparedShow', false)
    // value of ref and value of element
    file_pickerReport.value.value = ""
    
}

const filePickerBook = ref()

const compareExcelBook = async () => {
  // if input null
  if(!filePickerBook.value.files[0]) {
    return;
  }
  // bring up the loader
  launchForm('Loader', false)
  loaderMessage('Memabaca File Excel')
  // get the first file on input element
  const file = filePickerBook.value.files[0]
    // read file and convert to array
    const result = await ReadExcel(file)
    // show all sheet in modal, await user select one of sheetname
    const sheetName = await launchFormAndsubscribeMutation('SelectSheet', result['sheetNames'])
    // get all row in the sheet
    let sheet = result['sheets'][sheetName]
    // get the ref of column, it contain the begin and the last column row, e.g A1:F300
    let infoRow = sheet["!ref"].split(":")
    // get length of row, this will return 300
    let lengthRow = +infoRow[1].match(/\d+/)[0]
    // compare with bookstock
    await compareWithManualBookStock(sheet, lengthRow)

    launchForm('ResultBookStockComparedShow', false)
    // value of ref and value of element
    filePickerBook.value.value = ""
    
}

onMounted(() => {
  getRecord()
})
</script>