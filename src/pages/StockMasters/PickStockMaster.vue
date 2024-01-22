<template>
  <div class="flex">

    <!-- Kode item -->
    <SelectItems :small="true" :kd_item="kd_item" @pickedItem="handleItem" />
    <!-- nama item -->
    <Input
      label="Nama item"
      placeholder="Nama item"
      tipe="primary"
      :value="nm_item"
      disabled
      class="ml-2 w-64"
      small
    />
    <!-- Select product created -->
    <div class="form-control">
        <label class="label" for="tanggal-produksi">
            <span class="label-text">Tanggal produk</span>
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
            :disabled="!kd_item"
        />
        </div>
    </div>
    <!-- quantity  -->
    <div class="form-control ml-2">
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
            :disabled="!kd_item"
            />
        </div>
    </div>
    <!-- option -->
    <div class="flex items-end justify-self-end">
    <Button
      type="button"
      primary
      value="Simpan"
      small
      />
      <!-- @trig="handleSubmit" -->
    </div>
  </div>
</template>

<script setup>
// item quantity tanggal produksi option
import { ref } from 'vue';
import Input from '@/pages/elements/Forms/Input.vue';
import Select from '@/pages/elements/Forms/Select.vue';
import Button from '@/pages/elements/Button.vue';
import SelectItems from '@/pages/MasterItems/SelectItems.vue';
import { Items } from "@/pages/MasterItems/MasterItems"
const { getItemById } = Items();
import { getAvailableDateByItem, getStockById } from "./StockMaster"

// variable for kd_item
const kd_item = ref(null)
// variable for nm_item
const nm_item = ref(null)
// variable for quantity
const quantity = ref(null)
// vairable for date product
const product_created = ref(null)

// ------------------------------------------------
// variable that contain available date of stock item
const itemAvilabelDate = ref([])
// quantity that available
const quantityAvailableStockMaster = ref(null)
// current stock master
const currentStockMaster = ref(null)

const handleItem = async (item_id) => {
  if(item_id) {
    // get item by id
    // getItem
    const itemDetails = await getItemById(item_id)
    // set kd_item
    kd_item.value = itemDetails.kd_item
    // set nm_item
    nm_item.value = itemDetails.nm_item
    // after item taken
    // get product created by it item that available to take
    itemAvilabelDate.value = await getAvailableDateByItem(item_id)
    }
}


const hadleStockMaster = async (id_stock_master) => {
    // set the stock master
    currentStockMaster.value = id_stock_master
    // get stock master by id
    const stockMaster = await getStockById(id_stock_master)
    // get the quantity
    // show the maximum quantity
    quantityAvailableStockMaster.value = stockMaster.available
    // console.log(stockMaster)
}


</script>
../pages/MasterItems/StockMaster