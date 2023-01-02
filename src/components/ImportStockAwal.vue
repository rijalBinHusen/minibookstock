<template>
    <div>
        <div class="form-control mt-10">
        <label>
        <span class="label-text">Import data</span>
        </label>
        <div class="relative">
        <input
            type="file"
            placeholder="Import data"
            class="w-full pr-16 input input-primary"
            ref="inputFile"
            accept=".json"
        />
        <button
            class="absolute top-0 right-0 rounded-l-none btn btn-primary"
            @click="handleImport"
        >
            Mulai import
        </button>
        </div>
        </div>
        <!-- Button to download excel format to import stock starter -->
        <div>
            <button
                class="rounded btn btn-primary btn-sm mt-11"
                @click="handleFormat"
            >
                Download contoh format
            </button>
        </div>
    </div>
</template>

<script setup>

import { ref } from 'vue';
import { launchForm, closeModalOrDialog } from "../composables/launchForm"
import exportXLS from "../utils/ExportToXls"
    
// ref for input type file
const inputFile = ref()
// function to read file as text
const handleImport = () => {
    // launch the loader
    launchForm('Loader', false)
    // get the first file on input element
    const file = inputFile.value.files[0]
    // initiate file reader
    const reader = new FileReader();
    // read file as text
    reader.readAsText(file);
    //when reading is completed load
    reader.onload = (event) => startImport(JSON.parse(event.target.result));
}

const startImport = (arr) => {
  arr.forEach((records) => {
    // records = { store: 'nameOfStore': data: [12,2,3,4,,5,6,6,7,] }
    if(records?.data) {
      // set to local storage
      localStorage.setItem(records?.store, JSON.stringify(records?.data))
    }
  })
  // close the loader
  closeModalOrDialog(false)
    .then(() => {
      // refresh browser
      window.location.reload()
    })
}

const handleFormat = () => {
    // format
    const form = [
        { kode_item: 'KODEITEM', nama_item: 'NAMA ITEM', quantity: 100, tanggal_produksi: '2022/03/23' }
    ]

    exportXLS(form, 'Contoh format stock awal')
}
</script>