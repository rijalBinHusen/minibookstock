<template>
    <div class="form-control">
            <label for="shift" class="label">
              <span class="label-text">Shift</span>
            </label>
            <Select
            @selectedd="handleSelectShift($event)"
              id="shift"
              :options="options"
              value="shift"
              text="shift"
              size="primary small"
              :inSelect="inSelect"
            />
          </div>
</template>

<script setup>
import Select from '../elements/Forms/Select.vue';

import { defineEmits, ref, computed } from 'vue';
const emit = defineEmits(['selectedShift'])
const props = defineProps({
    shift: Number
})
const currentShift = ref(null)

const inSelect = computed(() => props.shift + "" || currentShift.value)

const options = [
                    { shift: '1' },
                    { shift: '2' },
                    { shift: '3' },
                ]
const handleSelectShift = (shift) => {
    // change state
    currentShift.value = shift
    // emit to parent
    emit('selectedShift', Number(shift))
}

// todo, build select type document compoentn
</script>