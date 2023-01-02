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
                    @change="handleItem"
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
            :contents="stockChild"
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
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import { gettingStartedRecord as getItem, Master_items, getItemIdByKdItem, getItemById } from "../composables/MasterItems";
import { ymdTime } from "../utils/dateFormat"

const props = defineProps({
    isParentEditMode: String,
    stockChild: Array,
    currentStockEdit: Object,
})

// origin date
const product_created = ref(new Date());
const product_expired = ref(new Date())
const item = ref(null);
const quantity = ref(null)
const kd_produksi = ref(null)
// item kd and name
const item_full = ref(null)
const item_detail = ref(null)

let timeoutHandleItem = null
const handleItem = (e) => {
    if(e.target.value) {
        // clearTimeout
        clearTimeout(timeoutHandleItem)
        timeoutHandleItem = setTimeout( async () => {
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
    // const aMonth = 1000*60*60*24*30;
    // get age of product
    const age_product = item_detail.value?.age_item
    // if product create date date changed
    if(item.value && whatDate == 'created') {
        // set product date that to input to daatabase
        product_created.value = e
        // create new variable date
        const date = new Date(e)
        // get expired of product
        // set expired date
        const expired_date = date.setMonth(date.getMonth() + age_product)
        // product expired
        product_expired.value = expired_date
        // set value
    } else {
        // create new variable date
        const date = new Date(e)
        // set expired date
        const created_date = date.setMonth(date.getMonth() - age_product)
        // product expired
        product_created.value = created_date
        // set value
    }
}

const emit = defineEmits(['addStock', 'removeStock', 'editStock', 'updateStock'])

const handleSubmit = async () => {
    if(item.value && kd_produksi.value && product_created.value && quantity.value) {
        const record = {
                item_id: item.value, 
                kd_produksi: kd_produksi.value, 
                product_created: ymdTime(product_created.value), 
                quantity: quantity.value
            }
        if(isEditMode.value) {
            emit('updateStock', { id: isEditMode.value, value: record})
        }  else {
            emit('addStock', record)
        }   
            // reset the form after submit
        resetForm()
    } else {
        alert("Tidak boleh ada form yang kosong!")
    }
    isEditMode.value = null
}

const resetForm = () => {
    setTimeout(() => {
        item_detail.value = ""
        item.value = ""
        kd_produksi.value = ""
        quantity.value = ""
        item_full.value = ""
    }, 500)
}

// btn table handle
const handleBtnTable = (operation, id) => {
    if(operation == 'edit') {
        emit('editStock', id)
        setTimeout( () => {
            const item = getItemById(props?.currentStockEdit['item_id'])
            console.log()
            kd_produksi.value = props?.currentStockEdit['kd_produksi']
            // set product created using this way, so the expired date automate show
            handleUpdateDate('created',
                new Date(props?.currentStockEdit['product_created'])
            )
            quantity.value = props?.currentStockEdit['quantity']
            item_full.value = item.kd_item + "* " + item.nm_item
            handleItem({target: { value: item_full.value }})
            isEditMode.value = id
        }, 500)
    } else {
        const confirm = window.confirm("Apakah anda yakin akan menghapus item tersebut")
        if(confirm) {
            emit('removeStock', id)
        }
    }
}

// // function to emit to parent
// const emitStock = () => {
//     // id not null it means remove stock record by id
//     emit('stockAdded', listOfIdStock)
// }

// // function to rerender listOfstock that contain master stock
// const renderStock = () => {
//     if(listOfIdStock.length) {
//         const stock = listOfIdStock.map((idMaster) => getStockById(idMaster))
        
//         if(stock) {
//             listOfStock.value = stockMapper(stock);
//         }
//     }
// }

// watch([props],(newVal) => {
//     // we are watching the props because the default props is null
//     // and after several time the props changed
//     // we can't do it in onMounted function
//     // because it just triggered once
//     if(newVal[0]?.isParentEditMode) {
//         listOfIdStock = props?.stockChild
//         renderStock()
//     }
// })

onMounted(() => {
    // getting all item
    getItem()
    // render stock
    // renderStock()
    // // emit stock
    // emitStock()
    // if parent is edit mode
})

</script>