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
            :heads="['platNo', 'customer', 'register', 'start', 'finished']"
            :datanya="vehicles"
            keydata="id"
            no
            id="table-incoming"
            option
            v-slot:default="slotProps"
        >

            <Button
                primary
                value="Detail"
                type="button"
                small
                class="ml-2"
                :datanya="slotProps.prop.id"
            />
        </datatable>
    </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Datatable from "../components/parts/Datatable.vue";
import Button from "../components/elements/Button.vue";
import { ref } from "vue";
import { launchForm } from '../composables/launchForm'

const tanggal = ref(new Date())

const handleAdd = () => {
    launchForm('Vehicles', false)
}

const vehicles = [
    {id: '1', no_do: '102938', no_so: '102938', register: '123', start: '', finished: '', platNo: 'adffdadf', customer: 'asdfasdfadf' }
];

</script>