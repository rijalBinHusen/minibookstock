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

          <!-- Shift -->
          <!-- <div class="form-control">
            <label for="shift" class="label">
              <span class="label-text">Shift</span>
            </label>
            <Select
            @selectedd="shift = $event"
              id="shift"
                :options="[
                    { shift: '1' },
                    { shift: '2' },
                    { shift: '3' },
                ]"
              value="shift"
              text="shift"
              size="primary small"
              :inSelect="shift"
            />
          </div> -->
          <SelectShift @selected-shift="shift = $event" :shift="shift" />
          <!-- end of Shift -->
          <!-- Coming from -->
          <SelectTypeDocument jurnal="keluar" :typeJurnal="type" @selected-type="type = $event" />
          <!-- End of coming from -->
        </div>

        <div id="incoming_paper" class="grid grid-cols-3 gap-4">
          <Input
            label="Nomor sales order"
            @send="nomor_so = $event"
            small
            placeholder="Nomor sales order"
            tipe="primary"
            :value="nomor_so"
          />
          <Input
            label="Customer"
            @send="customer_name = $event"
            small
            placeholder="Nama customer"
            tipe="primary"
            :value="customer_name"
          />
          <!-- <Input
            label="Penerima"
            small
            @send="diterima = $event"
            placeholder="Penerima"
            tipe="primary"
            :value="diterima"
          /> -->
        </div>

        <!-- Item picker -->
         <PickItemToOutputVue 
            :isParentEditMode="isEditMode" 
            :stockChild="stockChildDetails" 
            @addStock="handleStock('add', $event)"
            @removeStock="handleStock('remove', $event)"
            :currentStockEdit="currentStockEdit"
          />
         <!-- End of Item picker -->
        

        <div v-if="!isSalesOrder" id="incoming_add_submit" class="w-full mt-4">
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
import Select from "../components/elements/Forms/Select.vue";
import Input from "../components/elements/Forms/Input.vue";
import Button from "../components/elements/Button.vue";
import PickItemToOutputVue from "../components/PickItemToOutput.vue";
import SelectShift from "../components/parts/SelectShift.vue";
import SelectTypeDocument from "../components/parts/SelectTypeDocument.vue";
import { ref, onMounted, computed } from "vue";
import { closeModalOrDialog } from "../composables/launchForm"
import { useStore } from "vuex";
import { getItemByIdInState, gettingStartedRecord as getItems } from "../composables/MasterItems";
import { ddmmyyyy } from "../utils/dateFormat";
import { getSTockByIdInState, getAvailableDateByItem, getStockById } from "../composables/StockMaster";
import { createOutput } from "../composables/Output"
import { getSalesOrderById } from "../composables/SalesOrder"
import { getItemOrderById } from "../composables/SalesOrderItem"
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
const customer_name = ref(null)
// master stock
const stockChild = ref([])
// current stock editing
const currentStockEdit=ref(null)


const stockChildDetails = computed(() => stockChild.value.map((stock) => {
      const getStockMaster = getSTockByIdInState(stock?.stock_master_id)
      const getItem = getItemByIdInState(getStockMaster?.item_id)
      return {
        id: stock?.id,
        item: getItem.nm_item,
        quantity: stock?.quantity,
        product_created: ddmmyyyy(getStockMaster.product_created, "-")
      }
    }
  )
)
// to add new item form
const handleStock = (operation, e) => {
  //  data from child = { stock_master_id, quantity }
  if(operation == 'add') {
    stockChild.value.push({
      id: stockChild.value.length +1 + "",
      ...e
    })
  }  else {
    stockChild.value = stockChild.value.filter((rec) => rec?.id !== e)
  }
}

const handleSubmit = async () => {
  // stock child value = data from child = { stock_master_id, quantity }
  if(date.value && shift.value && type.value && nomor_so.value && stockChild.value) {
      // then insert incoming transction with child from insert all stock
      for (const stock of stockChild.value) {
        await createOutput(date.value, type.value, shift.value, nomor_so.value, stock?.stock_master_id, stock?.quantity )
      }
      
    closeModalOrDialog(true)
  } else {
    alert("Tidak boleh ada form yang kosong")
  }
  // empty the value
      isEditMode.value = null
}

// will contain id of record that we will update it
const isEditMode = ref(null)
// checking is that sales order or not
const isSalesOrder = computed(() => isEditMode.value ? isEditMode.value.slice(0, 2) === "SO" : null)

onMounted( async () => {
  await getItems()
  // checking is any document to edit in state
  isEditMode.value = store.state.form?.document
  if(isEditMode.value) {
    // if sales order
    if(isSalesOrder) {
      // get sales order by id. this will return { id, nomor_so, tanggal_so, customer }
      const salesOrderDetails = await getSalesOrderById(isEditMode.value)
      // put to nomor_so the form
      nomor_so.value = salesOrderDetails.nomor_so
      customer_name.value = salesOrderDetails.customer
      // if salesOrderDetails.childItemsOrder.length > 0
      if(salesOrderDetails.childItemsOrder.length > 0) {
        // get all item order by salesOrderDetails.childItemsOrder
        for(const idItemOrder of salesOrderDetails.childItemsOrder) {
          // get sales order item. this will return { id, item_id, order }
          const itemOrder = await getItemOrderById(idItemOrder)
          // get stock master by item id, this will return [{ id, product_created }, .....]
          const dateStockMaster = await getAvailableDateByItem(itemOrder.item_id)
          // get stockMasterById, this will return { item_id, product_created, quantity}
          const stockMaster = await getStockById(dateStockMaster[0]?.id)
          // compare quantity
          // if quantity > order
          if(stockMaster.quantity >= itemOrder.order) {
            // put to item lists
            handleStock('add', { stock_master_id: stockMaster?.id, quantity: itemOrder.order })
          } else {
            // count the - quantity = sisa item order1
            const quantity2 = itemOrder.order - stockMaster.quantity
            // put the quantity stock1
            handleStock('add', { stock_master_id: stockMaster?.id, quantity: stockMaster.quantity })
            // search for quantity 2
            // get stockMasterById, this will return { item_id, product_created, quantity}
            const stockMaster2 = await getStockById(dateStockMaster[1]?.id)
            // sisa item order2, if quantity3 >= 0 it means enough
            const quantity3 = stockMaster2.quantity - quantity2
            // put the quantity stock2
            handleStock('add', { 
                    stock_master_id: stockMaster2?.id, 
                    quantity: quantity3 >= 0 ? quantity2 : stockMaster2.quantity
                  })
          }
          // else
          // put to item lists
          // record = {
          //           stock_master_id: currentStockMaster.value, 
          //           quantity: Number(quantity.value),
          //       }
        }

      }
      
    }
  }
})

</script>
