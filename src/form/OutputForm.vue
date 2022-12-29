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
              <span class="label-text">Type output</span>
            </label>
            <Select
            @selectedd="type = $event"
              id="type"
              :options="Jurnal_produk_keluar"
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
            label="Nomor sales order"
            @send="nomor_so = $event"
            small
            placeholder="Nomor sales order"
            tipe="primary"
            :value="nomor_so"
          />
          <!-- <Input
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
          /> -->
        </div>

        <!-- Item picker -->
         <PickItemToOutputVue 
            :isParentEditMode="isEditMode" 
            :stockChild="stockChildDetails" 
            @addStock="handleStock('add', $event)"
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
import PickItemToOutputVue from "../components/PickItemToOutput.vue";
import { ref, onMounted, computed } from "vue";
import { useJurnalProdukKeluar } from "../composables/Setting_JurnalId"
import { closeModalOrDialog } from "../composables/launchForm"
import { useStore } from "vuex";
import { getItemById } from "../composables/MasterItems";
import { ddmmyyyy } from "../utils/dateFormat";
import { createStock, getStockById, setStockParent, updateStockById, removeStockById, changeAvaliableStock } from "../composables/StockMaster";
import { createOutput } from "../composables/Output"
// vuex
const store = useStore()
// date record
const date = ref(new Date())
// shift record
const shift = ref(1)
// type incom product
const type = ref(null)
// paper id record
const nomor_so = ref(null)
// master stock
const stockChild = ref([])
// current stock editing
const currentStockEdit=ref(null)

// use the composable jurnal produk masuk
const { gettingJurnalProdukKeluarRecord, Jurnal_produk_keluar } = useJurnalProdukKeluar()

const stockChildDetails = computed(() => stockChild.value.map((stock) => {
      const getStockMaster = getStockById(stock?.stock_master_id)
      const getItem = getItemById(getStockMaster?.item_id)
      return {
        id: stock?.id,
        item: getItem.nm_item,
        quantity: stock?.quantity,
        product_created: ddmmyyyy(getStockMaster.product_created, "-")
      }
    }
  )
)
// to add new item form
const handleStock = (operation, e) => {
  //  data from child = { stock_master_id, quantity }
  if(operation == 'add') {
    stockChild.value.push({
      id: stockChild.value.length +1 + "",
      ...e
    })
  }  else {
    stockChild.value = stockChild.value.filter((rec) => rec?.id !== e)
  }
}

const handleSubmit = async () => {
  // stock child value = data from child = { stock_master_id, quantity }
  if(date.value && shift.value && type.value && nomor_so.value && stockChild.value) {
      // then insert incoming transction with child from insert all stock
      for (const stock of stockChild.value) {
        createOutput(date.value, type.value, shift.value, nomor_so.value, stock?.stock_master_id, stock?.quantity )
      }
      
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
  await gettingJurnalProdukKeluarRecord()
})

</script>
