<template>
    <Table
        style="overflow: scroll; max-height: 430px;"
        keyData="id"
        :contents="excelReportResultCompared"
        :thead="tHead"
        :tbody="tBody"
    />
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import Table from '../../components/elements/Table.vue';
import { excelReportResultCompared } from "./func"

const tHead = [ '-', 'Kode item', 'Stock awal', 'Masuk', 'Keluar', 'Akhir']

const tBody = [
    "Data",
    "Item Id",
      "Awal",
      "Transfer",
      "Pemakaian",
      "Akhir"
]

onBeforeUnmount(() => {
    excelReportResultCompared.value.length = 0
})


</script>