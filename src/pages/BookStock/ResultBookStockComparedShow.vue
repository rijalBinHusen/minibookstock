<template>
    <Table
        style="overflow: scroll; max-height: 350px;"
        keyData="id"
        :contents="excelReportResultCompared"
        :thead="tHead"
        :tbody="tBody"
    />
    <Button
        accent
        value="Unduh hasil perbandingan"
        type="button"
        small
        @trig="downloadAsExcel"
    />
</template>

<script setup>
import { onUnmounted } from 'vue';
import Table from '../../components/elements/Table.vue';
import { excelReportResultCompared, date } from "./func"
import Button from '../../components/elements/Button.vue';
import ExportToXls from '../../utils/ExportToXls';
import { ddmmyyyy, full } from '../../utils/dateFormat';

const tHead = [ '-', 'Kode item', 'Stock awal', 'Masuk', 'Keluar', 'Akhir']

const tBody = [
    "Data",
    "Item Id",
      "Awal",
      "Transfer",
      "Pemakaian",
      "Akhir"
]

const downloadAsExcel = () => {
    ExportToXls(excelReportResultCompared.value, `Laporan harian VS saldo aplikasi ${ ddmmyyyy(date.value, '-')} diunduh ${full()}`)
}

onUnmounted(() => {
    excelReportResultCompared.value.length = 0
})


</script>