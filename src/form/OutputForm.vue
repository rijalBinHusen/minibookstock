<template>
  <div>
    <div
      id="incoming_add_form"
      class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
    >
      <div id="incoming_add_form" class="grid justify-items-center">
        <!-- incoming info paper dll -->
        <div id="incoming_info" class="grid grid-cols-3 gap-4">
          <!-- date picker -->
          <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Tanggal</span>
            </label>
            <date-picker
              id="date-picker"
              class="input input-outline input-primary input-sm"
              v-model="date"
            ></date-picker>
          </div>
          <!-- end of date picker -->
          <SelectShift @selected-shift="shift = $event" :shift="shift" />
          <!-- end of Shift -->
          <!-- Coming from -->
          <SelectTypeDocument jurnal="keluar" :typeJurnal="type" @selected-type="type = $event" />
          <!-- End of coming from -->
        </div>

        <div id="incoming_paper" class="grid grid-cols-3 gap-4">
          <InputSalesOrder small :nomor_so="nomor_so" @picked-sales-order="handleSOrder($event)" />
          <Input
            label="Customer"
            @send="customer = $event"
            small
            placeholder="Nama customer"
            tipe="primary"
            :value="customer"
          />
        </div>

        <!-- Item picker -->
         <PickItemToOutputVue
            :isParentEditMode="isEditMode"
            :stockChild="stockChildDetails"
            @addStock="handleStock('add', $event)"
            @removeStock="handleStock('remove', $event)"
            @editStock="handleStock('edit', $event)"
            @updateStock="handleStock('update', $event)"
            :currentStockEdit="currentStockEdit"
          />
         <!-- End of Item picker -->


        <div v-if="!isSalesOrder && !currentStockEdit" id="incoming_add_submit" class="w-full mt-4">
          <Button type="button"
            @trig="handleSubmit"
            primary
            :value="isEditMode ? 'Update' : 'Submit'"
            small
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Input from "../components/elements/Forms/Input.vue";
import Button from "../components/elements/Button.vue";
import PickItemToOutputVue from "../components/PickItemToOutput.vue";
import SelectShift from "../components/parts/SelectShift.vue";
import SelectTypeDocument from "../components/parts/SelectTypeDocument.vue";
import InputSalesOrder from "../components/InputSalesOrder.vue";
import { ref, onMounted, computed, watch } from "vue";
import { closeModalOrDialog } from "../composables/launchForm"
import { useStore } from "vuex";
import { getItemById, gettingStartedRecord as getItems } from "../composables/MasterItems";
import { ddmmyyyy } from "../utils/dateFormat";
import { getAvailableDateByItem, getStockById } from "../composables/StockMaster";
import { createOutput, getOutputById, updateOutputById, changeQuantityOutput } from "../composables/Output"
import { getSalesOrderById, removeChildItemsOrder } from "../composables/SalesOrder"
import { getItemOrderById, changeOrderValue } from "../composables/SalesOrderItem"

// vuex
const store = useStore()
// date record
const date = ref(new Date())
// shift record
const shift = ref(1)
// type incom product
const type = ref(null)
// paper id record
const nomor_so = ref(null)
// customer name
const customer = ref(null)
// master stock
const stockChild = ref([])
// current stock editing
const currentStockEdit=ref(null)
// stock to update while editing form
const stockToUpdate = ref([])


const stockChildDetails = ref([])

const stockChildMap = async () => {
  stockChildDetails.value = []
  for(const stock of stockChild.value) {
    const getStockMaster = await getStockById(stock?.stock_master_id)
    const getItem = await getItemById(getStockMaster?.item_id)
    stockChildDetails.value.push({
      id: stock?.id,
      item: getItem.nm_item,
      quantity: stock?.quantity,
      product_created: ddmmyyyy(getStockMaster.product_created, "-")
    })
  }
}
// to add new item form
const handleStock = (operation, e) => {
  //  data from child = { stock_master_id, quantity }
  if(operation == 'add') {
    const id = e?.id || stockChild.value.length +1 + ""
    stockChild.value.push({ id, ...e })
  } else if (operation == 'edit') {
    currentStockEdit.value = stockChild.value.find((rec) => rec?.id == e)
  }  else if(operation == 'update') {
    stockChild.value = stockChild.value.map((stock) => stock?.id == e.id ? { id: e.id, ...e.value} : stock)
    // if isedit mode, push to stock to uupdate
    if(isEditMode.value) {
      stockToUpdate.value.push(e.id)
    }
    currentStockEdit.value = null
  }
  else {
    stockChild.value = stockChild.value.filter((rec) => rec?.id !== e)
  }
}

const handleSubmit = async () => {
  if(!date.value || !shift.value || !type.value || !nomor_so.value || !stockChild.value || !customer.value) {
    alert("Tidak boleh ada form yang kosong")
    return;
  }

  if(isEditMode.value) {
    // update record
    await handleUpdateOutput()
  }
  // create new output
  else {
    await handleCreateOutput()
  }

  closeModalOrDialog(true)
  // empty the value
  isEditMode.value = null
  salesOrderPicked.value = []
}

