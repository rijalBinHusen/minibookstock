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
                />
                <!-- @trig="handleAdd" -->
        </span>
        <!-- <datatable
            :heads="['tanggal', 'shift', 'nameItem', 'qty']"
            :datanya="lists"
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
                @trig="detail($event)"
            />
        </datatable> -->
    </div>
</template>

<script setup>
import datePicker from "vue3-datepicker";
import Datatable from "../components/parts/Datatable.vue";
import Button from "../components/elements/Button.vue";
import { ref } from "vue";

const tanggal = ref(new Date())


</script>