<template>
    <div class="grid mx-2 gap-2">
        <div class="flex justify-end">
            <input type="file" class="hidden" ref="file_picker" @change="startImport">
            <Button
                primary
                value="Import sales order"
                type="button"
                small
                class="w-52 "
                @trig="file_picker.click()"
            />
        </div>
        <!-- databale -->
        <datatable
              :heads="['Tanggal SO', 'Nomor SO', 'Customer']"
              :keys="['tanggal_so', 'nomor_so', 'customer']"
              :datanya="lists"
              keydata="id"
              no
              id="table-sales-order"
              option
              v-slot:default="slotProps"
          >  
            <Button
                accent
                value="Details"
                type="button"
                small
                class="ml-2"
                :datanya="slotProps.prop.incoming_parent_id"
                @trig="handleButton($event)"
              />
          </datatable>
      </div>
  </template>
  
  <script setup>
  import Button from "../components/elements/Button.vue";
  import Datatable from "../components/parts/Datatable.vue";
  import { launchForm, subscribeConfirmDialog, closeModalOrDialog } from "../composables/launchForm";
  import { onMounted, ref } from "vue";
  import readExcel from "../utils/ReadExcel";
import { getItemIdByKdItem } from "../composables/MasterItems";
import { getSalesOrderIdByNomorSO, createSalesOrder, addChildItemsOrder, getSalesOrder } from "../composables/SalesOrder"
import { createItemOrder } from "../composables/SalesOrderItem"
  
//   const file picker
const file_picker = ref()
  let lists = ref([]);

const startImport = async () => {
    if(!file_picker.value.files[0]) {
        await subscribeConfirmDialog('alert', 'Mohon memilih file terlebih dahulu!')
        return
    }
    // launch the loader
    launchForm('Loader', false)
    // get the first file on input element
    const file = file_picker.value.files[0]
    // read file and convert to array
    const result = await readExcel(file)
    // set the sheetname, is the first sheet
    let sheetName = result['sheetNames'][0]
    // get all row in the sheet
    let sheet = result['sheets'][sheetName]
    // get the ref of column, it contain the begin and the last column row, e.g A1:F300
    let infoRow = sheet["!ref"].split(":")
    // get length of row, this will return 300
    let lengthRow = +infoRow[1].match(/\d+/)[0]
    // console.log(sheet)
    for(let i = 2; i <= lengthRow; i++) {
        const tanggal_so = sheet["A"+i] ? sheet["A"+i].v : false;
        const nomor_so = sheet["C"+i] ? sheet["C"+i].v : false;
        const order = sheet["H"+i] ? sheet["H"+i].v : false;
        const customer = sheet["M"+i] ? sheet["M"+i].v : false
        const kodeItem = sheet["N"+i] ? sheet["N"+i].v : false
        // if order more than 0
        if(order > 0 && nomor_so) {
            // checking is item exists
            const itemInfo = await getItemIdByKdItem(kodeItem)
            // if item exists create sales order
            if(itemInfo?.id) {
                // checking is sales order exists
                let salesOrderId = await getSalesOrderIdByNomorSO(nomor_so)
                // if salesOrder doesnt exists
                if(!salesOrderId) {
                    // renew sales order info variable
                    salesOrderId = await createSalesOrder(tanggal_so, nomor_so, customer)
                }
                // create item order
                const itemOrderId = await createItemOrder(itemInfo?.id, order)
                // update sales order child items
                await addChildItemsOrder(salesOrderId, itemOrderId)
            }
        }
    }
    closeModalOrDialog(true)
}
  // to see details master
//   const handleButton = (id) => {
//     launchFormAndsubscribeMutation('IncomingForm', id, 'tunnelMessage')
//   }

  onMounted( async () => {
      lists.value = await getSalesOrder()
  })
  
  </script>