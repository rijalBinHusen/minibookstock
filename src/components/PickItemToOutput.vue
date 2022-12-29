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
                    <option @select="handleItem(item.item_id)" v-for="item in itemAvailable" :key="item.item_id" :value="item.kd_item + '* '+item.nm_item" />
                </datalist>

                </div>
            </div>
            <!-- Select product created -->
            <div class="form-control">
                <Select 
                    v-if="item"
                    value="id"
                    text="product_created"
                    id="data_to_import"
                    :options="itemAvilabelDate"
                    size="small"
                    class="w-56"
                    @selectedd="activeJurnalToInput = $event"
                />
            </div>
            <!-- Kode produksi -->
            <!-- <div class="form-control">
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
            </div> -->
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
import Button from "@/components/elements/Button.vue";
import TableVue from "./elements/Table.vue";
import { ref, defineEmits, defineProps, computed } from 'vue';
import { getItemIdByKdItem } from "../composables/MasterItems";
import { itemThatAvailable, getAvailableDateByItem } from "../composables/StockMaster"
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

const quantity = ref(null)
const kd_produksi = ref(null)
// item kd and name
const item = ref(null);
const item_detail = ref(null)
// lists of date that availablel to taken
const itemAvilabelDate = ref([])

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

// const handleUpdateDate = (whatDate, e) => {
//     //     // const 1 month
//     const aMonth = 1000*60*60*24*30;
//     // set product date that to input to daatabase
//     product_created.value = e
//     // get age of product
//     const age_product = item_detail.value?.age_item
//     // get expired of product
//     const new_date = e.getTime()
//     // if product create date date changed
//     if(item.value && whatDate === 'created') {
//         // set expired date
//         const expired_date = new Date( new_date + (aMonth*age_product))
//         // product expired
//         product_expired.value = expired_date
//         // set value
//     } 
//     // expired date changed
//     else {
//         // set expired date
//         const created_date = new Date( new_date - (aMonth*age_product))
//         // product expired
//         product_created.value = created_date
//     }
// }

// const handleSubmit = async () => {
//     if(item.value && kd_produksi.value && product_created.value && quantity.value) {
//         const record = {
//                 item_id: item.value, 
//                 kd_produksi: kd_produksi.value, 
//                 tanggal: ymdTime(product_created.value), 
//                 quantity: quantity.value
//             }
//         if(isEditMode.value) {
//             emit('updateStock', { id: isEditMode.value, value: record})
//         }  else {
//             emit('addStock', record)
//         }   
//             // reset the form after submit
//         resetForm()
//     } else {
//         alert("Tidak boleh ada form yang kosong!")
//     }
//     isEditMode.value = null
// }

// const resetForm = () => {
//     setTimeout(() => {
//         item_detail.value = ""
//         item.value = ""
//         kd_produksi.value = ""
//         quantity.value = ""
//         item_full.value = ""
//     }, 500)
// }

// // btn table handle
// const handleBtnTable = (operation, id) => {
//     if(operation == 'edit') {
//         emit('editStock', id)
//         setTimeout(() => {
//             const item = getItemById(props?.currentStockEdit['item'])
//             kd_produksi.value = props?.currentStockEdit['kd_produksi']
//             product_created.value = new Date(props?.currentStockEdit['tanggal'])
//             quantity.value = props?.currentStockEdit['quantity']
//             item_full.value = item.kd_item + "* " + item.nm_item
//             handleItem({target: { value: item_full.value }})
//             isEditMode.value = id
//         }, 500)
//     } else {
//         const confirm = window.confirm("Apakah anda yakin akan menghapus item tersebut")
//         if(confirm) {
//             emit('removeStock', id)
//         }
//     }
// }

</script>