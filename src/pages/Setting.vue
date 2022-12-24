<template>
  <div class="border-r-2 p-6 min-h-full flex gap-2">
    <!-- <component :is="activeComponent"></component> -->
    <ListGroup />
    <div class="bg-base-200 w-6/12 p-2">
    <p class="text-3xl text-center">Import Data</p>
    <Select 
      value="id"
      text="title"
      id="data_to_import"
      :options="listImportData"
      size="small"
      class="w-56"
      @selectedd="selectedImportType = $event"
    />
      <Input 
        v-if="labelImport"
        type="file"
        tipe="primary"
        accept=".js"
        :label="labelImport"
        button="Import"
        ref="importerField"
      />
        <!-- @change="impor($event)" -->
  </div>
  </div>
</template>

<script setup>
import ListGroup from "../components/parts/ListGroup.vue";
// import Importer from "../components/parts/Importer.vue";
import Input from "../components/elements/Forms/Input.vue";
import Select from "../components/elements/Forms/Select.vue";
import { computed, ref } from "vue";

const listImportData = [
          { id: null, title: 'Pilih data untuk diimport'},
          { id: 'database', title: 'Database'}, 
          { id: 'salesOrder', title: 'Outstanding SO'}
        ]

const selectedImportType = ref(null)

// the label that would show in input type file
const labelImport = computed(() => {
  console.log(selectedImportType.value)
  // if the selected import just selected
  if(selectedImportType.value) {
    // find the id of selected import
    const findList = listImportData.find((list) => list.id === selectedImportType.value)
    // return label
    return 'Import '+ findList.title
  }
})

</script>