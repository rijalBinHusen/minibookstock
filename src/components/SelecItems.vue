<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">Item</span>
        </label>
        <div class="relative">
            <input
                type="text"
                placeholder="Masukkan item"
                class="w-64 input input-sm input-primary"
                @change="handleItem"
                list="item"
            />
            <datalist id="item">
                <option @select="handleItem" v-for="item in Master_items" :key="item.id" :value="item.kd_item + '* ' +item.nm_item" />
            </datalist>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, onMounted } from 'vue';
import { gettingStartedRecord as getItems, Master_items, getItemIdByKdItem } from "../composables/MasterItems"

const emit = defineEmits(['pickedItem'])

let timeoutHandleItem = null
const handleItem = (e) => {
    if(e.target.value) {
        // clearTimeout
        clearTimeout(timeoutHandleItem)
        timeoutHandleItem = setTimeout( async () => {
            const kd_item = e.target.value.split("*")[0]
            const itemInfo = await getItemIdByKdItem(kd_item)
            emit('pickedItem', itemInfo.id)
        }, 100)
    }
}


onMounted( async () => {
    // getting all item
    await getItems()
})

</script>