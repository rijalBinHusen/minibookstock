<template>
  <div>
    <div class="flex justify-center">
      <SelecItemsVue small @pickedItem="itemId = $event" />
      <!-- date picker -->
      <div class="form-control ml-2">
        <label for="date-picker" class="label">
          <span class="label-text">Tanggal mulai</span>
        </label>
        <date-picker
          id="date-picker"
          class="input input-outline input-primary input-sm"
          v-model="dateStart"
        ></date-picker>
      </div>
      <!-- end of date picker -->
      <!-- date picker -->
      <div class="form-control ml-2">
        <label for="date-picker" class="label">
          <span class="label-text">Tanggal selesai</span>
        </label>
        <date-picker
          id="date-picker"
          class="input input-outline input-primary input-sm"
          v-model="dateEnd"
        ></date-picker>
      </div>
      <!-- end of date picker -->
      <!-- button to export stock card -->
      <div class="items-end flex mt-2">
        <Button
          small
          primary
          value="Export to Excel"
          type="button"
          @trig="handleExport"
          class="ml-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from '../components/elements/Button.vue';
// import item input
import SelecItemsVue from '../components/SelectItems.vue';
// import stock card
import { stockCard } from '../reports/StockCard';
// import date picker
import datePicker from 'vue3-datepicker';
import {
  launchForm,
  closeModalOrDialog,
  subscribeConfirmDialog,
} from '../composables/launchForm';
// variable that contain item id
const itemId = ref(null);
// date start
const dateStart = ref(new Date());
// date end
const dateEnd = ref(new Date());

const handleExport = async () => {
  // IF the form not null
  if (itemId.value && dateStart.value && dateEnd.value) {
    // launch the loader
    launchForm('Loader', false);
    // launch the loader
    // const asdfwer =  await launchForm('Loader', false);
    // export stock card
    await stockCard(
      itemId.value,
      dateStart.value.getTime(),
      dateEnd.value.getTime()
    );
    // console.log(itemId.value)
    // close the loader
    closeModalOrDialog(false);
  } else {
    subscribeConfirmDialog('alert', 'Tidak boleh ada form yang kosong');
  }
};
</script>