const handleCreateOutput = async () => {
  // stock child value = data from child = { stock_master_id, quantity }
  // then insert incoming transction with child from insert all stock
  for (const stock of stockChild.value) {
    // create output record
    await createOutput(date.value, type.value, shift.value, nomor_so.value, stock?.stock_master_id, stock?.quantity, customer.value)
    // change order quantity if it picked from item order, this will return (order - yournumber)
    if(stock.id.length > 3) {
      const orderQuantity = await changeOrderValue(stock.id, -stock.quantity)
      // if order quantity === 0
      // remove item order id from salesorder.childitem
      if(orderQuantity === 0) {
        for(const SOrder of salesOrderPicked.value) {
          if(SOrder) {
            await removeChildItemsOrder(SOrder, stock.id)
          }
        }
      }
    }
  }
  return;
}

const handleUpdateOutput = async () => {
  // stock child value = data from child = { id,  stock_master_id, quantity }
  // looping all child stock as stock
  for(const stock of stockChild.value) {
    // is stockToOuput.value.includes(stock)
    if(stockToUpdate.value.includes(stock.id)) {
      const newRec = {
        date: date.value,
        type: type.value,
        shift: shift.value,
        nomor_so: nomor_so.value,
        customer: customer.value
      }
      // update output
      await updateOutputById(isEditMode.value, newRec)
      // update quantity
      await changeQuantityOutput(isEditMode.value, stock?.quantity)
    }
  }
  // finished
}

// will contain id of record that we will update it
const isEditMode = ref(null)
// checking is that sales order or not
const isSalesOrder = computed(() => isEditMode.value ? !isNaN(isEditMode.value.slice(-8)) : null)


// will contain condition is the output picking from salesOrder or not
const salesOrderPicked = ref([])
// handle SOrder
const handleSOrder = async (salesOrderId) => {
  // get last 8 character, and it must be number
  const isContainSalesOrderNumber = salesOrderId.slice(-8)
  nomor_so.value = salesOrderId
  if(isNaN(isContainSalesOrderNumber)){
    return;
  }
  // get sales order by id. this will return { id, nomor_so, tanggal_so, customer }
  const salesOrderDetails = await getSalesOrderById(salesOrderId)
  // if sales order not found
  if(!salesOrderDetails) {
    return;
  }
  // put to nomor_so the form
  nomor_so.value = salesOrderDetails.nomor_so
  customer.value = salesOrderDetails.customer
  // if salesOrderDetails.childItemsOrder.length > 0
  if(salesOrderDetails.childItemsOrder.length > 0) {
  // get all item order by salesOrderDetails.childItemsOrder
    for(const idItemOrder of salesOrderDetails.childItemsOrder) {
    // get sales order item. this will return { id, item_id, order }
    const itemOrder = await getItemOrderById(idItemOrder)
    // item order is null
    if(!itemOrder?.id) {
      return;
    }
    // get stock master by item id, this will return [{ id, product_created }, .....]
    const dateStockMaster = await getAvailableDateByItem(itemOrder.item_id)
    if(!dateStockMaster.length) {
      return;
    }
    // get stockMasterById, this will return { item_id, product_created, quantity}
    const stockMaster = await getStockById(dateStockMaster[0]?.id)
    // compare quantity
    // if quantity > order
    // or datestockmaster only availbale 1
    if(stockMaster.quantity >= itemOrder.order || dateStockMaster.length === 1) {
        // put to item lists
        // if the quantity stockMaster.quantity >= itemOrder.order alert it bro
        if(stockMaster.quantity < itemOrder.order) {
          const item = getItemByIdInState(itemOrder.item_id)
          alert(`Permintaan item ${item.nm_item} sebanyak ${itemOrder.order} karton tidak cukup, stock hanya tersedia ${stockMaster.quantity} karton!`)
          handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: stockMaster.quantity })
        } else {
          handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: itemOrder.order })
        }
      } else {
        // count the - quantity = sisa item order1
        const quantity2 = itemOrder.order - stockMaster.quantity
        // put the quantity stock1
        handleStock('add', { id: itemOrder.id, stock_master_id: stockMaster?.id, quantity: stockMaster.quantity })
        // search for quantity 2
        // get stockMasterById, this will return { item_id, product_created, quantity}
        const stockMaster2 = await getStockById(dateStockMaster[1]?.id)
        // sisa item order2, if quantity3 >= 0 it means enough
        const quantity3 = stockMaster2.quantity - quantity2
        // put the quantity stock2
        handleStock('add', {
                id: itemOrder.id,
                stock_master_id: stockMaster2?.id,
                quantity: quantity3 >= 0 ? quantity2 : stockMaster2.quantity
              })
      }
    }
  }
  // record sorder that picked
  salesOrderPicked.value.push((salesOrderId))
}

// watch stock child, and render every it change
const watcherCallFunction = ref(null)
watch([stockChild], () => {
  // reset time out
  clearTimeout(watcherCallFunction.value)
  // set new timeout
  watcherCallFunction.value = setTimeout(() => {
    stockChildMap()
  }, 300) 
}, { deep: true })

onMounted( async () => {
  await getItems()
  // checking is any document to edit in state
  isEditMode.value = store.state.form?.document
  if(isEditMode.value) {
    // if sales order
    if(isSalesOrder.value) {
      handleSOrder(isEditMode.value)
    }
    // else, edit output
    else {
      // get output details
      const output = await getOutputById(isEditMode.value)
      // add to stock child
      handleStock('add', {
        id: output.id,
        stock_master_id: output.stock_master_id,
        quantity: output.quantity,
      })
      // set variable
      date.value = new Date(output.tanggal)
      shift.value = Number(output.shift)
      type.value = output.type
      nomor_so.value = output.nomor_so
      customer.value = output?.customer
    }
  }
})

</script>
