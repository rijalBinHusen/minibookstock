<template>
  <div class="grid mx-2 gap-2">
      <div class="flex items-center justify-center">
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
          @trig="handleAddAndEdit"
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
      </div>
      <div class="flex items-center justify-end">
        <Button
          primary
          value="Selesai muat"
          type="button"
          small
          class="ml-2"
          @trig="getRecordIsFinishedFalse"
          id="button-belum-selesai-produk-keluar"
        />
      </div>
    <datatable
      :heads="[
        'tanggal',
        'shift',
        'Nomor so',
        'customer',
        'nama item',
        'produk',
        'quantity',
      ]"
      :keys="[
        'tanggal',
        'shift',
        'nomor_so',
        'customer',
        'nm_item',
        'product_created',
        'quantity',
      ]"
      :datanya="Output_transaction"
      keydata="id"
      no
      id="table-output"
      option
    >
      <template #th>
          <th></th>
      </template>
      <template #td="{ obj }">
        <td>
          <span v-if="!obj.isFinished">
            <input type="checkbox" :id="obj.id" v-model="grouped" />
            <!-- <input :id="obj.id" v-model="grouped" :value="obj.id" @input="push(obj.id, obj)" type="checkbox" /> -->
            <!-- <label :for="obj.id"> Tandai</label> -->
          </span>
        </td>
      </template>
      <template #default="{ prop }">
        <!-- if output is finished -->
        <span v-if="prop?.isFinished">
          <Button
            primary
            value="Batal"
            type="button"
            small
            class="ml-2"
            :datanya="prop.id"
            @trig="handleCancel($event)"
          />
        </span>
        <span v-else>
          <Dropdown
            text="options" 
            :options="[
                { method: handleAddAndEdit, text: 'Edit', icon: 'pen', value: prop.id},
                { method: handleFinished, text: 'Selesai muat', icon: 'flag', value: prop.id},
                { method: handleRemove, text: 'Hapus', icon: 'trash', value: prop.id},
              ]" 
            accent small
            class="w-32"
          />
        </span>
      </template>          
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
import Dropdown from '../components/elements/Dropdown.vue';
import { ref } from 'vue';

const grouped = ref([])

const handleAddAndEdit = async (document) => {
  // function to launch form edit output product
  launchFormAndsubscribeMutation('OutputForm', document, 'tunnelMessage');
};

const handleCancel = async (document) => {
  // subscribe tunnel message
  let res = await subscribeConfirmDialog('confirm', 'Apakah output akan dibatalkan?');

  // if tunnel message send you true
  // if res true, it mean the add new record or update while false, itt close the modal without add record
  if(res) {
    // mark as un finished
    await markAsUnFinished(document);
  }
};

const handleRemove = async (document) => {
    // subscribe tunnel message
    let res = await subscribeConfirmDialog('confirm', 'Apakah anda yakin akan mengahapusnya?');

    // if tunnel message send you true
    // if res true, it mean the add new record or update while false, itt close the modal without add record
    // remove record from db
    if(res) {
      await removeOutputById(document);
    }
};

const handleFinished = async (document) => {
    // subscribe tunnel message
    let res = await subscribeConfirmDialog('confirm', 'Apakah kendaraan selesai muat?');

    // if tunnel message send you true
    // if res true, it mean the add new record or update while false, itt close the modal without add record
    if (res) {
        await markAsFinished(document);
    }
};
</script>
