<template>

    <div class="mt-10">
        <Button
            small
            primary
            value="Backup data"
            type="button"
            @trig="handleBackup"
        />
    </div>

</template>


<script setup>
import Button from './elements/Button.vue';
// import all function that get all data
import { getAllDataToBackup as getBackupIncoming } from '../composables/Incoming'
import { getAllDataToBackup as getBackupMasterItems } from '../composables/MasterItems'
import { getAllDataToBackup as getBackupOutput } from '../composables/Output'
import { getAllDataToBackup as getBackupStockMaster } from '../composables/StockMaster'
import { useJurnalProdukKeluar, useJurnalProdukMasuk } from '../composables/Setting_JurnalId'
import { getAllDataToBackup as getBackupSalesOrder } from "../composables/SalesOrder"
import { getAllDataToBackup as getBackupOrderItem } from "../composables/SalesOrderItem"
import { summary } from "../utils/summaryIdb"
import { launchForm, closeModalOrDialog, loaderMessage } from "../composables/launchForm"
// import function to export text to file and download it
import { startExport } from "../composables/ExportAsFile"
// import date time formater
import { full } from "../utils/dateFormat"
import { useIdb } from '../utils/localforage';

const handleBackup = async () => {
    // launch the loader
    launchForm('Loader', false)
    // will contain all result
    const result = []
    // summary db
    const summary = await useIdb("summary")
    // get all items summary
    const summary_items = await summary.getItems()
    // looping summary items and get all data
    for(const [index, sum] of summary_items.entries()) {
        // show message to loader
        loaderMessage(`Mendapatkan ${index + 1 } dari ${summary_items.length} tabel, total ${sum.total} record.`)
        // initiate db
        const dbCurrentTable = await useIdb(sum.id)
        // get all items
        const allItems = await dbCurrentTable.getItems()
        // push to result
        result.push({ store: sum.id, data: allItems })
    }
    // // export all data as file
    await startExport(result, "Backup monitoring FIFO "+full() + '.json')
    // console.log(result)
    // close the loader
    closeModalOrDialog(false)
}
</script>