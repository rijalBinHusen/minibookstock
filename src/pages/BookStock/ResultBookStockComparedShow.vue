<template>
    <Table
        style="overflow: scroll; max-height: 350px; max-width: 1200;"
        class="items-center"
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
import { computed, onUnmounted } from 'vue';
import Table from '../../components/elements/Table.vue';
import { excelReportResultCompared, date, compareStockWith } from "./bookStock"
import Button from '../../components/elements/Button.vue';
import ExportToXls from '../../utils/ExportToXls';
import { ddmmyyyy, full } from '../../utils/dateFormat';

const tHead = computed(() => {
    if(compareStockWith.value === "report") {
        return [ '-', 'Kode item', 'Stock awal', 'Masuk', 'Keluar', 'Akhir']
    }
    return [
    "-",
      "Kode item",
      "Awal",
      "Masuk 1",
      "keluar 1",
      "masuk 2",
      "keluar 2",
      "masuk 3",
      "keluar 3",
      "masuk 4",
      "keluar 4",
      "Stock akhir"
    ]
})

const tBody = computed(() => {
    if(compareStockWith.value === "report") {
        return [
            "Data",
            "Item Id",
            "Awal",
            "Transfer",
            "Pemakaian",
            "Akhir"
        ]
    }
    return [
        "data",
      "Kode item",
      "Stock awal 1",
      "Produk masuk 1",
      "Produk keluar 1",
      "Produk masuk 2",
      "Produk keluar 2",
      "Produk masuk 3",
      "Produk keluar 3",
      "Produk masuk 4",
      "Produk keluar 4",
      "Stock akhir"
    ]
}) 

const downloadAsExcel = () => {
    const title = compareStockWith.value === "report"
                    ? `Laporan VS Saldo aplikasi ${ ddmmyyyy(date.value, '-')}`
                    : `Bukut stock VS Buku aplikasi ${ ddmmyyyy(date.value, '-')}`
    ExportToXls(excelReportResultCompared.value, `${title} diunduh ${full()}`)
}

onUnmounted(() => {
    excelReportResultCompared.value.length = 0
})


</script>