<template>
    <div class="grid mx-2 gap-2">
        <div class="flex justify-end">
            <input accept=".xls" type="file" class="hidden" ref="file_picker" @change="startImport">
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
              :datanya="sales_orders"
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
                :datanya="slotProps.prop.id"
                @trig="handleButton($event)"
              />
          </datatable>
      </div>
  </template>
  
<script setup>
  import Button from "@/components/elements/Button.vue";
  import Datatable from "@/components/parts/Datatable.vue";
  import { launchForm, subscribeConfirmDialog, closeModalOrDialog, loaderMessage } from "@/utils/launchForm";
  import { onMounted, ref } from "vue";
  import readExcel from "@/utils/ReadExcel";
  import { getSalesOrderById, sales_orders ,getSalesOrderIdByNomorSO, createSalesOrder, addChildItemsOrder, getSalesOrder } from "./SalesOrder"
  import { createItemOrder } from "./SalesOrderItem"
  import ExcelDateToJSDate from "@/utils/ExcelDateToJs";
  import { ddmmyyyy, dayPlusOrMinus } from "@/utils/dateFormat";
  import { Items } from "../MasterItems/MasterItems";
  const { getItemByKdItem } = Items();
    
//   const file picker
const file_picker = ref()
const SOInserted = [];
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
    // maximum day before to import
    const maxDayBefore = dayPlusOrMinus(false, -14)
    for(let i = 1; i <= lengthRow; i++) {
        // show message in loader
        loaderMessage(`Memasukkan sales order, ${i} dari ${lengthRow} baris`)
        const tanggal_so = sheet["A"+i] ? sheet["A"+i].v : false;
        const nomor_so = sheet["C"+i] ? sheet["C"+i].v : false;
        const order = sheet["H"+i] ? sheet["H"+i].v : false;
        const customer = sheet["M"+i] ? sheet["M"+i].v : false
        const kodeItem = sheet["N"+i] ? sheet["N"+i].v : false
        // renew sales order info variable
        const date = ExcelDateToJSDate(tanggal_so)
        // if order more than 0 and date > 14 day before now
        if(order > 0 && nomor_so && date.getTime() >= maxDayBefore) {
            // checking is item exists
            const itemInfo = await getItemByKdItem(kodeItem)
            // if item exists create sales order
            if(itemInfo?.id) {
                // checking is sales order exists
                let salesOrderId = await getSalesOrderIdByNomorSO(nomor_so)
                // only import when sales order doesnt exists or sales order inserted
                // if salesOrder doesnt exists
                if(!salesOrderId) {
                    salesOrderId = await createSalesOrder(ddmmyyyy(date, '-'), nomor_so, customer)
                    SOInserted.push(nomor_so)
                }
                if(!salesOrderId || SOInserted.includes(nomor_so)) {
                    // create item order
                    const itemOrderId = await createItemOrder(itemInfo?.id, order)
                    // update sales order child items
                    await addChildItemsOrder(salesOrderId, itemOrderId)
                }
            }
        }
    }
    await renderSalesOrder()
    closeModalOrDialog(true)
}

const renderSalesOrder = async () => {
    await getSalesOrder()
    return
}

  // to see details master
  const handleButton = async (id) => {
   /**
    * Todo:
    * Throw sales order id to state form
    * launch output form
    * show SO number, customer name, and item lists in output form
    * only show, prevent user to edit it
    */
//   launch output form throw sales order into state from
    launchForm('OutputForm', id)
  }

  onMounted(() => {
    renderSalesOrder()
  })
  
  </script>