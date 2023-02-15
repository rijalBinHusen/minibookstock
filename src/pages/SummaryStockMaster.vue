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
            :heads="['Kode item', 'Nama item', 'Total quantity']"
            :keys="['kd_item', 'item_name', 'total_quantity']"
            :datanya="lists"
            keydata="id"
            no
            id="table-summary-stock-master"
            option
            v-slot:default="slotProps"
          >
            <Button
                accent
                value="Details"
                type="button"
                small
                class="ml-2"
                @trig="handleButton(slotProps.prop)"
              />
          </datatable>
    </div>
</template>

<script setup>
import Button from "../components/elements/Button.vue";
import Datatable from "../components/parts/Datatable.vue";
import { getSummaryStockMaster } from "../composables/StockMaster"
import { launchForm, closeModalOrDialog, subscribeConfirmDialog } from "../utils/launchForm";
import { onMounted, ref } from "vue";
import ExportToXls from "../utils/ExportToXls";
import { full } from "../utils/dateFormat";
// id: stock?.id,
// kd_item: item?.kd_item,
// nm_item: item?.nm_item,
// kd_produksi: stock?.kd_produksi,
// product_created: ddmmyyyy(stock?.product_created, '-'),
// quantity: stock?.quantity,
// <!-- kd_item, nm_item, total_quantity, details, product_dates -->

const lists = ref([])

const handleButton = (e) => {
  subscribeConfirmDialog('alert', e.product_dates.replaceAll('\r\n', '<br>'))
}

const handleMasterStock = async () => {
  // launch the loader
  launchForm('Loader', false)
  // waiting for process
  ExportToXls(lists.value, 'Summary stock master '+ full())
  // close the loader
  closeModalOrDialog(false)
}

onMounted( async () => {
  // launch the loader
  launchForm('Loader', false)
  // waiting for process
  lists.value = await getSummaryStockMaster()
  // close the loader
  closeModalOrDialog(false)
})

</script>
