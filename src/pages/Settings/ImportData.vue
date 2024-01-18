<template>
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
</template>

<script setup>
import { ref } from 'vue';
import {
  launchForm,
  closeModalOrDialog,
  loaderMessage,
} from '../../utils/launchForm';
import { useIdb } from '../../utils/localforage';

// ref for input type file
const inputFile = ref();
// function to read file as text
const handleImport = () => {
  // if form is null
  if (!inputFile.value.files[0]) {
    return;
  }
  // launch the loader
  launchForm('Loader', false);
  // get the first file on input element
  const file = inputFile.value.files[0];
  // initiate file reader
  const reader = new FileReader();
  // read file as text
  reader.readAsText(file);
  //when reading is completed load
  reader.onload = (event) => startImport(JSON.parse(event.target.result));
};

const startImport = async (arr) => {
  for (const [indexTable, record] of arr.entries()) {
    // initiate db
    const db = await useIdb(record.store);
    // if data is not null
    if (record?.data && record?.data.length) {
      // loop the data
      for (const [indexRow, datum] of record.data.entries()) {
        // show message in loader
        loaderMessage(
          `Mengimpor database table ${indexTable} dari ${arr.length}, baris ${indexRow} dari ${record.data.length}`
        );
        // insert to indexeddb
        await db.setItem(datum.id, datum);
      }
    }
  }
  // close the loader
  closeModalOrDialog(false).then(() => {
    // refresh browser
    window.location.reload();
  });
};
</script>
