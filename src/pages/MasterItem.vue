<template>
  <div class="grid mx-2 gap-2">
    <form
      @submit.prevent="handleSubmit"
      id="form_item"
      class="flex items-center justify-center"
    >
      <!-- kode item -->
      <Input
        @send="kd_item = $event"
        placeholder="Kode item"
        :value="kd_item"
        tipe="primary"
        small
        id="kd_item"
      />
      <!-- End of kode item -->

      <!-- Nama item -->
      <Input
        @send="nm_item = $event"
        placeholder="Nama item"
        :value="nm_item"
        tipe="primary"
        small
        id="nm_item"
        class="ml-2"
      />
      <!--End of  Nama item -->

      <!-- umur item -->
      <Input
        @send="age_item = $event"
        placeholder="Umur produk"
        :value="age_item"
        tipe="primary"
        small
        id="age_item"
        class="ml-2"
      />
      <!-- End of umur item -->

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
      :heads="['Kode item', 'Nama item', 'umur']"
      :keys="['kd_item', 'nm_item', 'age_item']"
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

<script setup>
import Button from '../components/elements/Button.vue';
import Input from '../components/elements/Forms/Input.vue';
import Datatable from '../components/parts/Datatable.vue';
import {
  createItem,
  Master_items,
  gettingStartedRecord,
  getItemById,
  updateItemById,
} from '../composables/MasterItems';
import { ref, onMounted, watch } from 'vue';
import { subscribeConfirmDialog } from '../utils/launchForm';

const nm_item = ref(null);
const kd_item = ref(null);
const age_item = ref(null);
const isEditMode = ref(false);
// the origin value
const origin = ref({});

const emit = defineEmits(['formSubmit']);

// to create item
// if the form empty
const handleSubmit = async () => {
  if (!nm_item.value || !kd_item.value || !age_item.value) {
    subscribeConfirmDialog('alert', 'Tidak boleh ada form yang kosong');
    return;
  }
  // we're doing this to make easy for unti testing
  // emit('formSubmit', {
  //   kd_item: kd_item.value,
  //   nm_item: nm_item.value,
  //   age_item: age_item.value,
  // });
  // update item
  // to update item
  if (isEditMode.value) {
    await updateItemById(isEditMode.value, kd_item.value, nm_item.value, false, false, age_item.value);
  }
  // insert item
  else {
    // setItem('items', nm_item.value)
    await createItem(
      kd_item.value,
      nm_item.value,
      null,
      new Date().getTime(),
      age_item.value
    );
  }
  // reset the form
  resetForm();
};

// to edit item
const handleButton = async (id) => {
  if (id && id !== isEditMode.value) {
    // get item by id from db
    origin.value = await getItemById(id);
    // fill the form
    nm_item.value = origin.value?.nm_item;
    kd_item.value = origin.value?.kd_item;
    age_item.value = origin.value?.age_item;
    // set edit mode as true
    setTimeout(() => (isEditMode.value = id), 300);
  } else {
    resetForm();
  }
};

const resetForm = () => {
  // reset the form
  nm_item.value = null;
  kd_item.value = null;
  age_item.value = null;
  // set edit mode to false
  isEditMode.value = false;
};

onMounted(async () => {
  await gettingStartedRecord();
});
</script>
