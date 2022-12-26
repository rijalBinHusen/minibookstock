<template>
    <div id="incoming_items" class="flex gap-4 mb-2">
        <!-- items -->
        <div class="form-control">
            <label class="label">
                <span class="label-text">Item</span>
            </label>
            <div class="relative">
            <input
                type="text"
                placeholder="Masukkan item"
                class="w-64 input input-sm input-primary"
                @keyup="handleKeyUp('item', $event.target.value)"
                :value="item"
                />
            </div>
        </div>
        <!-- Quantity -->
        <div class="form-control">
            <label class="label">
                <span class="label-text">Quantity</span>
            </label>
            <div class="relative">
            <input
                type="text"
                placeholder="Quantity"
                class="w-20 input input-sm input-primary"
                @keyup="handleKeyUp('quantity', Number($event.target.value))"
                :value="quantity"
                />
            </div>
        </div>
        <!-- Kode produksi -->
        <div class="form-control">
            <label class="label">
                <span class="label-text">Kode produksi</span>
            </label>
            <div class="relative">
            <input
                type="text"
                placeholder="Kode"
                class="w-24 input input-sm input-primary"
                @keyup="handleKeyUp('kd_produksi', $event.target.value)"
                :value="kd_produksi"
                />
            </div>
        </div>
        <!-- tanggal produksi -->
        <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Tanggal produksi</span>
            </label>
            <date-picker
              id="date-picker"
              class="input input-outline input-primary input-sm w-28"
              v-model="product_date"
              :upper-limit="product_date"
            ></date-picker>
        </div>
        <!-- tanggal produksi -->
        <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Tanggal expired</span>
            </label>
            <date-picker
              id="date-picker"
              class="input input-outline input-primary input-sm w-28"
              v-model="product_expired"
              :upper-limit="product_expired"
            ></date-picker>
          </div>
    </div>
</template>

<script setup>
// item, quantity, kode produksi, tanggal produksi, tanggal exp
import Input from "./elements/Forms/Input.vue";
import datePicker from "vue3-datepicker";
import { ref, defineProps, onMounted, watch, defineEmits } from 'vue';

const product_date = ref(new Date());
const product_expired = ref(new Date())

const props = defineProps({
    item: String, 
    quantity: String, 
    kd_produksi: String, 
    product_created: Number,
    index: Number,
})
// jadikan master id sebagai props juga boss yaaaa

const emit = defineEmits(['valueChanged'])

// record value changed
const valueChanged = ref({})
// timeout variable
const timeout = ref(null)

// handle keyup in input form
const handleKeyUp = (key, value) => {
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
        emit('valueChanged', { index: props.index, value: { ...props, [key]: value} })
    }, 1500)
}

onMounted(() => {
    product_date.value = new Date(props.product_created)
})

</script>