<template>
    <form
      @submit.prevent="handleSubmit"
      id="form_item"
    >
      <!-- kode item -->
      <InputVue
        @send="itemForm.kd_item = $event"
        placeholder="Kode item"
        :value="itemForm.kd_item"
        tipe="primary"
        small
        id="kd_item"
        label="Kode item"
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
        label="Nama item"
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
        label="Umur item"
        type="number"
      />
      <!-- End of umur item -->

      <!-- Nomor urut item -->
      <InputVue
        @send="itemForm.sort_item = $event"
        placeholder="Urutan item"
        :value="itemForm.sort_item"
        tipe="primary"
        small
        id="sort_item"
        label="Nomor urut item dibuku stock"
        type="number"
        class="mb-4"
      />

      <Button
        primary
        :value="idItem ? 'Update' : 'Tambah'"
        type="button"
        small
        id="submit-master-item"
      />

      <Button
        v-if="!idItem"
        secondary
        value="Cancel"
        type="button"
        small
        class="ml-2"
        @trig="resetForm"
      />

      <p>{{ errorMessage }}</p>
    </form>
</template>

<script setup lang="ts">
    
    import InputVue from '@/components/elements/Forms/Input.vue';
    import Button from '@/components/elements/Button.vue';
    import { Item, } from "./MasterItems";
    import { PropType, computed, onMounted, ref } from 'vue';

    const props = defineProps({

        itemFormProps: {
            type: Object as PropType<Item>,
            required: true
        },
        errorMessage: String
    })

    const emits = defineEmits<{
      (e: 'addItem', stock: Item): void
      (e: 'updateItem', stock: Item): void
      (e: 'cancel'): void
    }>()

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
        if (idItem.value) emits("updateItem", itemForm.value);

        // insert item
        else emits("addItem", itemForm.value)
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
    };

    onMounted(() => {
        itemForm.value = props.itemFormProps
    })

</script>