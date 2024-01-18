<template>
      <div
        id="incoming_add_form"
        class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
      >
      <!-- NO DO -->
      <!-- NO SO -->
      <!-- REGISTER -->
      <!-- PLAT NOMOR -->
      <!-- CUSTOMER -->
      <form id="vehicle_form" @submit.prevent="handleSubmit">
        <div id="incoming_add_form" class="grid justify-items-center">
            <div id="incoming_paper" class="flex justify-self-start gap-4">
              <!-- NO DO -->
            <Input
              label="Nomor DO"
              @send="noDO = $event"
              placeholder="Masukkan nomor DO"
              tipe="primary"
              :value="noDO"
            />
              <!-- NO SO -->
            <InputSalesOrder :nomor_so="nomor_so" @picked-sales-order="handleSOrder($event)" />
            <!-- <InputSalesOrder /> -->
            <!-- <Input
              label="Nomor SO"
              @send="noSO = $event"
              placeholder="Masukkan Nomor SO"
              tipe="primary"
              :value="noSO"
            /> -->
            </div>

            <div id="incoming_items" class="flex justify-self-start  gap-4 mb-2">
              <!-- PLAT NOMOR -->
              <Input
                label="Plat nomor"
                @send="platNomor = $event"
                placeholder="Masukkan plat nomor"
                tipe="primary"
                :value="platNomor"
                />
              <!-- CUSTOMER -->
              <Input
                label="Customer"
                @send="customer = $event"
                placeholder="Nama Customer"
                tipe="primary"
                :value="customer"
              />
              <!-- REGISTER -->
              <Input
                label="Register"
                @send="register = $event"
                placeholder="Register"
                :value="register"
                tipe="primary"
              />
          </div>

          <!-- Stock master -->
          <PickStockMaster />

          <div id="incoming_add_submit" class="w-full mt-4">
            <Button type="button" @trig="handleSubmit" small primary :value="isEditMode ? 'Update' : 'Submit'" />
            <span class="text-red-400 ml-6">
              {{ warn }}
            </span>
          </div>
        </div>
      </form>
      </div>
  </template>

  <script setup>
  import Input from "@/components//elements/Forms/Input.vue";
  import Button from "@/components//elements/Button.vue";
  import { ref, onMounted, computed, watch } from 'vue'
  import InputSalesOrder from "../SalesOrders/InputSalesOrder.vue";
  // import { createVehicle, getVehicleById, updateVehicleById } from "../composables/Vehicles";
  import { closeModalOrDialog } from "../../utils/launchForm";
  import { useStore } from "vuex";
  import { getSalesOrderById } from "../SalesOrders/SalesOrder"
  import { getItemOrderById } from "../SalesOrders/SalesOrderItem"
  import { getStockById } from "../StockMasters/StockMaster"
  import { getItemById } from "../MasterItems/MasterItems"
  import PickStockMaster from "@/components/PickStockMaster.vue";

  const store = useStore()

  const warn = ref(null)
  // <!-- NO DO -->
  const noDO = ref(null);
  // <!-- NO SO -->
  const nomor_so = ref(null)
  // <!-- REGISTER -->
  const register = ref(null)
  // <!-- PLAT NOMOR -->
  const platNomor = ref(null)
  // <!-- CUSTOMER -->
  const customer = ref(null)

  const handleSubmit = async () => {

    if(noDO.value && noSO.value && register.value && platNomor.value && customer.value) {
      // update vehicle
      if(isEditMode.value) {
        // await updateVehicleById(isEditMode.value, changedValue.value)
      }
      // insert vehicle
      else {
        // await createVehicle(noDO.value, noSO.value, platNomor.value, customer.value, register.value, false, false)
      }
      // reset form
      // const form = document.getElementById("vehicle_form")
      // form.reset()
      // close modal
      closeModalOrDialog()
    } else {
      warn.value = "Data tidak boleh ada yang kosong"
      setTimeout(() => { warn.value = null }, 3000)
    }
  }

  // will contain the id of record or undefined
  const isEditMode = computed(() => store.state?.form?.document)
  // will contain original value when edit mode
  const originalRecord = ref(null);
  // will contain the record that changed to send to sql indexeddb
  // e.g { keyUpdated: valueUpdated }
  const changedValue = ref({})

  onMounted( async () => {
    // detecting is edit mode
    // if edit mode, find vehicle by id, then fill the form
    // if(isEditMode.value) {
    //   originalRecord.value = await getVehicleById(isEditMode.value)
    //   noDO.value = originalRecord.value?.nomor_do;
    //   noSO.value = originalRecord.value?.nomor_so;
    //   platNomor.value = originalRecord.value?. plat_nomor;
    //   customer.value = originalRecord.value?.customer;
    //   register.value = originalRecord.value?.register;
    //   setTimeout(() => {enableWatcher.value = true}, 500 )
    // }
  })

  // disable enable watcher
  const enableWatcher = ref(false)
  // watch the value changed
  watch([noDO, nomor_so, register, platNomor, customer], (newVal) => {
    if(enableWatcher.value) {
      // noDO
      if(newVal[0] !== originalRecord.value?.nomor_do) {
        changedValue.value['nomor_do'] = newVal[0]
      }
      // noSO
      if(newVal[1] !== originalRecord.value?.nomor_so) {
        changedValue.value['nomor_so'] = newVal[1]
      }
      // register
      if(newVal[2] !== originalRecord.value?.register) {
        changedValue.value['register'] = newVal[2]
      }
      // platNomor
      if(newVal[3] !== originalRecord.value?.plat_nomor) {
        changedValue.value['plat_nomor'] = newVal[3]
      }
      // customer
      if(newVal[4] !== originalRecord.value?.customer) {
        changedValue.value['customer'] = newVal[4]
      }
    }
  })


