<template>
  <div class="border-r-2 p-6 min-h-screen flex gap-2">
    <!-- <component :is="activeComponent"></component> -->
    <JurnalId />
    <div class="bg-base-200 w-6/12 p-2">
      <p class="text-3xl text-center">{{ label || 'Export atau Import data' }}</p>
      <Select
        value="id"
        text="title"
        id="data_to_import"
        :options="listData"
        size="small"
        class="w-56 mt-10"
        @selectedd="selectedDataType = $event"
      />

    <component :is="components[selectedDataType]"></component>
    <!-- Crud the list location id that would be import to database -->
    <!-- <div class="mt-4">
      <div id="incoming_add_submit" class="w-full flex">
        <Input
          @send="newLocationId = $event"
          label=""
          placeholder="Tambahkan location id"
          tipe="primary"
          small
          :value="newLocationId"
        />
        <Button type="button" @trig="handleLocationID(newLocationId, 'add')" class="ml-2" primary small value="Tambah" />
      </div>
      <div class="mt-4">
        <label>Daftar location ID: </label>
        <div class="w-full">
          <span class="mx-1" v-for="location in locationsId" key="location">
            {{ location }}
            <span @click="handleLocationID(location)" class="btn  btn-xs btn-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </span>
          </span>
        </div>
      </div>
    </div> -->

    <!-- End of Crud the list location id that would be import to database -->
      <!-- <Input
        v-if="labelImport"
        type="file"
        tipe="primary"
        accept=".js"
        :label="labelImport"
        button="Import"
        ref="importerField"
      /> -->
        <!-- @change="impor($event)" -->
  </div>
  </div>
</template>

<script setup>
import JurnalId from "../components/JurnalId.vue";
import Select from "../components/elements/Forms/Select.vue";
import { computed, ref } from "vue";
import BackupData from "../components/BackupData.vue";
import ImportData from "../components/ImportData.vue";
import ImportStockAwal from "../components/ImportStockAwal.vue"

const listData = [
          // { id: 'database', type: 'import', title: 'Import Database'},
          // { id: 'salesOrder', type: 'import', title: 'Import Outstanding SO'},
          { id : 'BackupData', type: 'export', title: 'Backup data'},
          { id: 'ImportData', type: 'import', title: 'Import database'},
          { id: 'ImportStockAwal', type: 'import', title: 'Import stock awal'},
        ]

// the variable that will contain id of listData what user selected in select option
const selectedDataType = ref(null)

// the label that would show in input type file
const label = computed(() => {
  // if the selected import just selected
  if(selectedDataType.value) {
    // find the id of selected import
    const findList = listData.find((list) => list.id === selectedDataType.value)
    // return label
    if(findList) {
      return findList?.title
    }
  }
})

// the list of all components
const components = {
  BackupData, ImportData, ImportStockAwal
}


// list of location id that would be import to database

// const locationsId = ref(['GJDP', 'GJDP - D'])

// const newLocationId = ref(null)

// // action to add locations list
// const handleLocationID = async (value, operation) => {
//   // lets check the value first
//   // if includes
//   if(locationsId.value.includes(value)) {
//     if(!operation) {
//       const res = await subscribeConfirmDialog('confirm', `Apakah anda yakin akan menghapus location ID (${value})?`)
//       // remove location from lists
//       if(res) {
//         locationsId.value = locationsId.value.filter((val) => val !== value);
//       }
//     }
//   } else {
//     // push new location id to list
//     locationsId.value.push(value)
//   }
//   // empty the form
//   newLocationId.value = null
// }

// End of location id list
</script>
