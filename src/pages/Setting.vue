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
    <!-- Crud the list location id that would be import to database -->
    <div id="incoming_add_submit" class="w-full flex mt-4">
      <Input
        @send="newLocationId = $event"
        label=""
        placeholder="Location id"
        tipe="primary"
        small
        :value="newLocationId"
      />
      <Button type="button" @trig="handleLocationID(newLocationId, 'add')" class="ml-2" primary small value="Tambah" />
    </div>

    <div class="w-full flex mt-4">
      <span class="mx-1" v-for="location in locationsId" key="location">
        {{ location }} 
        <span @click="handleLocationID(location)" class="btn  btn-xs btn-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </span>
      </span>
    </div>

    <!-- End of Crud the list location id that would be import to database -->
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
import Button from "../components/elements/Button.vue";
import { computed, ref } from "vue";
import { subscribeConfirmDialog } from "../composables/launchForm";

const listImportData = [
          { id: null, title: 'Pilih data untuk diimport'},
          { id: 'database', title: 'Database'}, 
          { id: 'salesOrder', title: 'Outstanding SO'}
        ]

const selectedImportType = ref(null)

// the label that would show in input type file
const labelImport = computed(() => {
  // if the selected import just selected
  if(selectedImportType.value) {
    // find the id of selected import
    const findList = listImportData.find((list) => list.id === selectedImportType.value)
    // return label
    if(findList) {
      return 'Import '+ findList?.title
    }
  }
})


// list of location id that would be import to database

const locationsId = ref(['GJDP', 'GJDP - D'])

const newLocationId = ref(null)

// action to add locations list
const handleLocationID = async (value, operation) => {
  // lets check the value first
  // if includes
  if(locationsId.value.includes(value)) {
    if(!operation) {
      const res = await subscribeConfirmDialog('confirm', `Apakah anda yakin akan menghapus location ID (${value})?`)
      // remove location from lists
      if(res) {
        locationsId.value = locationsId.value.filter((val) => val !== value);
      }
    }
  } else {
    // push new location id to list
    locationsId.value.push(value)
  }
  // empty the form
  newLocationId.value = null
}

// End of location id list
</script>