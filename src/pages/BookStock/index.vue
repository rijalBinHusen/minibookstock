<template>
    <h1>Hello world</h1>
    <Datatable
      :heads="['Kode item', 'Stock awal', 'Masuk', 'keluar', 'akhir']"
      :keys="['item_id', 'stockAwalShift1', 'incomeShift1', 'outputShift1', 'stockAwalShift2']"
      :datanya="state"
      keydata="id"
      no
      id="table-buku-stock"
    />
</template>

<script setup>
import { onMounted } from "vue";
import { getBookStock, state } from "./func"
import Datatable from "../../components/parts/Datatable.vue";

onMounted(() => {
    const date = new Date()
    date.setDate(date.getDate() - 2)
    getBookStock(date)
})
</script>