// will contain condition is the output picking from salesOrder or not
// const salesOrderPicked = ref([])
// // handle SOrder
// const handleSOrder = async (salesOrderId) => {
//   if(salesOrderId.length < 9){
//     return;
//   }
//   // get sales order by id. this will return { id, nomor_so, tanggal_so, customer }
//   const salesOrderDetails = await getSalesOrderById(salesOrderId)
//   // put to nomor_so the form
//   nomor_so.value = salesOrderDetails.nomor_so
//   customer.value = salesOrderDetails.customer
//   // if salesOrderDetails.childItemsOrder.length > 0
//   if(salesOrderDetails.childItemsOrder.length > 0) {
//   // get all item order by salesOrderDetails.childItemsOrder
//     for(const idItemOrder of salesOrderDetails.childItemsOrder) {
//     // get sales order item. this will return { id, item_id, order }
//     const itemOrder = await getItemOrderById(idItemOrder)
//     // item order is null
//     if(!itemOrder) {
//       return;
//     }
//     // get stock master by item id, this will return [{ id, product_created }, .....]
//     const dateStockMaster = await getAvailableDateByItem(itemOrder.item_id)
//     // get stockMasterById, this will return { item_id, product_created, quantity}
//     const stockMaster = await getStockById(dateStockMaster[0]?.id)
//     // compare quantity
//     // if quantity > order
//     // or datestockmaster only availbale 1
//     if(stockMaster.quantity >= itemOrder.order || dateStockMaster.length === 1) {
//         // put to item lists
//         // if the quantity stockMaster.quantity >= itemOrder.order alert it bro
//         if(stockMaster.quantity < itemOrder.order) {
//           const item = await getItemById(itemOrder.item_id)
//           alert(`Permintaan item ${item.nm_item} sebanyak ${itemOrder.order} karton tidak cukup, stock hanya tersedia ${stockMaster.quantity} karton!`)
//           handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: stockMaster.quantity })
//         } else {
//           handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: itemOrder.order })
//         }
//       } else {
//         // count the - quantity = sisa item order1
//         const quantity2 = itemOrder.order - stockMaster.quantity
//         // put the quantity stock1
//         handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: stockMaster.quantity })
//         // search for quantity 2
//         // get stockMasterById, this will return { item_id, product_created, quantity}
//         const stockMaster2 = await getStockById(dateStockMaster[1]?.id)
//         // sisa item order2, if quantity3 >= 0 it means enough
//         const quantity3 = stockMaster2.quantity - quantity2
//         // put the quantity stock2
//         handleStock('add', {
//                 id: itemOrder.id,
//                 stock_master_id: stockMaster2?.id,
//                 quantity: quantity3 >= 0 ? quantity2 : stockMaster2.quantity
//               })
//       }
//     }
//   }
//   // record sorder that picked
//   salesOrderPicked.value.push((salesOrderId))
// }

  </script>
