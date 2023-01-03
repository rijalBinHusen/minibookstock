<template>
    <div class="grid mx-2 gap-2">
        <span class="flex items-center justify-center">
            <span class="text-3xl">Output</span>
            <date-picker 
                class="ml-2 bg-base-200 p-2 rounded" 
                v-model="dateRecordToShow"
            >
            </date-picker>
            <Button
                primary
                value="Tampilkan"
                type="button"
                small
                class="ml-2"
                @trig="handlePeriode"
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
            :heads="['tanggal', 'shift', 'Nomor so', 'nama item', 'tanggal produksi', 'quantity']"
            :keys="['tanggal', 'shift', 'nomor_so', 'nm_item', 'product_created', 'quantity']"
            :datanya="lists"
            keydata="id"
            no
            id="table-output"
            option
            v-slot:default="slotProps"
        >
        
          <Button
              v-if="!slotProps.prop?.isFinished"
              secondary
              value="hapus"
              type="button"
              small
              class="ml-2"
              :datanya="slotProps.prop.id"
              @trig="handleButton('remove', $event)"
              />
        
        <Button
            v-if="!slotProps.prop?.isFinished"
            accent
            value="sudah muat"
            type="button"
            small
            class="ml-2"
            :datanya="slotProps.prop.id"
            @trig="handleButton('finished', $event)"
            />

        </datatable>
    </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Datatable from "../components/parts/Datatable.vue";
import Button from "../components/elements/Button.vue";
import { ref, onMounted } from "vue";
import { launchFormAndsubscribeMutation, subscribeConfirmDialog } from "../composables/launchForm";
import { outputTransactionMapped, removeOutputById, markAsFinished, dateRecordToShow, getRecordByDate } from "../composables/Output"

// what date to show record
// dateRecordToShow
// using ^ that variable
// const tanggal = ref(new Date())
// function to launch form to add income product
const handleButton = async (operation, document) => {
    // if operation === remove
    let res = null;
    // add incoming transaction, waiting for tunnel message that send in form
    if(operation === 'add') {
        res = await launchFormAndsubscribeMutation('OutputForm', document, 'tunnelMessage')
    }
    // if res true, it mean the add new record or update while false, itt close the modal without add record
    else if(operation === 'remove') {
        res = await subscribeConfirmDialog('confirm', 'Apakah anda yakin akan mengahapusnya?')
    }
    // if operation === finished
    else if (operation === 'finished') {
        res = await subscribeConfirmDialog('confirm', 'Apakah kendaraan selesai muat?')
    }
    // if tunnel message send you true
    if(res) {
        // if operation remove record
        if(operation === 'remove') {
            // remove record from db
            await removeOutputById(document)
        } else if(operation === 'finished') {
            // mark as finished db
           await  markAsFinished(document)
        }
        // re render record
        renderRecord()
    }
}

const lists = ref([])

const handlePeriode = async () => {
    await getRecordByDate()
    renderRecord()
}

const renderRecord = () => {
    lists.value = []
    // get record
    // getIncomingRecord()
    // map record
    setTimeout( async () => {
        lists.value = await outputTransactionMapped()
    }, 500)
}

onMounted(async () => {
    renderRecord()
})


</script>