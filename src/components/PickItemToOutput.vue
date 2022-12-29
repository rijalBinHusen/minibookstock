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
                />
                </div>
            </div>
            <!-- Kode produksi -->
            <div v-if="currentStockMaster" class="form-control">
                <label class="label">
                    <span class="label-text">Qantity (Max: {{ quantityAvailableStockMaster }} Ctn)</span>
                </label>
                <div class="relative">
                <input
                    type="text"
                    placeholder="Quantity"
                    class="w-32 input input-sm input-primary"
                    @keyup="quantity = $event.target.value"
                    :value="quantity"
                    />
                </div>
            </div>
            <!-- tanggal produksi -->
            <!-- <div class="form-control">
                <label for="date-picker" class="label">
                <span class="label-text">Tanggal produksi</span>
                </label>
                <date-picker
                id="date-picker"
                class="input input-outline input-primary input-sm w-28"
                v-model="product_created"
                input-format="yyyy-MM-dd"
                @update:model-value="handleUpdateDate('created', $event)"
                ></date-picker>
            </div> -->
            <!-- tanggal produksi -->
            <!-- <div class="form-control">
                <label for="date-picker" class="label">
                <span class="label-text">Tanggal expired</span>
                </label>
                <date-picker
                id="date-picker"
                class="input input-outline input-primary input-sm w-28"
                v-model="product_expired"
                input-format="yyyy-MM-dd"
                @update:model-value="handleUpdateDate('expired', $event)"
                ></date-picker>
            </div> -->
            <div id="incoming_item_add" class="w-full text-right">
            <Button 
                type="button" 
                primary 
                :value="isEditMode ? 'Update' : 'Add item'" 
                @trig="handleSubmit" 
                small />
            </div>
        </div>
        
        <TableVue
            style="overflow: auto; max-height: 300px"
            keyData="id"
            :contents="stockChild"
            :options="['delete']"
            :thead="['Item', 'quantity', 'tanggal produksi']"
            :tbody="['item', 'quantity', 'product_created']"
            @deleteRec="handleBtnTable('hapus', $event)"
        />
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import Button from "@/components/elements/Button.vue";
import TableVue from "./elements/Table.vue";
import { ref, defineEmits, defineProps, computed } from 'vue';
import { getItemIdByKdItem } from "../composables/MasterItems";
import { itemThatAvailable, getAvailableDateByItem, getStockById } from "../composables/StockMaster"
import Select from "./elements/Forms/Select.vue";

const props = defineProps({
    isParentEditMode: String,
    stockChild: Array,
    currentStockEdit: Object,
})
const emit = defineEmits(['addStock', 'removeStock', 'editStock', 'updateStock'])
// will contain id of record that on edit
const isEditMode = ref(null)

const itemAvailable = computed(() => itemThatAvailable())

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

const handleItem = (e) => {
    if(e.target.value) {
        // getItem
        const kd_item = e.target.value.split("*")[0]
        item_detail.value = getItemIdByKdItem(kd_item)
        item.value = item_detail.value?.id
        // after item taken
        // get product created by it item that available to take
        itemAvilabelDate.value = getAvailableDateByItem(item_detail.value?.id)
    }
}

const hadleStockMaster = (id_stock_master) => {
    // set the stock master
    currentStockMaster.value = id_stock_master
    // get stock master by id
    const stockMaster = getStockById(id_stock_master)
    // get the quantity
    // show the maximum quantity
    quantityAvailableStockMaster.value = stockMaster.available
    // console.log(stockMaster)
}

const handleSubmit = async () => {
    const condition = currentStockMaster.value && Number(quantity.value) <= Number(quantityAvailableStockMaster.value)
    if(condition) {
        const record = {
                stock_master_id: currentStockMaster.value, 
                quantity: Number(quantity.value),
            }
        if(isEditMode.value) {
            emit('updateStock', { id: isEditMode.value, value: record})
        }  else {
            emit('addStock', record)
        }   
            // reset the form after submit
        resetForm()
    } else {
        alert("Tidak boleh ada form yang kosong, dan quantity tidak melebihi maximal")
    }
    isEditMode.value = null
}

const resetForm = () => {
    setTimeout(() => {
        item_detail.value = ""
        item.value = ""
        itemModel.value = ""
        quantity.value = ""
        itemAvilabelDate.value = ""
    }, 300)
}

// // btn table handle
const handleBtnTable = (operation, id) => {
    const confirm = window.confirm("Apakah anda yakin akan menghapus item tersebut")
    if(confirm) {
        emit('removeStock', id)
    }
}

</script>