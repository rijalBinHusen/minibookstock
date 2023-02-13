<template>
  <div>
    <input checked type="checkbox" id="modal-confirm" class="modal-toggle" />
    <div id="modal-confirm" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          {{ typeDialog == 'confirm' ? 'Peringatan' : 'Pemberitahuan' }}
        </h3>
        <p class="py-4" v-html="dialogMessage"></p>
        <div v-if="typeDialog == 'confirm'" class="modal-action">
          <Button
            type="button"
            class="ml-2"
            primary
            small
            value="Iya"
            @trig="handleButton(true)"
          />
          <Button
            type="button"
            class="ml-2"
            secondary
            small
            value="Tidak"
            @trig="handleButton(false)"
          />
        </div>
        <div v-else class="modal-action">
          <Button
            type="button"
            class="ml-2"
            primary
            small
            value="Oke"
            @trig="handleButton(false)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import Button from './elements/Button.vue';
import { keyPress } from '@/composables/keyEvent.js';

const store = useStore();
// If the type of dialog is confirm
// If the type of dialog is alert
const typeDialog = computed(() => store.state.dialogType);
const dialogMessage = computed(() => store.state.dialogMessage);
// if the button yes clicked
// if the button no clicked or the modal closed
const handleButton = (boolean) => {
  store.commit('tunnelMessage', boolean);
};

onMounted(() => {
  window.addEventListener('keydown', keyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keyPress);
});
</script>
