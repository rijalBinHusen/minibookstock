<template>
  <div class="grid mx-2 gap-2">
    <span class="flex items-center justify-center">
      <span class="text-3xl">Output</span>
      <date-picker
        class="ml-2 bg-base-200 p-2 rounded"
        v-model="dateRecordToShow"
        id="date-produk-keluar"
      >
      </date-picker>
      <!-- Show record by date -->
      <Button
        primary
        value="Tampilkan"
        type="button"
        small
        class="ml-2"
        @trig="getRecordByDate"
        id="button-tampilkan-produk-keluar"
      />
      <!-- add new output record -->
      <Button
        primary
        value="Tambah"
        type="button"
        small
        class="ml-2"
        id="button-tambah-produk-keluar"
        @trig="handleButton('add')"
      />
      <!-- show all output unfinished  -->
      <Button
        primary
        value="Belum selesai"
        type="button"
        small
        class="ml-2"
        @trig="getRecordIsFinishedFalse"
        id="button-belum-selesai-produk-keluar"
      />
    </span>
    <datatable
      :heads="[
        'tanggal',
        'shift',
        'Nomor so',
        'nama item',
        'tanggal produksi',
        'quantity',
      ]"
      :keys="[
        'tanggal',
        'shift',
        'nomor_so',
        'nm_item',
        'product_created',
        'quantity',
      ]"
      :datanya="Output_transaction"
      keydata="id"
      no
      id="table-output"
      option
      v-slot:default="slotProps"
    >
      <!-- if output is finished -->
      <span v-if="slotProps.prop?.isFinished">
        <Button
          primary
          value="Batal"
          type="button"
          small
          class="ml-2"
          :datanya="slotProps.prop.id"
          @trig="handleButton('cancel', $event)"
        />
      </span>
      <span v-else>
        <Button
          secondary
          value="hapus"
          type="button"
          small
          class="ml-2"
          :datanya="slotProps.prop.id"
          @trig="handleButton('remove', $event)"
        />

        <Button
          primary
          value="Edit"
          type="button"
          small
          class="ml-2"
          :datanya="slotProps.prop.id"
          @trig="handleButton('edit', $event)"
        />

        <Button
          accent
          value="sudah muat"
          type="button"
          small
          class="ml-2"
          :datanya="slotProps.prop.id"
          @trig="handleButton('finished', $event)"
        />
      </span>
    </datatable>
  </div>
</template>

<script setup>
import datePicker from 'vue3-datepicker';
import Datatable from '../components/parts/Datatable.vue';
import Button from '../components/elements/Button.vue';
import {
  launchFormAndsubscribeMutation,
  subscribeConfirmDialog,
} from '../utils/launchForm';
import {
  getRecordIsFinishedFalse,
  Output_transaction,
  removeOutputById,
  markAsFinished,
  dateRecordToShow,
  getRecordByDate,
  markAsUnFinished,
} from '../composables/Output';

const handleButton = async (operation, document) => {
  // if operation === remove
  if (['remove', 'finished', 'cancel'].includes(operation)) {
    // delete message
    let message = () => {
      if (operation == 'remove') {
        return 'Apakah anda yakin akan mengahapusnya?';
      }
      if (operation == 'finished') {
        return 'Apakah kendaraan selesai muat?';
      }
      return 'Apakah output akan dibatalkan?';
    };
    // subscribe tunnel message
    let res = await subscribeConfirmDialog('confirm', message());

    // if tunnel message send you true
    // if res true, it mean the add new record or update while false, itt close the modal without add record
    if (res) {
      // if operation remove record
      if (operation === 'remove') {
        // remove record from db
        await removeOutputById(document);
      } else if (operation === 'finished') {
        // mark as finished db
        await markAsFinished(document);
      } else if (operation === 'cancel') {
        // mark as un finished
        await markAsUnFinished(document);
      }
    }
    // onsole.log('handle button, id: '+ document)
    return;
  }

  // function to launch form to add income product
  // if(['add', 'edit'].includes(operation)) {
  launchFormAndsubscribeMutation('OutputForm', document, 'tunnelMessage');
  //     return;
  // }
};
</script>
