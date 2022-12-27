<template>
    <div id="stock_master">
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
                    @keyup="handleItem"
                    v-model="item_full"
                    list="item"
                />
                <datalist id="item">
                    <option @select="handleItem" v-for="item in Master_items" :key="item.id" :value="item.kd_item + '* ' +item.nm_item" />
                </datalist>

                </div>
            </div>
            <!-- Quantity -->
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Quantity</span>
                </label>
                <div class="relative">
                <input
                    type="text"
                    placeholder="Quantity"
                    class="w-20 input input-sm input-primary"
                    @keyup="quantity = $event.target.value"
                    :value="quantity"
                    />
                </div>
            </div>
            <!-- Kode produksi -->
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Kode produksi</span>
                </label>
                <div class="relative">
                <input
                    type="text"
                    placeholder="Kode"
                    class="w-24 input input-sm input-primary"
                    @keyup="kd_produksi = $event.target.value"
                    :value="kd_produksi"
                    />
                </div>
            </div>
            <!-- tanggal produksi -->
            <div class="form-control">
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
            </div>
            <!-- tanggal produksi -->
            <div class="form-control">
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
            </div>
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
            :contents="listOfStock"
            :options="['edit', 'delete']"
            :thead="['Item', 'quantity', 'tanggal produksi']"
            :tbody="['item', 'quantity', 'product_created']"
            @edit="handleBtnTable('edit', $event)"
            @deleteRec="handleBtnTable('hapus', $event)"
        />
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import datePicker from "vue3-datepicker";
import Button from "@/components/elements/Button.vue";
import TableVue from "./elements/Table.vue";
import { ref, onMounted, defineEmits, computed } from 'vue';
import { gettingStartedRecord as getItem, Master_items, getItemIdByKdItem, getItemById } from "../composables/MasterItems";
import { createStock, getStockWithoutParent, updateStockById, getStockById, removeStockById } from "../composables/StockMaster"
import { ymdTime } from "../utils/dateFormat"


// origin date
const product_created = ref(new Date());
const product_expired = ref(new Date())
const item = ref(null);
const quantity = ref(null)
const kd_produksi = ref(null)
// item kd and name
const item_full = ref(null)
const item_detail = ref(null)

const listOfStock = ref([])

const timeoutHandleItem = ref(null)
const handleItem = (e) => {
    if(e.target.value) {
        clearTimeout(timeoutHandleItem.value)
        timeoutHandleItem.value = setTimeout( async () => {
            const kd_item = e.target.value.split("*")[0]
            item_detail.value = getItemIdByKdItem(kd_item)
            item.value = item_detail.value?.id
        }, 1000)
    }
}

// will contain id of record that on edit
const isEditMode = ref(null)

const handleUpdateDate = (whatDate, e) => {
    //     // const 1 month
    const aMonth = 1000*60*60*24*30;
    // set product date that to input to daatabase
    product_created.value = e
    // get age of product
    const age_product = item_detail.value?.age_item
    // get expired of product
    const new_date = e.getTime()
    // if product create date date changed
    if(item.value && whatDate === 'created') {
        // set expired date
        const expired_date = new Date( new_date + (aMonth*age_product))
        // product expired
        product_expired.value = expired_date
        // set value
    } 
    // expired date changed
    else {
        // set expired date
        const created_date = new Date( new_date - (aMonth*age_product))
        // product expired
        product_created.value = created_date
    }
}

const handleSubmit = async () => {
    if(item.value && kd_produksi.value && product_created.value && quantity.value) {
        if(isEditMode.value) {
            // update on state and db
            updateStockById(isEditMode.value, {
                item_id: item.value, 
                kd_produksi: kd_produksi.value, 
                product_created: ymdTime(product_created.value), 
                quantity: quantity.value,
            })
            // first get stock by id
            const newStock = getStockById(isEditMode.value)
            // update local state here
            // and update
            listOfStock.value = listOfStock.value.map((rec) => {
                return rec?.id === isEditMode.value
                        ? newStock
                        : rec
            })
        } else {
            const stock = await createStock(item.value, kd_produksi.value, ymdTime(product_created.value), quantity.value)
            listOfStock.value.unshift(stock)
            emitStock()
        }
    } else {
        alert("Tidak boleh ada form yang kosong!")
    }
    isEditMode.value = null
}

// btn table handle
const handleBtnTable = (operation, id) => {
    if(operation == 'edit') {
        // console.log(e)
        const stock = getStockById(id)
        // set item id
        item.value = stock?.item_id
        // set detail item { id, name, age}
        item_detail.value = getItemById(item.value);
        // show in input form
        item_full.value = item_detail.value?.kd_item + "* " + item_detail.value.nm_item
        kd_produksi.value = stock?.kd_produksi
        product_created.value = new Date( stock?.product_created )
        quantity.value = stock?.quantity
        isEditMode.value = stock?.id
    } else {
        // confirm first
        let conf = confirm("Apakah anda yakin akan menghapusnya?")
        if(conf) {
            removeStockById(id)
            listOfStock.value = listOfStock.value.filter((rec) => rec?.id !== id)
        }
        return
    }
}

const emit = defineEmits(['stockAdded'])
const emitStock = () => {
    emit('stockAdded', listOfStock.value)
}

onMounted(() => {
    // getting all item
    getItem()
    // getting stock without parent incoming id
    listOfStock.value = getStockWithoutParent()
    // emit stock
    emitStock()
})

</script>