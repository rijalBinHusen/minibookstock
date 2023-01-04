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
              id="date-picker"
              class="input input-outline input-primary input-sm"
              v-model="date"
            ></date-picker>
          </div>
          <!-- end of date picker -->

          <!-- Shift -->
          <div class="form-control">
            <label for="shift" class="label">
              <span class="label-text">Shift</span>
            </label>
            <Select
            @selectedd="shift = $event"
              id="shift"
                :options="[
                    { shift: '1' },
                    { shift: '2' },
                    { shift: '3' },
                ]"
              value="shift"
              text="shift"
              size="primary small"
              :inSelect="shift"
            />
          </div>
          <!-- end of Shift -->

          <!-- Coming from -->
          <div class="form-control">
            <label for="type" class="label">
              <span class="label-text">Asal produk</span>
            </label>
            <Select
            @selectedd="type = $event"
              id="type"
              :options="Jurnal_produk_masuk"
              value="id"
              text="nama_jurnal"
              size="primary small"
              :inSelect="type"
            />
          </div>
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
          />
          <Input
            label="Yang menyerahkan"
            @send="diserahkan = $event"
            small
            placeholder="Yang menyerahkan"
            tipe="primary"
            :value="diserahkan"
          />
          <Input
            label="Penerima"
            small
            @send="diterima = $event"
            placeholder="Penerima"
            tipe="primary"
            :value="diterima"
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
        

        <div id="incoming_add_submit" class="w-full mt-4">
          <Button type="button" 
          @trig="handleSubmit" 
          primary 
          :value="isEditMode ? 'Update' : 'Submit'" 
          small
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Select from "../components/elements/Forms/Select.vue";
import Input from "../components/elements/Forms/Input.vue";
import Button from "../components/elements/Button.vue";
import PickItemVue from "../components/PickItem.vue";
import { ref, onMounted, computed } from "vue";
import { useJurnalProdukMasuk } from "../composables/Setting_JurnalId"
import { createIncoming, getIncomingById, updateIncomingById, removeIncomingById } from "../composables/Incoming"
import { closeModalOrDialog } from "../composables/launchForm"
import { useStore } from "vuex";
import { getItemByIdInState } from "../composables/MasterItems";
import { ddmmyyyy, ymdTime } from "../utils/dateFormat";
import { createStock, getStockById, updateStockById, removeStockById, getStockByIdForIncomingForm } from "../composables/StockMaster";
import { getTotalStockTaken } from "../composables/Output"
// vuex
const store = useStore()
// date record
const date = ref(new Date())
// shift record
const shift = ref(1)
// type incom product
const type = ref(null)
// paper id record
const paper_id = ref(null)
// handed by record
const diserahkan = ref(null)
// receiver product
const diterima = ref(null)
// master stock
const stockChild = ref([])
// current stock editing
const currentStockEdit=ref(null)

// use the composable jurnal produk masuk
const { gettingJurnalProdukMasukRecord, Jurnal_produk_masuk } = useJurnalProdukMasuk()

// what todo whe update form
const idStockToUpdate = ref([])
const idStockToRemove = ref([])
const idStockToCreate = ref([])

const stockChildDetails = computed(() => {
  if(!stockChild.value.length) {
    return []
  }
  return stockChild.value.map((stock) => ({
        id: stock?.id,
        item: getItemByIdInState(stock?.item_id).nm_item,
        quantity: stock?.quantity,
        product_created: ddmmyyyy(stock?.product_created, "-")
      })
    )
  }
)
// to add new item form
const handleStock = async (operation, e) => {
  // add stock
  if(operation == 'add') {
    // push to local state
    stockChild.value.push({
      id: stockChild.value.length +1 + "",
      ...e
    })
    // record id to idStock to create it
    if(isEditMode.value) {
      idStockToCreate.value.push(stockChild.value.length +1 + "")
    }
  } 
  // edit stock
  else if(operation == 'edit') {
    // set current stock edit
    currentStockEdit.value = stockChild.value.find((rec) => rec?.id == e)
  } 
  // update stock
  else if(operation == 'update') {
    console.log(e.value)
    // total quantity taken
    const stockTaken = await getTotalStockTaken(e.id)
    // prevent update stock when quantity < total taken
    if(Number(e.value.quantity) < Number(stockTaken.allTaken)) {
      // show message
      alert(`Stock sudah terambil ${stockTaken.allTaken}, quantity tidak boleh kurang dari ${stockTaken.allTaken}!`)
      return;
    }
    // update localstate
    stockChild.value = stockChild.value.map((rec) => {
      if(rec?.id == e.id) {
        if(isEditMode.value) {
          return { id: e.id, ...e.value }
        }
        return e.value
      }
      return rec
    })
    // set current edit stock to null
    currentStockEdit.value = null
    // if edit mode push idStock to update
    if(isEditMode.value) {
      idStockToUpdate.value.push(e.id)
    }
  }
  // remove stock
   else {
    // get and wait stock by id
    const stock = await getStockById(e)
    // prevent remove when stock has been taked
    if(stock?.isTaken) {
      alert("Barang sudah dimuat di kendaraan, tidak bisa dihapus!")
      return;
    }
    // remove fromlocal state
    stockChild.value = stockChild.value.filter((rec) => rec?.id !== e)
    // if edit mode, push to id stock to remove
    if(isEditMode.value) {
      idStockToRemove.value.push(e)
    }
  }
}

