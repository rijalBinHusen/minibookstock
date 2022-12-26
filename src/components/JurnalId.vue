<template>
  <div
    class="rounded md:w-6/12 md:max-h-screen overflow-auto p-2 bg-base-200"
  >
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
    <h1 class="text-2xl mb-2 text-center">Daftar {{  activeJurnalToInput }} Jurnal </h1>
    <!-- The form -->
    <form v-if="activeJurnalToInput" @submit.prevent="handleSubmit" class="mb-2">
      <Input
        label="Nama jurnal"
        tipe="primary"
        placeholder="Masukkan nama jurnal"
        @send="newJurnal = $event"
        button="Tambah"
        :value="newJurnal"
      />
    </form>
    <!-- <Table
      v-if="lists && lists.length > 0"
      :contents="lists"
      :options="['edit']"
      keyData="id"
      @edit="edit($event)"
      :thead="['id', 'Nama group']"
      :tbody="['id', 'name_group']"
      v-slot:default="slotProps"
    >
      <Button
        :secondary="slotProps.prop.status == false"
        :primary="slotProps.prop.status == true"
        :value="slotProps.prop.status === true ? 'Enabled' : 'Disabled'"
        type="button"
        small
        class="ml-2"
        :datanya="slotProps.prop.id"
        @trig="send($event)"
      />
    </Table> -->
  </div>
</template>

<script setup>
import Input from "@/components/elements/Forms/Input.vue";
import Table from "@/components/elements/Table.vue";
import Select from "@/components/elements/Forms/Select.vue";
import Button from "@/components/elements/Button.vue";
import { createJurnalProdukMasuk } from "../composables/Setting_JurnalId";
import { ref, watch } from "vue";

const listJurnalType = [
  { id: null, title: 'Pilih jurnal untuk diinput'},
  { id: 'incoming', title: 'Jurnal produk masuk'},
  { id: 'output', title: 'Jurnal produk keluar'},
]

// variable for model
const newJurnal = ref(null)

// value when triggered
const activeJurnalToInput = ref(null)
const titleJurnal = ref(null)

// handle submit
const handleSubmit = async () => {
  // if incoming jurnal selected
  if(activeJurnalToInput.value == 'incoming') {
    // send to database
    await createJurnalProdukMasuk(newJurnal.value)
    // reset form
    newJurnal.value = null
  }
}

watch([activeJurnalToInput], (newVal) => {
  listJurnalType.forEach((val) => {
    if(val?.id === newVal[0]) {
      titleJurnal.value = val?.title
      return
    }
  })

})

</script>
