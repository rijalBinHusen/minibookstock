<template>
  <div style="width: 750px" id="stock_master" class="w-full">
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
            id="input-item-output"
          />
          <datalist id="item">
            <option
              @select="handleItem(item.item_id)"
              v-for="item in itemAvailable"
              :key="item.item_id"
              :value="item.kd_item + '* ' + item.nm_item"
            />
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
          <span id="max-quantity" class="label-text"
            >Qantity (Max: {{ quantityAvailableStockMaster }})</span
          >
        </label>
        <div class="relative">
          <input
            type="number"
            placeholder="Quantity"
            class="w-32 input input-sm input-primary"
            @keyup="quantity = $event.target.value"
            :value="quantity"
            @change="quantity = $event.target.value"
            id="quantity"
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
          id="reset-item"
          small
        />
        <Button
          type="button"
          primary
          :value="isEditMode ? 'Update' : 'Add item'"
          @trig="handleSubmit"
          small
          class="ml-2"
          id="button-add-item"
        />
      </div>
    </div>

    <TableVue
      style="overflow: auto; max-height: 300px"
      keyData="id"
      :contents="stockChild"
      :options="[Boolean(isParentEditMode) ? '' : 'delete', 'edit']"
      :thead="['Item', 'quantity', 'tanggal produksi']"
      :tbody="['item', 'quantity', 'product_created']"
      @deleteRec="handleBtnTable('remove', $event)"
      @edit="handleBtnTable('edit', $event)"
      id="table-item"
    />
  </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from '../../components/elements/Forms/Input.vue';
import Button from '@/components/elements/Button.vue';
import TableVue from '../../components/elements/Table.vue';
import { ref, defineEmits, defineProps, watch, onBeforeMount } from 'vue';
import { Items } from '../MasterItems/MasterItems';
const { getItemByKdItem, getItemById } = Items();
import {
  getStockById,
  StockToOutput,
  getStockThatAvailable,
  Stock_masters,
} from '../StockMasters/StockMaster';
import Select from '../../components/elements/Forms/Select.vue';
import { getOutputById } from '../Output/Output';

const props = defineProps({
  isParentEditMode: String,
  stockChild: Array,
  currentStockEdit: Object,
});

// emit
const emit = defineEmits([
  'addStock',
  'removeStock',
  'editStock',
  'updateStock',
]);

const stock = new StockToOutput();

// will contain id of record that on edit
const isEditMode = ref(null);
// item llist that available
const itemAvailable = stock.itemThatAvailable();

// item mode
const itemModel = ref(null);
const quantity = ref(null);
// item kd and name
const item = ref(null);
const item_detail = ref(null);
// lists of date that availablel to taken
const itemAvilabelDate = ref([]);
// stock master that should we take
const currentStockMaster = ref(null);
// available stock that can take to quantity output
const quantityAvailableStockMaster = ref(null);

const handleItem = async (e) => {
  if (e.target.value) {
    // getItem
    const kd_item = e.target.value.split('*')[0];
    item_detail.value = await getItemIdByKdItem(kd_item);
    item.value = item_detail.value?.id;
    // after item taken
    // get product created by it item that available to take
    itemAvilabelDate.value = stock.getAvailableDateByItem(item.value);
  }
  return;
};

const hadleStockMaster = async (id_stock_master) => {
  // set the stock master
  currentStockMaster.value = id_stock_master;
  // get stock master by id
  const stockAvailable = stock.getAvailableStock(id_stock_master);
  // get the quantity
  // show the maximum quantity
  if (stockAvailable) {
    if (props.isParentEditMode) {
      quantityAvailableStockMaster.value =
        quantityAvailableStockMaster.value + stockAvailable;
    } else {
      quantityAvailableStockMaster.value = stockAvailable;
    }
  }
  // console.log(stockMaster)
};

const handleSubmit = async () => {
  // condition
  const condition =
    currentStockMaster.value &&
    Number(quantity.value) <= Number(quantityAvailableStockMaster.value);
  // if condition false
  if (!condition) {
    alert(
      'Tidak boleh ada form yang kosong, dan quantity tidak melebihi maximal'
    );
    return;
  }
  let quantityToOutput = isEditMode.value
    ? Number(quantity.value) - quantityAvailableStockMaster.value
    : Number(quantity.value);
  // variable new record
  const record = {
    stock_master_id: currentStockMaster.value,
    quantity: quantity.value,
  };
  // is edit mode
  if (isEditMode.value) {
    // send event to parent
    emit('updateStock', { id: isEditMode.value, value: record });
  }
  // create stock
  else {
    // send event to parent
    emit('addStock', record);
    // set quantity stock
    stock.pickAvailableStock(currentStockMaster.value, quantityToOutput);
  }
  // reset the form after submit
  resetForm();
  isEditMode.value = null;
};

const resetForm = () => {
  setTimeout(() => {
    item_detail.value = '';
    item.value = '';
    itemModel.value = '';
    quantity.value = '';
    itemAvilabelDate.value = [];
    // to empty currentStockEdit in parent
    emit('editStock', false);
    // set the stock master
    currentStockMaster.value = null;
    // show the maximum quantity
    quantityAvailableStockMaster.value = null;
    // editmode
    isEditMode.value = null;
  }, 300);
};

// // btn table handle
const handleBtnTable = (operation, id) => {
  if (operation === 'remove') {
    const confirm = window.confirm(
      'Apakah anda yakin akan menghapus item tersebut'
    );
    if (confirm) {
      emit('removeStock', id);
    }
  } else {
    emit('editStock', id);
  }
};

watch([props], async () => {
  if (props?.currentStockEdit?.id) {
    // get stock master
    const stockMaster = await getStockById(
      props?.currentStockEdit?.stock_master_id
    );
    // set editmode
    isEditMode.value = props?.currentStockEdit?.id;
    // get item
    const itemDetails = await getItemById(stockMaster['item_id']);
    // set quantity
    // console.log(props?.currentStockEdit)
    quantity.value = props?.currentStockEdit?.quantity;
    // set item model
    itemModel.value = itemDetails.kd_item + '* ' + itemDetails.nm_item;
    // set item id
    item.value = itemDetails.id;
    // waiting item to input text
    await handleItem({ target: { value: itemModel.value } });
    // set quantity available stock master
    // if isEditMode.value.length > 5 it means we're edit record from output database
    if (isEditMode.value.length > 5) {
      const outputRec = await getOutputById(isEditMode.value);
      quantityAvailableStockMaster.value = Number(outputRec?.quantity);
    } else {
      quantityAvailableStockMaster.value = props?.currentStockEdit?.quantity;
    }
    // set stock master using this way
    hadleStockMaster(stockMaster.id);
  }
});

// jika quantity master tidak tersedia
// jika

onBeforeMount(async () => {
  if (!props.isParentEditMode) {
    await getStockThatAvailable();
  }
});
</script>
../MasterItems/StockMaster