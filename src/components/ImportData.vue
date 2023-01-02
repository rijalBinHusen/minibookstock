<template>
    <div class="form-control mt-10">
    <label>
      <span class="label-text">Import data</span>
    </label>
    <div class="relative">
      <input
        type="file"
        placeholder="Import data"
        class="w-full pr-16 input input-primary"
        ref="inputFile"
        accept=".json"
      />
      <button
        class="absolute top-0 right-0 rounded-l-none btn btn-primary"
        @click="handleImport"
      >
        Mulai import
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
    // ref for input type file
    const inputFile = ref()
    // function to read file as text
    const handleImport = () => {
        // get the first file on input element
        const file = inputFile.value.files[0]
        // initiate file reader
        const reader = new FileReader();
        // read file as text
        reader.readAsText(file);
        //when reading is completed load
        reader.onload = (event) => console.log(JSON.parse(event.target.result));
    }
</script>