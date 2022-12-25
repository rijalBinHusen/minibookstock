<template>
  <div class="grid mx-2 gap-2">
        <span class="flex items-center justify-center">
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
                value="Tambah"
                type="button"
                small
                class="ml-2"
                @trig="handleSubmit"
            />
        </span>
    </div>
</template>

<script setup>
import Table from "../components/elements/Table.vue";
import Dropdown from "../components/elements/Dropdown.vue";
import Button from "../components/elements/Button.vue";
import Input from "../components/elements/Forms/Input.vue";
// import { createItem } from "../composables/MasterItems"
import { ref } from "vue";

const nm_item = ref(null)
const kd_item = ref(null)

// to create item
const handleSubmit = async () => {
    if(nm_item.value && kd_item.value) {
      // update item
      // if(isEditMode.value) {
        // await updateVehicleById(isEditMode.value, changedValue.value)
      // }
      // insert item
      // else {
        // await createItem(kd_item.value, nm_item.value, null, new Date().getTime())
        // await createVehicle(noDO.value, noSO.value, platNomor.value, customer.value, register.value, false, false)
      // }
    }
  }

// to edit item

// to update item

// to set item sorting

</script>