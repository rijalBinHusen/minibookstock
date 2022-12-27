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
                v-model="product_date"
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
                value="Add item" 
                @trig="handleSubmit" 
                small />
            </div>
        </div>
        
        <TableVue
            style="overflow: auto; max-height: 300px"
            keyData="id that would you accept when button clicked"
            :contents="listOfStock"
            :options="['edit', 'delete']"
            :thead="['Item', 'quantity', 'tanggal produksi']"
            :tbody="['item_id', 'quantity', 'product_created']"
        />
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import datePicker from "vue3-datepicker";
import Button from "@/components/elements/Button.vue";
import TableVue from "./elements/Table.vue";
import { ref, onMounted, defineEmits } from 'vue';
import { gettingStartedRecord, Master_items, getItemIdByKdItem } from "../composables/MasterItems";
import { createStock } from "../composables/StockMaster"
import { ymdTime } from "../utils/dateFormat"


// origin date
const product_date = ref(new Date());
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

const handleUpdateDate = (whatDate, e) => {
    //     // const 1 month
    const aMonth = 1000*60*60*24*30;
    // set product date that to input to daatabase
    product_date.value = e
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
        product_date.value = created_date
    }
}

const handleSubmit = async () => {
    const stock = await createStock(item.value, kd_produksi.value, ymdTime(product_date.value), quantity.value)
    listOfStock.value.unshift(stock)
}

const emit = defineEmits(['valueChanged'])

// record value changed
const valueChanged = ref({})


onMounted(async () => {
    gettingStartedRecord()
    // product_date.value = new Date(props.product_created)
})

</script>