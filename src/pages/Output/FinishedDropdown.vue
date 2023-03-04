<template>
    <div class="dropdown dropdown-hover mr-2">
        <div tabindex="0" class="btn btn-accent btn-sm">
        Selesai muat
        </div>
        <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content bg-base-200 rounded-box w-32"
        >
        <li v-for="date of dates" :key="date">
            <span class="btn-sm">
            <input :value="date.dateTime" v-model="dateChecked" type="radio" name="tanggal" :id="date.dateTime"> 
            <label :for="date.dateTime" class="ml-2">{{ date.dateMonth }}</label>
            </span>
        </li>
        
        <li class="text-xs"> <a @click="handleButton(1)"> Shift 1 </a> </li>
        <li class="text-xs"> <a @click="handleButton(2)"> Shift 2 </a> </li>
        <li class="text-xs"> <a @click="handleButton(3)"> Shift 3 </a> </li>
        <li class="text-xs"> <a @click="handleButton(4)"> Shift 4 </a> </li>
        </ul>
    </div>
</template>

<script setup>
import { dayPlusOrMinus, dateMonth, ymdTime } from '../../utils/dateFormat';
import { computed, ref } from "vue"

const dateChecked = ref(ymdTime())

const emit = defineEmits(['sendDateAndShift'])

const dates = computed(() => {
    let res = []
    const nowDate = new Date()
    for(let i = 0; i < 2; i++) {
        const decrement = dayPlusOrMinus(nowDate, -i)
        res.push({ dateTime: ymdTime(decrement), dateMonth: dateMonth(decrement)})
    }
    return res
})

const handleButton = (shift) => {
    emit('sendDateAndShift', { date: dateChecked.value, shift, dateMonth: dateMonth(dateChecked.value) })
}

</script>