<template>
    <div style="overflow: scroll    ;">
        <Table
            style="overflow: scroll;"
            keyData="id"
            :contents="excelReportResultCompared"
            :thead="tHead"
            :tbody="tBody"
        />
    </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import Table from '../../components/elements/Table.vue';
import { excelReportResultCompared } from "./func"

const tHead = ['Kode item', 'Stock awal', 'lpb', 'Masuk', 'Bom', 'Lain2', 'Retur', 'Keluar', 'Transfer', 'Lain2', 'Akhir']

const tBody = [
    "Item Id",
      "Awal",
      "Lpb",
      "Transfer",
      "Bom",
      "Lain-lain",
      "Retur",	
      "Pemakaian",
      "Transfer2",
      "Lain-lain 2",
      "Akhir"
]

console.log(excelReportResultCompared.value)

onBeforeUnmount(() => {
    excelReportResultCompared.value.length = 0
})


</script>