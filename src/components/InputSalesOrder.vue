<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">Sales order</span>
        </label>
        <div class="relative">
            <input
                type="text"
                placeholder="Masukkan Sales order"
                :class="[ small ?  'input-sm' : '', 'input input-primary']"
                list="sales_order"
                @change="handleItem"
                :value="nomor_so"
                :disabled="disabled"
                />
            <datalist id="sales_order">
                <option v-for="order in sales_orders" :key="order.id" :value="order.nomor_so + ' | ' +order.customer+ '*'+ order.id + '* '+ order.nomor_so" />
            </datalist>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, onMounted, defineProps } from 'vue';
import { getSalesOrder, sales_orders } from "../composables/SalesOrder"

const emit = defineEmits(['pickedSalesOrder'])

const props = defineProps({
    nomor_so: String,
    small: Boolean,
    disabled: Boolean,
})

const handleItem = (e) => {
    if(e.target.value) {
        // split * to get SOrder Id
        const s = e.target.value.split("*")[1]
        emit('pickedSalesOrder', s || e.target.value)
    }
}


onMounted( async () => {
    // getting all item
    await getSalesOrder()
})

</script>
