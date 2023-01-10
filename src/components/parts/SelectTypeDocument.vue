<template>
    <div class="form-control">
        <label for="type" class="label">
            <span class="label-text">Type {{ jurnal == 'keluar' ? 'output' : 'masuk'}}</span>
        </label>
        <Select
        @selectedd="handleSelect($event)"
            id="type"
            :options="options"
            value="id"
            text="nama_jurnal"
            size="primary small"
            :inSelect="inSelect"
        />
    </div>
</template>

<script setup>
import Select from '../elements/Forms/Select.vue';
import { useJurnalProdukKeluar, useJurnalProdukMasuk } from "../../composables/Setting_JurnalId"
// use the composable jurnal produk masuk
import { defineEmits, ref, computed, onMounted } from 'vue';
const { gettingJurnalProdukKeluarRecord, Jurnal_produk_keluar } = useJurnalProdukKeluar();
const { gettingJurnalProdukMasukRecord, Jurnal_produk_masuk } = useJurnalProdukMasuk();

const emit = defineEmits(['selectedType'])
const props = defineProps({
    typeJurnal: String,
    jurnal: {
        type: String,
        required: true,
    }
})

const currentSelect = ref(null)

const options = computed(() => props.jurnal === 'keluar' ? Jurnal_produk_keluar.value : Jurnal_produk_masuk.value)

const inSelect = computed(() => props.typeJurnal || currentSelect.value)

const handleSelect = (type) => {
    // change state
    currentSelect.value = type
    // emit to parent
    emit('selectedType', type)
}

onMounted( async () => {
    // if props jurnal keluar
    if(props.jurnal === 'keluar') {
        await gettingJurnalProdukKeluarRecord()
    } else {
        await gettingJurnalProdukMasukRecord()
    }
    // else
})

// todo, build select type document compoentn
</script>
