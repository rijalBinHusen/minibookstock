<template>
  <div class="mt-10 flex items-center">
    <span class="">Tanggal mulai</span>
    <date-picker 
        class="m-2 bg-base-200 p-2 rounded" 
        v-model="date"
    >
    </date-picker> 
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
import { launchForm, closeModalOrDialog, } from '../utils/launchForm';
import { startExport } from '../utils/ExportAsFile';
// import date time formater
import { full } from '../utils/dateFormat';
import { useIdb } from '../utils/localforage';
import datePicker from "vue3-datepicker"
import { ref } from 'vue';

const date = ref(new Date())

const handleExportLogs = async () => {
  // launch the loader
  launchForm('Loader', false);
  // acivitylog db
  const acivitylog = useIdb('logs');
  // get all items acivitylog
  const log_items = await acivitylog.getItemsByKeyGreaterThan('time', date.value.getTime());
  // // export all data as file
  await startExport(
    log_items,
    'Log aktivitas aplikasi FIFO mulai ' + full(date.value) + '.json'
  );
  // close the loader
  closeModalOrDialog(false);
};
</script>
