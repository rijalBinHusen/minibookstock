<template>
  <div class="grid mx-2 gap-2">
      <form @submit.prevent="handleSubmit" id="form_item" class="flex items-center justify-center">
        <Input
            @send="kd_item = $event"
            placeholder="Kode item"
            :value="kd_item"
            tipe="primary"
            small
          />
          <Input
            @send="nm_item = $event"
            placeholder="Nama item"
            :value="nm_item"
            tipe="primary"
            small
            class="ml-2"
          />
          <Button
              primary
              :value="isEditMode ? 'Update' : 'Tambah'"
              type="button"
              small
              class="ml-2"
          />

          <Button
              v-if="isEditMode"
              secondary
              value="Cancel"
              type="button"
              small
              class="ml-2"
              @trig="handleButton"
          />
      </form>

      <!-- databale -->
      <datatable
            :heads="['Kode item', 'Nama item']"
            :keys="['kd_item', 'nm_item']"
            :datanya="Master_items"
            keydata="id"
            no
            id="table-vehicle"
            option
            v-slot:default="slotProps"
        >
        
          <Button
              accent
              value="Edit"
              type="button"
              small
              class="ml-2"
              :datanya="slotProps.prop.id"
              @trig="handleButton($event)"
            />

        </datatable>
    </div>
</template>

<script setup>
import Table from "../components/elements/Table.vue";
import Dropdown from "../components/elements/Dropdown.vue";
import Button from "../components/elements/Button.vue";
import Input from "../components/elements/Forms/Input.vue";
import { createItem, Master_items, gettingStartedRecord, getItemById, updateItemById } from "../composables/MasterItems"
import Datatable from "../components/parts/Datatable.vue";
import { ref, onMounted, watch } from "vue";

const nm_item = ref(null)
const kd_item = ref(null)
const isEditMode = ref(false)
// the origin value
const origin = ref({})
// value that changed
const changed = ref({})

// to create item
const handleSubmit = async () => {
    if(nm_item.value && kd_item.value) {
      // update item
      // to update item
      if(isEditMode.value) {
        await updateItemById(isEditMode.value, changed.value);
      }
      // insert item
      else {
        // setItem('items', nm_item.value)
        await createItem(kd_item.value, nm_item.value, null, new Date().getTime())
      }
      // reset the form
        resetForm()
    }
  }

// to edit item
const handleButton = async (id) => {
  if(id) {
    // get item by id from db
    origin.value = await getItemById(id)
    // fill the form
    nm_item.value = origin.value?.nm_item;
    kd_item.value = origin.value?.kd_item;
    // set changed value to null
    changed.value = {};

    console.log(origin.value?.nm_item)
    
    // set edit mode as true
    setTimeout(() =>  isEditMode.value = id, 600 )
    return;
  } 
  resetForm()
}

const resetForm = () => {
    // reset the form
    const form = document.getElementById("form_item");
    form.reset()
    // set edit mode to false
    isEditMode.value = false
    // set canged to null
    changed.value = {}
}

watch([nm_item, kd_item], (newVal) => {
  // if edit modde not null
  if(isEditMode.value) {
    // set nm_item
    if(newVal[0] !== origin.value?.nm_item) {
      changed.value = { ...changed.value, nm_item: newVal[0]}
    }
    // set kd_item
    if(newVal[1] !== origin.value?.kd_item) {
      changed.value = { ...changed.value, kd_item: newVal[1]}
    }
  }
})

onMounted(() => {
  gettingStartedRecord()
})

</script>