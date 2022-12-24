<template>
      <div
        id="incoming_add_form"
        class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
      >  
      <!-- NO DO -->
      <!-- NO SO -->
      <!-- REGISTER -->
      <!-- PLAT NOMOR -->
      <!-- CUSTOMER -->
        <div id="incoming_add_form" class="grid justify-items-center">
            <div id="incoming_paper" class="flex justify-self-start gap-4">
              <!-- NO DO -->
            <Input
              label="Nomor DO"
              @send="noDO = $event"
              placeholder="Masukkan nomor DO"
              tipe="primary"
            />
              <!-- NO SO -->
            <Input
              label="Nomor SO"
              @send="noSO = $event"
              placeholder="Masukkan Nomor SO"
              tipe="primary"
            />
        </div>
            
            <div id="incoming_items" class="grid grid-cols-3 gap-4 mb-2">
              <!-- PLAT NOMOR -->
            <Input
              label="Plat nomor"
              @send="platNomor = $event"
              placeholder="Masukkan plat nomor"
              tipe="primary"
              />
                <!-- CUSTOMER -->  
            <Input
              label="Customer"
              @send="customer = $event"
              placeholder="Nama Customer"
              tipe="primary"
            />
              <!-- REGISTER -->
            <Input
              label="Register"
              @send="register"
              placeholder="Register"
              tipe="primary"
            />
          </div>
  
          <div id="incoming_add_submit" class="w-full">
            <Button type="button" @trig="save" primary value="Submit" />
          </div>
        </div>
      </div>
  </template>
  
  <script setup>
  import datePicker from "vue3-datepicker";
  import Select from "@/components/elements/Forms/Select.vue";
  import Input from "@/components//elements/Forms/Input.vue";
  import Button from "@/components//elements/Button.vue";
  import Table from "@/components//elements/Table.vue";
  import { ref } from 'vue'

  // <!-- NO DO -->
  const noDO = ref(null);
  // <!-- NO SO -->
  const noSO = ref(null)
  // <!-- REGISTER -->
  const register = ref(null)
  // <!-- PLAT NOMOR -->
  const platNomor = ref(null)
  // <!-- CUSTOMER -->
  const customer = ref(null)
  </script>
  