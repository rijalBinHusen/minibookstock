<template>
  <div
    class="rounded md:w-6/12 md:max-h-screen overflow-auto p-2 bg-base-200"
  >
  <!-- title -->
  <p v-if="!titleJurnal" class="text-3xl text-center">Tambah atau edit jurnal</p>
    <!-- Select type jurnal -->
    <Select 
      value="id"
      text="title"
      id="data_to_import"
      :options="listJurnalType"
      size="small"
      class="w-56"
      @selectedd="activeJurnalToInput = $event"
    />
    <!-- Type jurnal -->
    <h1 class="text-2xl mb-2 text-center mt-11 ">Daftar {{  titleJurnal }}</h1>
    <!-- The form -->
    <form v-if="activeJurnalToInput" @submit.prevent="handleSubmit" class="mb-2">
      <Input
        label="Nama jurnal"
        tipe="primary"
        placeholder="Masukkan nama jurnal"
        @send="newJurnal = $event"
        :button="isEditMode ? 'Update' : 'Tambah'"
        :value="newJurnal"
      />
    </form>
    <!-- Datatable -->
    <Table
      v-if="renderTable"
      :contents="lists"
      :options="['edit']"
      keyData="id"
      @edit="handleButton($event)"
      :thead="['Nama jurnal']"
      :tbody="['nama_jurnal']"
    >
    </Table>
  </div>
</template>

<script setup>
import Input from "@/components/elements/Forms/Input.vue";
import Table from "@/components/elements/Table.vue";
import Select from "@/components/elements/Forms/Select.vue";
// Import function of jurnal produk masuk
import { useJurnalProdukMasuk, useJurnalProdukKeluar } from "./Setting_JurnalId";
import { ref, watch, computed } from "vue";

const listJurnalType = [
  { id: 'incoming', title: 'Jurnal produk masuk'},
  { id: 'output', title: 'Jurnal produk keluar'},
]

// use the composaable
const { gettingJurnalProdukMasukRecord, createJurnalProdukMasuk, Jurnal_produk_masuk, getJurnalProdukMasukById, updateJurnalProdukMasukById } = useJurnalProdukMasuk()
const { gettingJurnalProdukKeluarRecord, createJurnalProdukKeluar, Jurnal_produk_keluar, getJurnalProdukKeluarById, updateJurnalProdukKeluarById } = useJurnalProdukKeluar()

// variable for model
const newJurnal = ref(null)
// value when triggered
const activeJurnalToInput = ref(null)
const titleJurnal = ref(null)
// variable for table condition, render or not
const renderTable = ref(false)
// variable that contain lists of jurnal
const lists = computed(() => {
  // return the state
  if(activeJurnalToInput.value == 'incoming') {
    return Jurnal_produk_masuk.value
  } else {
    return Jurnal_produk_keluar.value
  }
})
// varable that contain id that we're gonna update the information
const isEditMode = ref(null)

// handle submit
const handleSubmit = async () => {
  // if incoming jurnal selected
  if(isEditMode.value){
    if(activeJurnalToInput.value == 'incoming' && newJurnal.value) {
      // if edit mode
      await updateJurnalProdukMasukById(isEditMode.value, {nama_jurnal: newJurnal.value})
    } else {
      // jika jurnal produk keluar
      await updateJurnalProdukKeluarById(isEditMode.value, {nama_jurnal: newJurnal.value})
    }
  } 
    // if create new jurnal
  else {
    // jika jurnal produk masuk
    if(activeJurnalToInput.value == 'incoming' && newJurnal.value) {
      // send to database
      await createJurnalProdukMasuk(newJurnal.value)
    } else {
      // jika jurnal produk keluar
      await createJurnalProdukKeluar(newJurnal.value)
    }
  }
  // reset form
  newJurnal.value = null
  isEditMode.value = null
  }

// handle when button in datatable triggered
const handleButton = async (id) => {
  let rec;
  if(activeJurnalToInput.value === 'incoming') {
    rec = await getJurnalProdukMasukById(id)
  } else {
    rec = await getJurnalProdukKeluarById(id)
  }
  newJurnal.value = rec?.nama_jurnal
  isEditMode.value = id
}

// function to renew

watch([activeJurnalToInput], async (newVal) => {
  // getJurnal
  if(newVal[0] === 'incoming') {
    await gettingJurnalProdukMasukRecord()
  } else {
    await gettingJurnalProdukKeluarRecord()
  }
  // set the title
  listJurnalType.forEach((val) => {
    if(val?.id === newVal[0]) {
      titleJurnal.value = val?.title
      return
    }
  })
  // enable datatable
  renderTable.value = true
})

</script>
../pages/Settings/Setting_JurnalId