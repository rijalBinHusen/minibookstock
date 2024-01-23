<template>
  <div class="grid mx-2 gap-2">
    <!-- databale -->
    <datatable
      v-if="Master_items.length"
      :heads="['Kode item', 'Nama item', 'umur', 'Nomor urut']"
      :keys="['kd_item', 'nm_item', 'age_item', 'sort_item']"
      :datanya="Master_items"
      keydata="id"
      no
      id="table-master-item"
      option
      v-slot:default="slotProps"
    >
      <Button
        accent
        value="Edit"
        type="button"
        small
        :id="'btn-edit-row-'+slotProps.prop.row"
        class="ml-2"
        :datanya="slotProps.prop.id"
        @trig="handleButton($event)"
      />
    </datatable>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/elements/Button.vue';
import Datatable from '@/components/parts/Datatable.vue';
import { Items, Master_items } from './MasterItems';
import { ref, onMounted } from 'vue';


// the origin value
const origin = ref({});
const emit = defineEmits(['formSubmit']);

const { getItemById, getAllMasterItems } = Items();

// to edit item
const handleButton = async (id: string) => {
  if (id && id !== isEditMode.value) {
    // get item by id from db
    const getItem = await getItemById(id);

    // fill the form
    itemForm.value = getItem;

    // set edit mode as true
    setTimeout(() => (isEditMode.value = id), 300);
  } 
  
  else {
    resetForm();
  }
};

onMounted(async () => {
  await getAllMasterItems();
});
</script>
