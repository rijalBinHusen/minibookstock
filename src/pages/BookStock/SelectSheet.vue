<template>
    <div>
        <h2>Pilih sheet untuk dibandingkan</h2>
        <span v-for="sheet of sheets" :key="sheet">
            <label :for="sheet">{{ sheet }}</label>
            <input v-model="selectedSheet" type="checkbox" name="sheet" :id="sheet">
        </span>
        <Button
            type="button"
            @trig="handleSubmit"
            primary
            value="Bandingkan"
            small
            id="button-select-sheet-submit"
          />
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref } from 'vue';
import Button from '../../components/elements/Button.vue';

const store = useStore()
const selectedSheet = ref('')

const sheets = store.state.form?.document

const handleSubmit = () => {
    store.commit('tunnelMessage', selectedSheet.value)
}

</script>