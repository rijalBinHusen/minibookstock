<template>
    <div class="mt-10"> 
        <div> 
            <h3 class="text-xl">
                Export kartu stock:
            </h3>
            <div class="flex">
                <SelecItemsVue @pickedItem="itemId = $event" />
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
                <div class="form-control  ml-2">
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
            </div>
            <!-- button to export stock card -->
            <div class="items-end flex mt-2">
                <Button
                small
                primary
                value="Export kartu stock"
                type="button"
                @trig="handleExport"
                />
            </div>
        </div>
        <div class="items-end mt-11">
            <h3 class="text-xl mb-5">
                Export semua stock yang tersedia saat ini:
            </h3>
            <Button
            small
            primary
            value="Export master stock"
            type="button"
            @trig="handleMasterStock"
            />
        </div>
    </div>

</template>


<script setup>
import { ref } from 'vue';
import Button from './elements/Button.vue';
// import item input
import SelecItemsVue from './SelecItems.vue';
// import stock card
import { stockCard } from "../reports/StockCard"
// import date picker
import datePicker from "vue3-datepicker";
import { startExportMaster } from '../reports/StockMaster';
import { launchForm, closeModalOrDialog } from "../composables/launchForm"
// variable that contain item id
const itemId = ref(null)
// date start
const dateStart = ref(new Date())
// date end
const dateEnd = ref(new Date())

const handleExport = async () => {
    // launch the loader
    launchForm('Loader', false)
    // launch the loader
    // const asdfwer =  await launchForm('Loader', false);
    // export stock card
    await stockCard(itemId.value, dateStart.value.getTime(), dateEnd.value.getTime())
    // console.log(itemId.value)
    // close the loader
    closeModalOrDialog(false)
}

const handleMasterStock = async () => {
    // launch the loader
    launchForm('Loader', false)
    await startExportMaster()
    // close the loader
    closeModalOrDialog(false)
}
</script>