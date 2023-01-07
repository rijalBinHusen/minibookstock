<template>
    <div class="grid mx-2 gap-2">
        <!-- databale -->
        <datatable
              :heads="['Kode item', 'Nama item', 'Kode produksi', 'tanggal produksi', 'quantity']"
              :keys="['kd_item', 'nm_item', 'kd_produksi', 'product_created', 'quantity']"
              :datanya="lists"
              keydata="id"
              no
              id="table-stock-master"
              option
              v-slot:default="slotProps"
          >  
            <Button
                accent
                value="Details"
                type="button"
                small
                class="ml-2"
                :datanya="slotProps.prop.id"
                @trig="handleButton($event)"
              />
          </datatable>
      </div>
  </template>
  
  <script setup>
  import Button from "../components/elements/Button.vue";
  import Datatable from "../components/parts/Datatable.vue";
  import { getStockThatAvailable, mapStockForStockMaster } from "../composables/StockMaster"
  import { onMounted, ref } from "vue";
  // id: stock?.id,
  // kd_item: item?.kd_item,
  // nm_item: item?.nm_item,
  // kd_produksi: stock?.kd_produksi,
  // product_created: ddmmyyyy(stock?.product_created, '-'),
  // quantity: stock?.quantity,
  let lists = ref([]);
  
  // to see details master
  const handleButton = async (id) => {
    console.log(id)
  }

  onMounted( async () => {
    await getStockThatAvailable()
    lists.value = await mapStockForStockMaster()
    console.log(lists.value)
  })
  
  </script>