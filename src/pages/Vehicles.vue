<template>
    <div class="grid mx-2 gap-2">
        <span class="flex items-center justify-center">
            <span class="text-3xl">Kendaraan:</span>
            <date-picker 
                class="ml-2 bg-base-200 p-2 rounded" 
                :upper-limit="new Date()" 
                v-model="tanggal">
            </date-picker>
            <Button
                primary
                value="Submit"
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
        </span>
        <datatable
            :heads="['plat nomor', 'customer', 'register', 'start', 'finished']"
            :keys="['plat_nomor', 'customer', 'register', 'start', 'finished']"
            :datanya="Vehicles"
            keydata="id"
            no
            id="table-vehicle"
            option
            v-slot:default="slotProps"
        >
            <!-- if vehicle finished, prevent to edit, give details button instead of edit -->
            <!-- else, show delete and edit button -->
            <!-- details button -->
            <Button
                primary
                value="Detail"
                type="button"
                small
                class="ml-2"
                :datanya="slotProps.prop.id"
                @trig="handleButton('detail', $event)"
            />
            <!-- delete button -->
            <Button
                secondary
                value="Delete"
                type="button"
                small
                class="ml-2"
                :datanya="slotProps.prop.id"
                @trig="handleButton('delete', $event)"
            />
            <!-- Edit button -->
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
import { launchForm, subscribeConfirmDialog } from '../composables/launchForm'
import { Vehicles, gettingStartedRecord, removeVehicle} from "@/composables/Vehicles";

const tanggal = ref(new Date())

const handleAdd = () => {
    launchForm('Vehicles', false)
}

const handleButton = async (operation, id) => {
    // operation = edit || delete || detail
    if(operation == 'delete') {
        const res = await subscribeConfirmDialog('confirm', "Apakah anda yakin akan menghapus kendaraan?")
        if(res) {
            await removeVehicle(id)
        }
    } else if(operation == 'edit') {
        launchForm('Vehicles', id)
    } else {

    }

}

onMounted(() => {
    gettingStartedRecord()
})


</script>