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
                @trig="handleButton('add')"
                />
                <!-- @trig="handleAdd" -->
        </span>
        <datatable
            :heads="['tanggal', 'shift', 'nomor dokumen', 'diterima', 'diserahkan']"
            :keys="['tanggal', 'shift', 'paper_id', 'diterima', 'diserahkan']"
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
              @trig="handleButton('edit', $event)"
              />

        </datatable>
    </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Datatable from "../components/parts/Datatable.vue";
import Button from "../components/elements/Button.vue";
import { ref, onMounted } from "vue";
import { launchFormAndsubscribeMutation } from "../composables/launchForm";

// what date to show record
const tanggal = ref(new Date())
// function to launch form to add income product
const handleButton = async (operation, document) => {
    // add incoming transaction, waiting for tunnel message that send in form
    const res = await launchFormAndsubscribeMutation('OutputForm', document, 'tunnelMessage')
    // if res true, it mean the add new record or update while false, itt close the modal without add record
    if(res) {
        renderRecord()
    }
}

const lists = ref([])

const renderRecord = () => {
    lists.value = []
    // get record
    // getIncomingRecord()
    // map record
    // setTimeout(() => {
    //     lists.value = incomingMapper(Incoming_transaction.value)
    // }, 500)
}

onMounted(() => {
    renderRecord()
})


</script>