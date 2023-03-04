<template>
    <div class="flex flex-col">
        <h2 class="text-3xl mb-10">Pilih sheet buku stock untuk dibandingkan</h2>
        <span v-for="sheet of sheets" :key="sheet">
            <input :value="sheet" v-model="selectedSheet" type="radio" name="sheet" :id="sheet" class="mr-2">
            <label :for="sheet">{{ sheet }}</label>
        </span>
        <Button
            type="button"
            @trig="handleSubmit"
            primary
            value="Mulai"
            small
            id="button-select-sheet-submit"
            class="w-32 mt-10"
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
    store.commit('tunnelMessage', selectedSheet.value.toString())
}

</script>