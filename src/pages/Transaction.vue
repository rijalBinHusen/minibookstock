<template>
  <div>
    <div class="flex justify-center">
      <!-- date picker -->
      <div class="form-control ml-2">
        <label for="date-picker" class="label">
          <span class="label-text">Tanggal</span>
        </label>
        <date-picker
          id="date-picker"
          class="input input-outline input-primary input-sm"
          v-model="dateStart"
        ></date-picker>
      </div>
      <!-- end of date picker -->
      <SelectShift class="ml-2 mr-2 w-24" @selectedShift="shift = $event" />
      <!-- button to export stock card -->
      <div class="items-end flex mt-2">
        <Button
          small
          primary
          value="Tampilkan"
          type="button"
          @trig="handleSubmit"
          class="ml-2"
        />
        <Button
          v-if="isAvailableToExport && lists.length"
          small
          primary
          value="Export to Excel"
          type="button"
          @trig="handleExport"
          class="ml-2"
        />
      </div>
    </div>
    <datatable
      :heads="[
        'Nomor dokumen',
        'Customer',
        'Kode Item',
        'Nama item',
        'Quantity',
        'Tanggal produk',
      ]"
      :keys="[
        'nomor_dokumen',
        'customer',
        'item_id',
        'nama_lengkap',
        'quantity',
        'product_created',
      ]"
      :datanya="lists"
      keydata="id"
      no
      id="table-transaction"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Datatable from '../components/parts/Datatable.vue';
import Button from '../components/elements/Button.vue';
// import date picker
import datePicker from 'vue3-datepicker';
// shift component
import SelectShift from '../components/parts/SelectShift.vue';
import {
  launchForm,
  closeModalOrDialog,
  loaderMessage,
} from '../composables/launchForm';
import { getIncomingByDate } from '../composables/Incoming';
import { getOutputByDate } from '../composables/Output';
import ExportToXls from '../utils/ExportToXls';
import { ddmmyyyy } from '../utils/dateFormat';
// date start
const dateStart = ref(new Date());
// shift
const shift = ref();
// variable that would contain lists of record (local state)
const lists = ref([]);
// isAvailable to export
const isAvailableToExport = ref(false);

// to show record
const handleSubmit = async () => {
  if (!shift.value || !dateStart.value) return;
  // empty the state
  lists.value.length = 0;
  // show Loader
  launchForm('Loader', false);
  // show message to loader
  loaderMessage('Mendapatkan produk masuk!');
  // get incoming
  const incoming = await getIncomingByDate(dateStart.value, shift.value);
  // show another mmessage to loader
  loaderMessage('Mendapatkan produk keluar!');
  // get output
  const output = await getOutputByDate(dateStart.value, shift.value);
  loaderMessage('Menerjemahkan menjadi transaksi!');
  // map and push to list
  for (let income of incoming) {
    lists.value.push({
      shift: income?.shift,
      nomor_dokumen: income?.paper_id,
      customer: income?.type,
      item_id: income?.kd_item,
      quantity: income?.quantity,
      product_created: income?.product_created,
      nama_lengkap: income?.nm_item,
    });
  }
  for (let out of output) {
    lists.value.push({
      shift: out?.shift,
      nomor_dokumen: out?.nomor_so,
      customer: out?.customer,
      item_id: out?.kd_item,
      quantity: out?.quantity,
      product_created: out?.product_created,
      nama_lengkap: out?.nm_item,
    });
  }
  isAvailableToExport.value = true;
  closeModalOrDialog(false);
};

watch([dateStart, shift], () => {
  isAvailableToExport.value = false;
});

const handleExport = async () => {
  // launch the loader
  launchForm('Loader', false);
  // launch the loader
  // const asdfwer =  await launchForm('Loader', false);
  // export stock card
  ExportToXls(
    lists.value,
    `Transaksi ${ddmmyyyy(dateStart.value, '-')} Shift ${shift.value}`
  );
  // console.log(itemId.value)
  // close the loader
  closeModalOrDialog(false);
};
</script>
