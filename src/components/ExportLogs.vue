<template>
  <div class="mt-10">
    <Button
      small
      primary
      value="Export logs"
      type="button"
      @trig="handleExportLogs"
    />
  </div>
</template>

<script setup>
import Button from './elements/Button.vue';
// import all function that get all data
import {
  launchForm,
  closeModalOrDialog,
  loaderMessage,
} from '../composables/launchForm';
// import function to export text to file and download it
import { startExport } from '../composables/ExportAsFile';
// import date time formater
import { full } from '../utils/dateFormat';
import { useIdb } from '../utils/localforage';

const handleExportLogs = async () => {
  // launch the loader
  launchForm('Loader', false);
  // will contain all result
  const result = [];
  // summary db
  const summary = await useIdb('logs');
  // get all items summary
  const log_items = await summary.getItems();
  // // export all data as file
  await startExport(
    log_items,
    'Log aktivitas aplikasi FIFO ' + full() + '.json'
  );
  // console.log(result)
  // close the loader
  closeModalOrDialog(false);
};
</script>
