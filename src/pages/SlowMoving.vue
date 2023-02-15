<template>
    <div class="grid mx-2 gap-2">
        <div class="flex justify-end">
            <Button
                primary
                value="Export to Excel"
                type="button"
                small
                class="w-52 "
                @trig="handleSlowMoving"
            />
        </div>
        <!-- databale -->
        <datatable
              :heads="['Kode item', 'Nama item', 'Kode produksi', 'tanggal produksi', 'quantity sekarang']"
              :keys="['kd_item', 'item_name', 'kd_produksi', 'product_created_format', 'quantity']"
              :datanya="lists"
              keydata="id"
              no
              id="table-stock-slow-moving"
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
  import { getSlowMovingItems } from "../composables/StockMaster"
  import { launchFormAndsubscribeMutation, launchForm, closeModalOrDialog } from "../utils/launchForm";
  import { onMounted, ref } from "vue";
  import ExportToXls from "../utils/ExportToXls";
  import { full } from "../utils/dateFormat";
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

  const lists = ref([])

const handleSlowMoving = async () => {
  // launch loader
  launchForm('Loader', false)
    // just pick what we're need
    let res = lists.value.map((rec) => ({
                kode_item: rec.kd_item,
                nama_item: rec.item_name,
                quantity: rec?.quantity,
                tanggal_produksi: rec?.product_created_format,
                tanggal_transfer: rec?.tanggal_transfer,
                asal_produk: rec?.asal_produk
              }))
    // waiting for process
    ExportToXls(res, `Slow moving ${full()}`)
    // close loader
    closeModalOrDialog();
}

  onMounted( async () => {
    // launch the loader
    launchForm('Loader', false)
    // waiting for process
    lists.value = await getSlowMovingItems()
    // close the loader
    closeModalOrDialog(false)
  })

  </script>
