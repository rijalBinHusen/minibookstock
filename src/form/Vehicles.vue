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
      <form id="vehicle_form" @submit.prevent="handleSubmit">
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
              @send="register = $event"
              placeholder="Register"
              tipe="primary"
            />
          </div>
  
          <div id="incoming_add_submit" class="w-full mt-4">
            <Button type="button" @trig="handleSubmit" small primary value="Submit" />
            <span class="text-red-400 ml-6">
              {{ warn }}
            </span>
          </div>
        </div>
      </form>
      </div>
  </template>
  
  <script setup>
  import Input from "@/components//elements/Forms/Input.vue";
  import Button from "@/components//elements/Button.vue";
  import { ref } from 'vue'
  import { createVehicle } from "../composables/Vehicles";
  import { closeModalOrDialog } from "../composables/launchForm";

  const warn = ref(null)
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

  const handleSubmit = async () => {
    
    if(noDO.value && noSO.value && register.value && platNomor.value && customer.value) {
      await createVehicle(noDO.value, noSO.value, platNomor.value, customer.value, register.value, "cabsdf", "aldsiue")
      // reset form
      const form = document.getElementById("vehicle_form")
      form.reset()
      // close modal
      closeModalOrDialog()
    } else {
      warn.value = "Data tidak boleh ada yang kosong"
      setTimeout(() => {
        warn.value = null
      }, 3000)
    }
  }
  </script>
  