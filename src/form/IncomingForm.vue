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
              :upper-limit="new Date()"
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
            :currentStockEdit="currentStockEdit"
            @editStock="handleStock('edit', $event)"
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
import { gettingStartedRecord as getJurnalMasuk, Jurnal_produk_masuk } from "../composables/Setting_JurnalId"
import { createIncoming, getIncomingById, updateIncomingById } from "../composables/Incoming"
import { closeModalOrDialog } from "../composables/launchForm"
import { useStore } from "vuex";
import { getItemById } from "../composables/MasterItems";
import { ddmmyyyy } from "../utils/dateFormat";
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

const stockChildDetails = computed(() => stockChild.value.map((stock) => ({
      id: stock?.id,
      item: getItemById(stock?.item).nm_item,
      quantity: stock?.quantity,
      product_created: ddmmyyyy(stock?.tanggal, "-")
    })
  )
)
// to add new item form
const handleStock = (operation, e) => {
  if(operation == 'add') {
    stockChild.value.push({
      id: stockChild.value.length +1 + "",
      ...e
    })
  } else if(operation == 'edit') {
    currentStockEdit.value = stockChild.value.find((rec) => rec?.id == e)
  } else if(operation == 'update') {
    stockChild.value = stockChild.value.map((rec) => {
      if(rec?.id == e.id) {
        return e.value
      }
      return rec
    })
    currentStockEdit.value = null

  }
}

const handleSubmit = () => {
  if(date.value && shift.value && type.value && paper_id.value && diserahkan.value && diterima.value && stockChild.value) {
    // update record
    if(isEditMode.value) {
      const record = {
        stock_master_ids: stockChild.value,
        paper_id: paper_id.value,
        tanggal: date.value,
        shift: shift.value,
        diterima: diterima.value,
        type: type.value,
        diserahkan: diserahkan.value
      }
      updateIncomingById(isEditMode.value, record)
    } else {
      // create incoming transaction
      createIncoming(stockChild.value, paper_id.value, date.value, shift.value, diterima.value, type.value, diserahkan.value, null)
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
  await getJurnalMasuk()
  isEditMode.value = store.state.form?.document
  if(isEditMode.value) {
    // get record incoming
    const record = getIncomingById(isEditMode.value)
    // set record master stock 
    stockChild.value = Object.values(record?.stock_master_ids)
    // stock_master_ids,
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