const handleSubmit = async () => {
  if(date.value && shift.value && type.value && paper_id.value && diserahkan.value && diterima.value && stockChild.value) {
    // update record
    if(isEditMode.value) {
      // create stock or update stock
      const insertedStock = []
      for (const stock of stockChild.value) {
        // item: item.value, 
        // kd_produksi: kd_produksi.value, 
        // tanggal: ymdTime(product_created.value), 
        // quantity: quantity.value
        // because we cant detect stock to create, we are using this way
        if(stock?.id && stock?.id.length < 4) {
          const insertStock = await createStock(stock?.item_id, stock?.kd_produksi, stock?.product_created, stock?.quantity)
          insertedStock.push(insertStock.id)
        } 
        // stock to udpate
        else if (idStockToUpdate.value.includes(stock?.id)) {
          // update stock
          await updateStockById(stock?.id, {
            id: stock?.id,
            item_id: stock?.item_id, 
            kd_produksi: stock?.kd_produksi, 
            product_created: stock?.product_created, 
            quantity: Number(stock?.quantity)
          })
          // the update stock push too
          insertedStock.push(stock?.id)
        } else {
          // stocok would stay
          insertedStock.push(stock?.id)
        }
      }
      // remove stock
      for(const id of idStockToRemove.value) {
        await removeStockById(id)
      }
      // update incoming transaction
      const record = {
        stock_master_ids: insertedStock,
        paper_id: paper_id.value,
        tanggal: ymdTime(date.value),
        shift: shift.value,
        diterima: diterima.value,
        type: type.value,
        diserahkan: diserahkan.value
      }
      // if there is child stock, delete the document
      if(insertedStock.length) {
        // update in db
        await updateIncomingById(isEditMode.value, record)
      } else {
        // remove incoming record from db
        await removeIncomingById(isEditMode.value)
      }
    } else {
      // create incoming transaction
      // first insert all stock
      const insertedStock = await new Promise( async (resolve) => {
        const eachIdStock = []
        for (const stock of stockChild.value) {
          // item: item.value, 
          // kd_produksi: kd_produksi.value, 
          // tanggal: ymdTime(product_created.value), 
          // quantity: quantity.value
          const insertStock = await createStock(stock?.item_id, stock?.kd_produksi, stock?.product_created, stock?.quantity)
          eachIdStock.push(insertStock.id)
        }
        resolve(eachIdStock)
      })
      // then insert incoming transction with child from insert all stock
      await createIncoming(insertedStock, paper_id.value, date.value, shift.value, diterima.value, type.value, diserahkan.value, null)
    }
    // close modal and send tunnel message true, it mean we are add new record or update a record
    closeModalOrDialog(true)
  } else {
    alert("Tidak boleh ada form yang kosong")
  }
  // empty the value
      isEditMode.value = null
}

// will contain id of record that we will update it
const isEditMode = ref(null)


onMounted( async () => {
  await gettingJurnalProdukMasukRecord()
  isEditMode.value = store.state.form?.document
  if(isEditMode.value) {
    // get record incoming
    const record = await getIncomingById(isEditMode.value)
    // set record master stock 
    const childStocks = Object.values(record?.stock_master_ids)
    // stock_master_ids,
    for(const rec of childStocks) {
      const stock = await getStockByIdForIncomingForm(rec)
      stockChild.value.push(stock)
    }
    // set paper id value
    paper_id.value = record?.paper_id
    // set date value
    date.value = new Date(record?.tanggal)
    // set shift value
    shift.value = record?.shift
    // set diterima value
    diterima.value = record?.diterima
    // set type value
    type.value = record?.type
    // set diserahkan value
    diserahkan.value = record?.diserahkan
  }
})

</script>
