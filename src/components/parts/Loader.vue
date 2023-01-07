<template>
<div class="grid gap-10 text-center">
  <div class="lds-hourglass margin-auto justify-self-center"></div>
  <p class="text-3xl">{{ loaderMessageToShow || 'Mohon tunggu...' }}</p>
</div>
</template>

<script setup>
import { loaderMessageToShow } from "../../composables/launchForm"
</script>

<style scoped>
.lds-hourglass {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-hourglass:after {
  content: " ";
  display: block;
  border-radius: 50%;
  width: 0;
  height: 0;
  margin: 8px;
  box-sizing: border-box;
  border: 32px solid rgb(247, 247, 247);
  border-color: rgb(57, 95, 235) transparent rgb(71, 117, 255) transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
}
</style>
