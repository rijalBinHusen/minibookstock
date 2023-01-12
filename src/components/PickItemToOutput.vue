<template>
    <div style="width:750px;" id="stock_master" class="w-full">
        <div id="incoming_items" class="flex gap-4 mb-2 items-end">
            <!-- items -->
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Item</span>
                </label>
                <div class="relative">
                <input
                    type="text"
                    placeholder="Masukkan item"
                    class="w-64 input input-sm input-primary"
                    @change="handleItem"
                    v-model="itemModel"
                    list="item"
                    :disabled="isParentEditMode"
                />
                <datalist id="item">
                    <option @select="handleItem(item.item_id)" v-for="item in itemAvailable" :key="item.item_id" :value="item.kd_item + '* '+item.nm_item" />
                </datalist>

                </div>
            </div>
            <!-- Select product created -->
            <div v-if="item" class="form-control">
                <label class="label" for="tanggal-produksi">
                    <span class="label-text">Tanggal produksi</span>
                </label>
                <div class="relative">
                <Select
                    value="id"
                    text="product_created"
                    id="tanggal-produksi"
                    :options="itemAvilabelDate"
                    size="small"
                    class="w-32"
                    @selectedd="hadleStockMaster($event)"
                    :inSelect="currentStockMaster"
                    :disabled="Boolean(isParentEditMode)"
                />
                </div>
            </div>
            <!-- Kode produksi -->
            <div v-if="currentStockMaster" class="form-control">
                <label class="label">
                    <span class="label-text">Qantity (Max: {{ quantityAvailableStockMaster }})</span>
                </label>
                <div class="relative">
                <input
                    type="number"
                    placeholder="Quantity"
                    class="w-32 input input-sm input-primary"
                    @keyup="quantity = $event.target.value"
                    :value="quantity"
                    @change="quantity = $event.target.value"
                    />
                </div>
            </div>
            <div id="incoming_item_add" class="w-full text-right">
              <Button
                v-if="isEditMode"
                type="button"
                secondary
                value="Cancel"
                @trig="resetForm"
                small />
              <Button
                type="button"
                primary
                :value="isEditMode ? 'Update' : 'Add item'"
                @trig="handleSubmit"
                small
                class="ml-2"
              />
            </div>
        </div>

        <TableVue
            style="overflow: auto; max-height: 300px"
            keyData="id"
            :contents="stockChild"
            :options="[ Boolean(isParentEditMode) ? 'edit' : 'delete']"
            :thead="['Item', 'quantity', 'tanggal produksi']"
            :tbody="['item', 'quantity', 'product_created']"
            @deleteRec="handleBtnTable('remove', $event)"
            @edit="handleBtnTable('edit', $event)"
        />
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import Button from "@/components/elements/Button.vue";
import TableVue from "./elements/Table.vue";
import { ref, defineEmits, defineProps, computed, onMounted, watch } from 'vue';
import { getItemIdByKdItem, getItemById } from "../composables/MasterItems";
import { getStockById, getStockToOutput } from "../composables/StockMaster"
import Select from "./elements/Forms/Select.vue";

const props = defineProps({
    isParentEditMode: String,
    stockChild: Array,
    currentStockEdit: Object,
})

// initiate stock to output
const stock = async () => await getStockToOutput()
// emit
const emit = defineEmits(['addStock', 'removeStock', 'editStock', 'updateStock'])
// will contain id of record that on edit
const isEditMode = ref(null)
// item llist that available
const itemAvailable = stock

// item mode
const itemModel = ref(null)
const quantity = ref(null)
// item kd and name
const item = ref(null);
const item_detail = ref(null)
// lists of date that availablel to taken
const itemAvilabelDate = ref([])
// stock master that should we take
const currentStockMaster = ref(null)
// available stock that can take to quantity output
const quantityAvailableStockMaster = ref(null)

const handleItem = async (e) => {
    if(e.target.value) {
        // getItem
        const kd_item = e.target.value.split("*")[0]
        item_detail.value = await getItemIdByKdItem(kd_item)
        item.value = item_detail.value?.id
        // after item taken
        // get product created by it item that available to take
        itemAvilabelDate.value = await getAvailableDateByItem(item_detail.value?.id)
    }
    return;
}

const hadleStockMaster = async (id_stock_master) => {
    // set the stock master
    currentStockMaster.value = id_stock_master
    // get stock master by id
    const stockMaster = await getStockById(id_stock_master)
    // get the quantity
    // show the maximum quantity
    if(stockMaster?.available) {
      if(props.isParentEditMode) {
        quantityAvailableStockMaster.value = quantityAvailableStockMaster.value + stockMaster.available
      } else {
        quantityAvailableStockMaster.value =  stockMaster.available
      }
    }
    // console.log(stockMaster)
}

const handleSubmit = async () => {
    // condition
    const condition = currentStockMaster.value && Number(quantity.value) <= Number(quantityAvailableStockMaster.value)
    // if condition false
    if(!condition) {
        alert("Tidak boleh ada form yang kosong, dan quantity tidak melebihi maximal")
        return;
    }
    // variable new record
    const record = {
            stock_master_id: currentStockMaster.value,
            quantity: Number(quantity.value),
        }
    // is edit mode
    if(isEditMode.value) {
        // send event to parent
        emit('updateStock', { id: isEditMode.value, value: record})
    }
    // create stock
    else {
        // send event to parent
        emit('addStock', record)
    }
    // reset the form after submit
    resetForm()
    isEditMode.value = null
}

const resetForm = () => {
    setTimeout(() => {
        item_detail.value = ""
        item.value = ""
        itemModel.value = ""
        quantity.value = ""
        itemAvilabelDate.value = []
        // to empty currentStockEdit in parent
        emit('editStock', false)
        // set the stock master
        currentStockMaster.value = null
        // show the maximum quantity
        quantityAvailableStockMaster.value = null
        // editmode
        isEditMode.value = null
    }, 300)
}

// // btn table handle
const handleBtnTable = (operation, id) => {
  if(operation === 'remove') {
    const confirm = window.confirm("Apakah anda yakin akan menghapus item tersebut")
      if(confirm) {
        emit('removeStock', id)
      }
    } else {
      emit('editStock', id)
    }
}

watch([props], async () => {
  if(props?.currentStockEdit?.id) {
    // get stock master
    const stockMaster = await getStockById(props?.currentStockEdit?.stock_master_id)
      // get item
      const itemDetails = await getItemById(stockMaster['item_id'])
      // set quantity
      // console.log(props?.currentStockEdit)
      quantity.value = props?.currentStockEdit?.quantity
      // set item modedl
      itemModel.value = itemDetails.kd_item + "* " + itemDetails.nm_item
      // set item id
      item.value = itemDetails.id
      // waiting item to input text
      await handleItem({target: { value: itemModel.value }})
      // set stock master using this way
      quantityAvailableStockMaster.value = props?.currentStockEdit?.quantity
      hadleStockMaster(stockMaster.id)
      // set editmode
      isEditMode.value = props?.currentStockEdit?.id
    }
})

// jika quantity master tidak tersedia
// jika

onMounted( async () => {
    stock.value = await getStockToOutput()
})

</script>
