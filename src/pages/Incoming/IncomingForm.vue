<template>
  <div>
    <div
      id="incoming_add_form"
      class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
    >
      <div id="incoming_add_form" class="grid justify-items-center">
        <!-- incoming info paper dll -->
        <div id="incoming_info" class="grid grid-cols-3 gap-4">
          <!-- date picker -->
          <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Tanggal</span>
            </label>
            <date-picker
              id="date-picker-incoming"
              class="input input-outline input-primary input-sm"
              v-model="date"
            ></date-picker>
          </div>
          <!-- end of date picker -->
          <!-- Shift -->
          <SelectShift @selected-shift="shift = $event" :shift="shift" />
          <!-- end of Shift -->
          <!-- Coming from -->
          <SelectTypeDocument
            jurnal="masuk"
            :typeJurnal="type"
            @selected-type="type = $event"
          />
          <!-- End of coming from -->
        </div>

        <div id="incoming_paper" class="grid grid-cols-3 gap-4">
          <Input
            label="Nomor dokumen"
            @send="paper_id = $event"
            small
            placeholder="Nomor dokumen"
            tipe="primary"
            :value="paper_id"
            id="paper-id"
          />
          <Input
            label="Yang menyerahkan"
            @send="diserahkan = $event"
            small
            placeholder="Yang menyerahkan"
            tipe="primary"
            :value="diserahkan"
            id="diserahkan"
          />
          <Input
            label="Penerima"
            small
            @send="diterima = $event"
            placeholder="Penerima"
            tipe="primary"
            :value="diterima"
            id="penerima"
          />
        </div>

        <!-- Item picker -->
        <PickItemVue
          :isParentEditMode="isEditMode"
          :stockChild="stockChildDetails"
          @addStock="handleStock('add', $event)"
          @updateStock="handleStock('update', $event)"
          @editStock="handleStock('edit', $event)"
          @removeStock="handleStock('remove', $event)"
          :currentStockEdit="currentStockEdit"
        />
        <!-- End of Item picker -->

        <div
          v-if="!currentStockEdit"
          id="incoming_add_submit"
          class="w-full mt-4"
        >
          <!-- if message null show button -->
          <Button
            v-if="!message"
            type="button"
            @trig="handleSubmit"
            primary
            :value="isEditMode ? 'Update' : 'Submit'"
            small
            id="submit-incoming"
          />
          <span v-else> {{ message }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import datePicker from 'vue3-datepicker';
import Input from '@/components/elements/Forms/Input.vue';
import Button from '@/components/elements/Button.vue';
import PickItemVue from '@/pages/MasterItems/PickItem.vue';
import { ref, onMounted, computed, watch } from 'vue';
import {
  createIncoming,
  getIncomingById,
  updateIncomingById,
  removeIncomingById,
} from '@/pages/Incoming/Incoming';
import { closeModalOrDialog } from '@/utils/launchForm';
import { useStore } from 'vuex';
import { Items } from '@/pages/MasterItems/MasterItems';
const { getItemById } = Items();

import { ddmmyyyy, ymdTime } from '@/utils/dateFormat';
import {
  createStock,
  getStockById,
  updateStockById,
  removeStockById,
  getStockByIdForIncomingForm,
  setStockParent,
  updateQuantity,
} from '@/pages/StockMasters/StockMaster';
import { getTotalStockTaken } from '@/pages/Output/Output';
import SelectShift from '@/components/parts/SelectShift.vue';
import SelectTypeDocument from '@/components/parts/SelectTypeDocument.vue';
// vuex
const store = useStore();
// date record
const date = ref(new Date());
// shift record
const shift = ref(1);
// type incom product
const type = ref(null);
// paper id record
const paper_id = ref(null);
// handed by record
const diserahkan = ref(null);
// receiver product
const diterima = ref(null);
// master stock
const stockChild = ref([]);
// current stock editing
const currentStockEdit = ref(null);

// what todo whe update form
const idStockToUpdate = ref([]);
const idStockToRemove = ref([]);
const idStockToCreate = ref([]);

const stockChildDetails = ref([])

watch([stockChild], async () => {
  stockChildDetails.value.length = 0
  for(let stock of stockChild.value) {
    const item = await getItemById(stock?.item_id)
    stockChildDetails.value.push({
      id: stock?.id,
      item: item.nm_item,
      quantity: stock?.quantity,
      product_created: ddmmyyyy(stock?.product_created, '-')
    })
  }
}, { deep: true })
// to add new item form
const handleStock = async (operation, e) => {
  // add stock
  if (operation == 'add') {
    // push to local state
    stockChild.value.push({
      id: stockChild.value.length + 1 + '',
      ...e,
    });
    // record id to idStock to create it
    if (isEditMode.value) {
      idStockToCreate.value.push(stockChild.value.length + 1 + '');
    }
  }
  // edit stock
  else if (operation == 'edit') {
    // set current stock edit
    currentStockEdit.value = stockChild.value.find((rec) => rec?.id == e);
  }
  // update stock
  else if (operation == 'update') {
    // set current edit stock to null
    currentStockEdit.value = null;
    // if editMode
    if (isEditMode.value) {
      // total quantity taken
      const stockTaken = await getTotalStockTaken(e.id);
      // prevent update stock when quantity < total taken
      if (Number(e.value.quantity) < Number(stockTaken.allTaken)) {
        // show message
        alert(
          `Stock sudah terambil ${stockTaken.allTaken}, quantity tidak boleh kurang dari ${stockTaken.allTaken}!`
        );
        return;
      }
      // if edit mode push idStock to update
      idStockToUpdate.value.push(e.id);
    }
    // update localstate
    stockChild.value = stockChild.value.map((rec) => {
      if (rec?.id == e.id) {
        return { id: e.id, ...e.value };
      }
      return rec;
    });
  }
  // remove stock
  else {
    // if edit mode, push to id stock to remove
    if (isEditMode.value) {
      // get and wait stock by id
      const stock = await getStockById(e);
      // prevent remove when stock has been taked
      if (stock?.isTaken) {
        alert('Barang sudah dimuat di kendaraan, tidak bisa dihapus!');
        return;
      }
      idStockToRemove.value.push(e);
    }
    // remove fromlocal state
    stockChild.value = stockChild.value.filter((rec) => rec?.id !== e);
  }
};

// message to show while process instert to database
const message = ref(null);

const handleSubmit = async () => {
  // prevent form to submitted twice
  if (message.value) return;
  // there is form is empty
  if (
    !date.value ||
    !shift.value ||
    !type.value ||
    !paper_id.value ||
    !diserahkan.value ||
    !diterima.value ||
    !stockChild.value
  ) {
    alert('Tidak boleh ada form yang kosong');
    return;
  }
  // update record
  if (isEditMode.value) {
    // call function
    await handleUpdateIncoming();
  } else {
    // call create function
    await handleCreateIncoming();
  }
  // close modal and send tunnel message true, it mean we are add new record or update a record
  closeModalOrDialog(true);

  // empty the value
  isEditMode.value = null;
};

const handleCreateIncoming = async () => {
  // create incoming transaction
  // first insert all stock
  const eachIdStock = [];
  for (const [index, stock] of stockChild.value.entries()) {
    // set message to show
    message.value = `Memasukkan produk ${index + 1} dari ${
      stockChild.value.length
    }`;
    // item: item.value,
    // kd_produksi: kd_produksi.value,
    // tanggal: ymdTime(product_created.value),
    // quantity: quantity.value
    const insertStock = await createStock(
      stock?.item_id,
      stock?.kd_produksi,
      stock?.product_created,
      stock?.quantity,
      date.value.getTime()
    );
    eachIdStock.push(insertStock.id);
  }
  // then insert incoming transction with child from insert all stock
  await createIncoming(
    eachIdStock,
    paper_id.value,
    date.value,
    Number(shift.value),
    diterima.value,
    type.value,
    diserahkan.value,
    null
  );
};

const handleUpdateIncoming = async () => {
  // create stock or update stock
  const insertedStock = [];
  for (const [index, stock] of stockChild.value.entries()) {
    // set message to show
    message.value = `Update produk ${index + 1} dari ${
      stockChild.value.length
    }`;
    // item: item.value,
    // kd_produksi: kd_produksi.value,
    // tanggal: ymdTime(product_created.value),
    // quantity: quantity.value
    // because we cant detect stock to create, we are using this way
    if (stock?.id && stock?.id.length < 4) {
      // insert to database
      const insertStock = await createStock(
        stock?.item_id,
        stock?.kd_produksi,
        stock?.product_created,
        stock?.quantity,
        date.value.getTime()
      );
      // push it
      insertedStock.push(insertStock.id);
      // set incoming stock parent
      await setStockParent(insertStock.id, isEditMode.value);
    }
    // stock to udpate
    else if (idStockToUpdate.value.includes(stock?.id)) {
      // update stock
      await updateStockById(stock?.id, {
        id: stock?.id,
        item_id: stock?.item_id,
        kd_produksi: stock?.kd_produksi,
        product_created: stock?.product_created,
        available_start: date.value.getTime()
      });
      // the update stock push too
      insertedStock.push(stock?.id);
      // update quantity master
      await updateQuantity(stock?.id, stock?.quantity);
    } else {
      // stock would stay
      insertedStock.push(stock?.id);
    }
  }
  // remove stock
  for (const id of idStockToRemove.value) {
    await removeStockById(id);
  }
  // update incoming transaction
  const record = {
    stock_master_ids: insertedStock,
    paper_id: paper_id.value,
    tanggal: ymdTime(date.value),
    shift: Number(shift.value),
    diterima: diterima.value,
    type: type.value,
    diserahkan: diserahkan.value,
  };
  // if there is child stock, delete the document
  if (insertedStock.length) {
    // update in db
    await updateIncomingById(isEditMode.value, record);
  }
  // remove incoming record from db
  else {
    await removeIncomingById(isEditMode.value);
  }
};

// will contain id of record that we will update it
const isEditMode = ref(null);

onMounted(async () => {
  isEditMode.value = store.state.form?.document;
  if (isEditMode.value) {
    // get record incoming
    const record = await getIncomingById(isEditMode.value);
    // set record master stock
    const childStocks = Object.values(record?.stock_master_ids);
    // stock_master_ids,
    for (const rec of childStocks) {
      const stock = await getStockByIdForIncomingForm(rec);
      stockChild.value.push(stock);
    }
    // set paper id value
    paper_id.value = record?.paper_id;
    // set date value
    date.value = new Date(record?.tanggal);
    // set shift value
    shift.value = Number(record?.shift);
    // set diterima value
    diterima.value = record?.diterima;
    // set type value
    type.value = record?.type;
    // set diserahkan value
    diserahkan.value = record?.diserahkan;
  }
});
</script>
