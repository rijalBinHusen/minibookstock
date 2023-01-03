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
import { summary } from "../utils/summaryIdb"
import { launchForm, closeModalOrDialog } from "../composables/launchForm"
// import function to export text to file and download it
import { startExport } from "../composables/ExportAsFile"
// import date time formater
import { full } from "../utils/dateFormat"

const handleBackup = async () => {
    // launch the loader
    launchForm('Loader', false)
    // import function get all jurnal
    const { getAllDataToBackup: getBackupJurnalKeluar } = useJurnalProdukKeluar()
    const { getAllDataToBackup: getBackupJurnalIncoming } = useJurnalProdukMasuk()
    const { getAllDataToBackup: getBackupSummary } = await summary()
    // the list of function that return data that we'are gonna backup
    const list = [getBackupIncoming, getBackupMasterItems, getBackupOutput, getBackupStockMaster, getBackupJurnalIncoming, getBackupJurnalKeluar, getBackupSummary]
    // map all function to get all data in local storage
    const result = await Promise.all(list.map((get) => get()))
    // export all data as file
    await startExport(result, full() + '.json')
    // console.log(result)
    // close the loader
    closeModalOrDialog(false)
}
</script>