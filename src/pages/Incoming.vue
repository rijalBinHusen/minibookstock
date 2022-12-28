<template>
    <div class="grid mx-2 gap-2">
        <span class="flex items-center justify-center">
            <span class="text-3xl">Incoming</span>
            <date-picker 
                class="ml-2 bg-base-200 p-2 rounded" 
                v-model="tanggal"
                :upperLimit="tanggal"
            >
            </date-picker>
            <Button
                primary
                value="Tampilkan"
                type="button"
                small
                class="ml-2"
            />
            <Button
                primary
                value="Tambah"
                type="button"
                small
                class="ml-2"
                @trig="handleAdd"
                />
                <!-- @trig="handleAdd" -->
        </span>
        <datatable
            :heads="['tanggal', 'shift', 'type', 'diterima', 'diserahkan']"
            :keys="['tanggal', 'shift', 'type', 'diterima', 'diserahkan']"
            :datanya="lists"
            keydata="id"
            no
            id="table-incoming"
            option
            v-slot:default="slotProps"
        >
        
          <Button
              accent
              value="Edit"
              type="button"
              small
              class="ml-2"
              :datanya="slotProps.prop.id"
              />
              <!-- @trig="handleButton($event)" -->

        </datatable>
    </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Datatable from "../components/parts/Datatable.vue";
import Button from "../components/elements/Button.vue";
import { ref, onMounted } from "vue";
import { launchForm } from "../composables/launchForm";
import { gettingStartedRecord as getIncomingRecord, documentsMapper as incomingMapper, Incoming_transaction } from "../composables/Incoming"

// what date to show record
const tanggal = ref(new Date())
// function to launch form to add income product
const handleAdd = () => {
    launchForm('IncomingForm', false)
}

const lists = ref([])

const renderRecord = () => {
    // get record
    getIncomingRecord()
    // map record
    lists.value = incomingMapper(Incoming_transaction.value)
}

onMounted(() => {
    renderRecord()
})


</script>