<template>
  <div class="grid mx-2 gap-2">
    <form
      @submit.prevent="handleSubmit"
      id="form_item"
      class="flex items-center justify-center"
    >
      <!-- kode item -->
      <Input
        @send="itemForm.kd_item = $event"
        placeholder="Kode item"
        :value="itemForm.kd_item"
        tipe="primary"
        small
        id="kd_item"
      />
      <!-- End of kode item -->

      <!-- Nama item -->
      <Input
        @send="itemForm.nm_item = $event"
        placeholder="Nama item"
        :value="itemForm.nm_item"
        tipe="primary"
        small
        id="nm_item"
        class="ml-2"
      />
      <!--End of  Nama item -->

      <!-- umur item -->
      <Input
        @send="itemForm.age_item = $event"
        placeholder="Umur produk"
        :value="itemForm.age_item"
        tipe="primary"
        small
        id="age_item"
        class="ml-2"
      />
      <!-- End of umur item -->

      <!-- umur item -->
      <Input
        @send="itemForm.sort_item = $event"
        placeholder="Urutan item"
        :value="itemForm.sort_item"
        tipe="primary"
        small
        id="sort_item"
        class="ml-2"
      />

      <Button
        primary
        :value="isEditMode ? 'Update' : 'Tambah'"
        type="button"
        small
        class="ml-2"
        id="submit-master-item"
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
import Input from '@/components/elements/Forms/Input.vue';
import Datatable from '@/components/parts/Datatable.vue';
import { Items, Item, Master_items } from './MasterItems';
import { ref, onMounted } from 'vue';
import { subscribeConfirmDialog } from '../../utils/launchForm';

const itemForm = ref<Item>({
  age_item: 0,
  division: "",
  id: "",
  kd_item: "",
  last_used: 0,
  nm_item: "",
  sort_item: 0
});

// the origin value
const origin = ref({});
const isEditMode = ref("");
const emit = defineEmits(['formSubmit']);

const { updateItemById, createItem, getItemById, getAllMasterItems } = Items();

const handleSubmit = async () => {

  // to update item
  if (isEditMode.value) await updateItemById(itemForm.value.id, itemForm.value);
  
  // insert item
  else {
    
    const isCreateItem = await createItem(itemForm.value.kd_item, itemForm.value.nm_item, "", 0, itemForm.value.age_item, itemForm.value.sort_item);
    subscribeConfirmDialog("alert", isCreateItem);
  }
  
  // reset the form
  resetForm();
};

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

const resetForm = () => {
  // reset the form
  itemForm.value = {
    age_item: 0,
    division: "",
    id: "",
    kd_item: "",
    last_used: 0,
    nm_item: "",
    sort_item: 0
  }
  // set edit mode to false
  isEditMode.value = "";
};

onMounted(async () => {
  await getAllMasterItems();
});
</script>
