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
            :disabled="isEditExistingMasterStock"
            :type="isEditExistingMasterStock ? 'button' : 'text'"
            placeholder="Masukkan item"
            class="w-64 input input-sm input-primary"
            @change="handleItem"
            v-model="item_full"
            list="item"
            id="form-input-incoming-item"
          />
          <datalist id="item">
            <option
              v-for="item in Master_items"
              :key="item.id"
              :value="item.kd_item + '* ' + item.nm_item"
            />
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
            type="number"
            placeholder="Quantity"
            class="w-20 input input-sm input-primary"
            v-model="quantity"
            id="form-input-incoming-quantity"
            />
            <!-- @keyup="quantity = $event.target.value"
            :value="quantity"
            @change="quantity = $event.target.value" -->
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
            id="form-input-incoming-kd-produksi"
            v-model="kd_produksi"
          />
            <!-- @keyup="kd_produksi = $event.target.value"
            :value="kd_produksi" -->
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
          id="submit-incoming-item"
          primary
          :value="isEditMode ? 'Update' : 'Add item'"
          @trig="handleSubmit"
          small
        />
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

<script setup lang="ts">
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from '@/components/elements/Forms/Input.vue';
import datePicker from 'vue3-datepicker';
import Button from '@/components/elements/Button.vue';
import TableVue from '@/components/elements/Table.vue';
import { ref, onMounted, defineEmits, defineProps, computed, watch } from 'vue';
import { Items, Master_items } from './MasterItems';
const { 
  getAllMasterItems: getItem,
  getItemByKdItem,
  getItemById } = Items();

import { ymdTime } from '../../utils/dateFormat';

const props = defineProps({
  isParentEditMode: String,
  stockChild: Array,
  currentStockEdit: Object,
});

const isEditExistingMasterStock = computed(
  () =>
    Boolean(props.isParentEditMode) &&
    isEditMode.value &&
    isEditMode.value?.length > 5
);

// origin date
const product_created = ref(new Date());
const product_expired = ref(new Date());
const item = ref(null);
const quantity = ref(null);
const kd_produksi = ref(null);
// item kd and name
const item_full = ref(null);
const item_detail = ref(null);

let timeoutHandleItem = null;
const handleItem = (e) => {
  return new Promise((resolve) => {
    if (e.target.value) {
      // clearTimeout
      clearTimeout(timeoutHandleItem);
      timeoutHandleItem = setTimeout(async () => {
        const kd_item = e.target.value.split('*')[0];
        item_detail.value = await getItemByKdItem(kd_item);
        item.value = item_detail.value?.id;
        resolve("");
      }, 1000);
    }
  });
};

// will contain id of record that on edit
const isEditMode = ref(null);

const handleUpdateDate = (whatDate, e) => {
  //     // const 1 month
  // const aMonth = 1000*60*60*24*30;
  // get age of product
  const age_product = item_detail.value?.age_item;
  // if product create date date changed
  // create new variable date
  const date = new Date(e);

  if (item.value && whatDate == 'created') {
    // set product date that to input to daatabase
    product_created.value = e;
    // get expired of product
    // set expired date
    const expired_date = date.setMonth(date.getMonth() + Number(age_product));
    // product expired
    product_expired.value = new Date(expired_date);
    // set value
  } else {
    // set expired date
    const created_date = date.setMonth(date.getMonth() - Number(age_product));
    // product expired
    product_created.value = new Date(created_date);
    // set value
  }
};

const emit = defineEmits([
  'addStock',
  'removeStock',
  'editStock',
  'updateStock',
]);

const handleSubmit = async () => {
  if (
    item.value &&
    kd_produksi.value &&
    product_created.value &&
    quantity.value
  ) {
    const record = {
      item_id: item.value,
      kd_produksi: kd_produksi.value,
      product_created: ymdTime(product_created.value),
      quantity: quantity.value,
    };
    if (isEditMode.value) {
      emit('updateStock', { id: isEditMode.value, value: record });
    } else {
      emit('addStock', record);
    }
    // reset the form after submit
    resetForm();
  } else {
    alert('Tidak boleh ada form yang kosong!');
  }
};

const resetForm = () => {
  setTimeout(() => {
    item_detail.value = '';
    item.value = '';
    kd_produksi.value = '';
    quantity.value = '';
    item_full.value = '';
    isEditMode.value = null;
  }, 500);
};
// btn table handle
const handleBtnTable = async (operation, id) => {
  if (operation == 'edit') {
    emit('editStock', id);
    // set editmode
    isEditMode.value = id;
  } else {
    const confirm = window.confirm(
      'Apakah anda yakin akan menghapus item tersebut'
    );
    if (confirm) {
      emit('removeStock', id);
    }
  }
};

onMounted(async () => {
  // getting all item
  await getItem();
});

watch([props], async () => {
  // detecting the current stock edit because it async in parent
  if (props?.currentStockEdit) {
    // get item
    const item = await getItemById(props?.currentStockEdit['item_id']);
    // product kode
    kd_produksi.value = props?.currentStockEdit['kd_produksi'];
    quantity.value = props?.currentStockEdit['quantity'];
    item_full.value = item.kd_item + '* ' + item.nm_item;
    // waiting item to input text
    await handleItem({ target: { value: item_full.value } });
    // set product created using this way, so the expired date automate show
    handleUpdateDate(
      'created',
      new Date(props?.currentStockEdit['product_created'])
    );
  }
});
</script>
