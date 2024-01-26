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
            v-model="stockOutputForm.itemName"
            list="item"
            :disabled="isParentEditMode"
            id="input-item-output"
          />
          <datalist id="item">
            <option
              v-for="item in itemAvailable"
              :key="item.item_id"
              :value="item.kodeItem + '* ' + item.itemName"
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
            >Qantity (Max: {{ currentStockMaster.available }})</span
          >
        </label>
        <div class="relative">
          <input
            type="number"
            placeholder="Quantity"
            class="w-32 input input-sm input-primary"
            id="quantity"
            v-model="stockOutputForm.quantity"
            :max="currentStockMaster.available"
          />
        </div>
      </div>

      <div id="output_item_add" class="w-full text-right">
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

<script setup lang="ts">
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import { ref, defineEmits, defineProps, watch, onBeforeMount, PropType } from 'vue';
import Input from '../../components/elements/Forms/Input.vue';
import Button from '../../components/elements/Button.vue';
import TableVue from '../../components/elements/Table.vue';
import Select from '../../components/elements/Forms/Select.vue';
import { StockToOutput, AvailableDate, MasterItem, StockMaster } from './OutputForm';
import { getOutputById, stockOutput } from './Output';

const props = defineProps({
  isParentEditMode: {
    type: Boolean,
    required: true
  },
  stockChild: {
    type: Object as PropType<stockOutput>
  },
  currentStockEdit: Object,
});

const emits = defineEmits<{
  (e: 'addStock', stock: stockOutput): void
  (e: 'removeStock', id: number): void
  (e: 'updateStock', stock: stockOutput): void
}>()

const stockOutputForm = ref(<stockOutput>{});

const stock = new StockToOutput();

// will contain id of record that on edit
const isEditMode = ref(null);
// item llist that available
const itemAvailable = stock.itemThatAvailable();

// item kd and name
const item = ref("");
const item_detail = ref(<MasterItem>{});
// lists of date that availablel to taken
const itemAvilabelDate = ref(<AvailableDate[]>[]);
// stockmaster info
const currentStockMaster = ref(<StockMaster>{});

const handleItem = async (e: Event) => {

  const inputElm = e.target as HTMLInputElement;
  if(!e?.target && !inputElm.value) return;

  // getItem
  const kd_item = inputElm.value.split('*')[0];
  
  // after item taken
  item_detail.value = stock.getItemByKodeItem(kd_item);
  item.value = item_detail.value.id;

  // get product created by it item that available to take
  itemAvilabelDate.value = stock.getAvailableDateByKodeItem(kd_item);
};

const hadleStockMaster = async (id_stock_master: string) => {
  // set the stock master
  currentStockMaster.value = stock.getStockMasterById(id_stock_master);
  // get stock master by id
  const stockAvailable = stock.getAvailableStock(id_stock_master);
  // get the quantity
  // show the maximum quantity

  // if (stockAvailable) {

  //   if (props.isParentEditMode) {
  //     // add stock available and taked quantity
  //     quantityAvailableStockMaster.value = quantityAvailableStockMaster.value + stockAvailable;
  //   } 
    
  //   else {
  //     quantityAvailableStockMaster.value = stockAvailable;
  //   }
  // }
};

const handleSubmit = async () => {
  // condition
  const condition = currentStockMaster.value && Number(stockOutputForm.value.quantity) <= Number(currentStockMaster.value.available);
  
  // if condition false
  if (!condition) {
    alert('Tidak boleh ada form yang kosong, quantity tidak melebihi maximal');
    return;
  }

  let quantityToOutput = isEditMode.value
    ? Number(stockOutputForm.value.quantity) - currentStockMaster.value.available
    : Number(stockOutputForm.value);

  // variable new record
  const record = {
    stock_master_id: currentStockMaster.value,
    quantity: stockOutputForm.value,
  };
  // is edit mode
  if (isEditMode.value) {
    // send event to parent
    emits('updateStock', stockOutputForm.value );
  }

  // create stock
  else {
    // send event to parent
    // emit('addStock', record);

    emits("addStock", stockOutputForm.value);
    // set quantity stock
    stock.pickAvailableStock(currentStockMaster.value.id, quantityToOutput);
  }
  // reset the form after submit
  resetForm();
  isEditMode.value = null;
};

const resetForm = () => {

  setTimeout(() => {

    item_detail.value = {
      age_item: 0,
      division: "",
      id: "",
      kd_item: "",
      last_used: 0,
      nm_item: ""
    };

    item.value = '';

    // itemModel.value = null;

    stockOutputForm.value = {
      id: "",
      itemId: "",
      itemName: "",
      product_created: "",
      quantity: 0,
      stockMasterId: ""
    };

    itemAvilabelDate.value = [];
    // to empty currentStockEdit in parent
    // emits('editStock', 1);

    // set the stock master
    // currentStockMaster.value = "";
    // show the maximum quantity
    // quantityAvailableStockMaster.value = 0;
    // editmode
    isEditMode.value = null;
  }, 300);
};

// // btn table handle
const handleBtnTable = (operation, id) => {
  if (operation === 'remove') {
    const confirm = window.confirm('Apakah anda yakin akan menghapus item tersebut');
    if (confirm) {
      emits('removeStock', id);
    }
  } else {
    // emits('editStock', id);
  }
};

watch([props], async () => {
  // if (props?.currentStockEdit?.id) {
  //   // get stock master
  //   const stockMaster = await getStockById(
  //     props?.currentStockEdit?.stock_master_id
  //   );
  //   // set editmode
  //   isEditMode.value = props?.currentStockEdit?.id;
  //   // get item
  //   const itemDetails = await getItemById(stockMaster['item_id']);
  //   // set quantity
  //   // console.log(props?.currentStockEdit)
  //   quantity.value = props?.currentStockEdit?.quantity;
  //   // set item model
  //   itemModel.value = itemDetails.kd_item + '* ' + itemDetails.nm_item;
  //   // set item id
  //   item.value = itemDetails.id;
  //   // waiting item to input text
  //   await handleItem({ target: { value: itemModel.value } });
  //   // set quantity available stock master
  //   // if isEditMode.value.length > 5 it means we're edit record from output database
  //   if (isEditMode.value.length > 5) {
  //     const outputRec = await getOutputById(isEditMode.value);
  //     quantityAvailableStockMaster.value = Number(outputRec?.quantity);
  //   } else {
  //     quantityAvailableStockMaster.value = props?.currentStockEdit?.quantity;
  //   }
  //   // set stock master using this way
  //   hadleStockMaster(stockMaster.id);
  // }
});
</script>
