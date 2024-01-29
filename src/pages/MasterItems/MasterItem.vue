<template>
  <div class="grid mx-2 gap-2">

    <Button
        accent
        value="Tambah item"
        type="button"
        small
        class="ml-2 w-1/6"
        @trig="isActiveModal = true"
      />
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

    <Modal v-if="isActiveModal" @closeModal="cancelForm">
      
      <MasterItemForm
        :itemFormProps="itemForm"
        @addItem="addItem"
        @updateItem="updateItem"
        @cancel="cancelForm"
        :errorMessage="errorMessage"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/elements/Button.vue';
import Datatable from '@/components/parts/Datatable.vue';
import { Items, Master_items, Item } from './MasterItems';
import { ref, onMounted } from 'vue';
import Modal from '../../components/parts/Modal.vue';
import MasterItemForm from './MasterItemForm.vue';


// the origin value
const itemForm = ref(<Item>{});
const isActiveModal = ref(false);
const errorMessage = ref("");

const { getItemById, getAllMasterItems, createItem, updateItemById } = Items();

const handleButton = async (id?: string) => {
    
  // fill the form
  const getItem = await getItemById(id);
  itemForm.value = getItem;
};

function cancelForm () {

  isActiveModal.value = false;

  itemForm.value = {
      age_item: 0,
      division: "",
      id: "",
      kd_item: "",
      last_used: 0,
      nm_item: "",
      sort_item: 0
    };
  
  errorMessage.value = "";
}

async function addItem(item: Item) {
  
  const isCreated = await createItem(item.kd_item, item.nm_item, item.division, 0, item.age_item, item.sort_item);

  const isFailedToCreate = isCreated !== false && isCreated.length > 14;
  if(isFailedToCreate) errorMessage.value = isCreated
  else cancelForm()
  console.log("lsdkfj")
}

async function updateItem(item: Item) {
  
  const isUpdated = await updateItemById(item.id, item);

  if(isUpdated === true) cancelForm();
  else errorMessage.value = isUpdated + "";
}

onMounted(async () => {
  await getAllMasterItems();
});
</script>
