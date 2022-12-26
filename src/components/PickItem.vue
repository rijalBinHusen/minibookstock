<template>
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
              :upper-limit="product_date"
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
              :upper-limit="product_expired"
            ></date-picker>
          </div>
        <div id="incoming_item_add" class="w-full text-right">
          <Button 
            type="button" 
            primary 
            value="Add item" 
            small />
        </div>
        <!-- @trig="addItem"  -->
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import datePicker from "vue3-datepicker";
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue';
import Button from "@/components/elements/Button.vue";
import { gettingStartedRecord, Master_items, getItemIdByKdItem } from "../composables/MasterItems";

const product_date = ref(new Date());
const product_expired = ref(new Date())
const item = ref(null);
const quantity = ref(null)
const kd_produksi = ref(null)
// item kd and name
const item_full = ref(null)

const timeoutHandleItem = ref(null)
const handleItem = (e) => {
    if(e.target.value) {
        clearTimeout(timeoutHandleItem.value)
        timeoutHandleItem.value = setTimeout( async () => {
            const kd_item = e.target.value.split("*")[0]
            item.value = await getItemIdByKdItem(kd_item)
            console.log(item.value)
        }, 1000)
    }
}

const emit = defineEmits(['valueChanged'])

// record value changed
const valueChanged = ref({})


onMounted(async () => {
    await gettingStartedRecord()
    // product_date.value = new Date(props.product_created)
})

</script>