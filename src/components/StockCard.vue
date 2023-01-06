<template>
    <div> 
        <div class="mt-10 flex">
            <SelecItemsVue @pickedItem="itemId = $event" />
            <div class="items-end flex ml-2">
                <Button
                small
                primary
                value="Export kartu stock"
                type="button"
                @trig="handleExport"
                />
            </div>
        </div>
        <div class="items-end flex mt-11">
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
import { startExportMaster } from '../reports/StockMaster';
import { launchForm, closeModalOrDialog } from "../composables/launchForm"
// variable that contain item id
const itemId = ref(null)

const handleExport = async () => {
    // launch the loader
    launchForm('Loader', false)
    // launch the loader
    // const asdfwer =  await launchForm('Loader', false);
    // export stock card
    await stockCard(itemId.value)
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