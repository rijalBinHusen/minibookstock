<template>
    <form
      @submit.prevent="handleSubmit"
      id="form_item"
      class="flex items-center justify-center"
    >
      <!-- kode item -->
      <InputVue
        @send="itemForm.kd_item = $event"
        placeholder="Kode item"
        :value="itemForm.kd_item"
        tipe="primary"
        small
        id="kd_item"
      />
      <!-- End of kode item -->

      <!-- Nama item -->
      <InputVue
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
      <InputVue
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
      <InputVue
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
</template>

<script setup lang="ts">
    
    import InputVue from '@/components/elements/Forms/Input.vue';
    import Button from '@/components/elements/Button.vue';
    import { Item, Items } from "./MasterItems";
    import { PropType, computed, onMounted, ref } from 'vue';
    import { subscribeConfirmDialog } from '../../utils/launchForm';

    const props = defineProps({

        itemFormProps: {
            type: Object as PropType<Item>,
            required: true
        }
    })

    const { updateItemById, createItem } = Items();
    const isEditMode = ref("");
    const itemForm = ref<Item>({
        age_item: 0,
        division: "",
        id: "",
        kd_item: "",
        last_used: 0,
        nm_item: "",
        sort_item: 0
    });

    const idItem = computed(() => itemForm.value.id)

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

    onMounted(() => {
        itemForm.value = props.itemFormProps
    })

</script>