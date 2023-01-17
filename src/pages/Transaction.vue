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
              <!-- <Button
                small
                primary
                value="Export to Excel"
                type="button"
                @trig="handleSubmit"
                class="ml-2"
              /> -->
          </div>
      </div>
  </div>
  </template>


  <script setup>
  import { ref } from 'vue';
  import Button from '../components/elements/Button.vue';
  // import stock card
  import { stockCard } from "../reports/StockCard"
  // import date picker
  import datePicker from "vue3-datepicker";
  // shift component
  import SelectShift from '../components/parts/SelectShift.vue';
  import { launchForm, closeModalOrDialog, subscribeConfirmDialog } from "../composables/launchForm"
  import { getIncomingByDate } from '../composables/Incoming';
  import { getOutputByDate } from '../composables/Output';
  // date start
  const dateStart = ref(new Date())
  // shift
  const shift = ref()
  // variable that would contain lists of record (local state)
  const lists = ref([])

  // to show record
  const handleSubmit = async () => {
    // get incoming
    const incoming = await getIncomingByDate(dateStart.value, shift.value)
    // get output
    const output = await getOutputByDate(dateStart.value, shift.value)
    console.log('output', output)
    console.log('incomiing', incoming)
  }


  const handleExport = async () => {
      // IF the form not null
      if(itemId.value && dateStart.value && dateEnd.value) {
          // launch the loader
          launchForm('Loader', false)
          // launch the loader
          // const asdfwer =  await launchForm('Loader', false);
          // export stock card
          await stockCard(itemId.value, dateStart.value.getTime(), dateEnd.value.getTime())
          // console.log(itemId.value)
          // close the loader
          closeModalOrDialog(false)
      } else {
          subscribeConfirmDialog('alert', 'Tidak boleh ada form yang kosong');
      }
  }
  </script>
