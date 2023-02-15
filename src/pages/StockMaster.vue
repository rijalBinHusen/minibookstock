<template>
    <div class="grid mx-2 gap-2">
        <div class="flex justify-end">
            <Button
                primary
                value="Export to Excel"
                type="button"
                small
                class="w-52 "
                @trig="handleMasterStock"
            />
        </div>
        <!-- databale -->
        <datatable
              :heads="['Kode item', 'Nama item', 'Kode produksi', 'tanggal produksi', 'quantity sekarang']"
              :keys="['kd_item', 'item_name', 'kd_produksi', 'product_created_format', 'quantity']"
              :datanya="Stock_masters"
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
                :datanya="slotProps.prop.icoming_parent_id"
                @trig="handleButton($event)"
              />
          </datatable>
      </div>
  </template>

  <script setup>
  import Button from "../components/elements/Button.vue";
  import Datatable from "../components/parts/Datatable.vue";
  import { getStockThatAvailable, Stock_masters } from "../composables/StockMaster"
  import { launchFormAndsubscribeMutation, launchForm, closeModalOrDialog } from "../utils/launchForm";
  import { onMounted, } from "vue";
  import { startExportMaster } from '../reports/StockMaster';
  // id: stock?.id,
  // kd_item: item?.kd_item,
  // nm_item: item?.nm_item,
  // kd_produksi: stock?.kd_produksi,
  // product_created: ddmmyyyy(stock?.product_created, '-'),
  // quantity: stock?.quantity,

  // to see details master
  const handleButton = (id) => {
    launchFormAndsubscribeMutation('IncomingForm', id, 'tunnelMessage')
  }



const handleMasterStock = async () => {
    // launch the loader
    launchForm('Loader', false)
    // waiting for process
    await startExportMaster()
    // close the loader
    closeModalOrDialog(false)
}

  onMounted( async () => {
    // launch the loader
    launchForm('Loader', false)
    // getting the record
    await getStockThatAvailable()
    // close the loader
    closeModalOrDialog(false)
  })

  </script>
