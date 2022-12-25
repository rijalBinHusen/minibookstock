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
              :value="noDO"
            />
              <!-- NO SO -->
            <Input
              label="Nomor SO"
              @send="noSO = $event"
              placeholder="Masukkan Nomor SO"
              tipe="primary"
              :value="noSO"
            />
        </div>
            
            <div id="incoming_items" class="grid grid-cols-3 gap-4 mb-2">
              <!-- PLAT NOMOR -->
            <Input
              label="Plat nomor"
              @send="platNomor = $event"
              placeholder="Masukkan plat nomor"
              tipe="primary"
              :value="platNomor"
              />
                <!-- CUSTOMER -->  
            <Input
              label="Customer"
              @send="customer = $event"
              placeholder="Nama Customer"
              tipe="primary"
              :value="customer"
            />
              <!-- REGISTER -->
            <Input
              label="Register"
              @send="register = $event"
              placeholder="Register"
              :value="register"
              tipe="primary"
            />
          </div>
  
          <div id="incoming_add_submit" class="w-full mt-4">
            <Button type="button" @trig="handleSubmit" small primary :value="isEditMode ? 'Update' : 'Submit'" />
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
  import { ref, onMounted, computed, watch } from 'vue'
  import { createVehicle, getVehicleById, updateVehicleById } from "../composables/Vehicles";
  import { closeModalOrDialog } from "../composables/launchForm";
  import { useStore } from "vuex";
  
  const store = useStore()

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
      // update vehicle
      if(isEditMode.value) {
        await updateVehicleById(isEditMode.value, changedValue.value)
      }
      // insert vehicle
      else {
        await createVehicle(noDO.value, noSO.value, platNomor.value, customer.value, register.value, false, false)
      }
      // reset form
      // const form = document.getElementById("vehicle_form")
      // form.reset()
      // close modal
      closeModalOrDialog()
    } else {
      warn.value = "Data tidak boleh ada yang kosong"
      setTimeout(() => { warn.value = null }, 3000)
    }
  }

  // will contain the id of record or undefined
  const isEditMode = computed(() => store.state?.form?.document)
  // will contain original value when edit mode
  const originalRecord = ref(null);
  // will contain the record that changed to send to sql indexeddb
  // e.g { keyUpdated: valueUpdated }
  const changedValue = ref({})

  onMounted( async () => {
    // detecting is edit mode
    // if edit mode, find vehicle by id, then fill the form
    if(isEditMode.value) {
      originalRecord.value = await getVehicleById(isEditMode.value)
      noDO.value = originalRecord.value?.nomor_do;
      noSO.value = originalRecord.value?.nomor_so;
      platNomor.value = originalRecord.value?. plat_nomor;
      customer.value = originalRecord.value?.customer;
      register.value = originalRecord.value?.register;
      setTimeout(() => {enableWatcher.value = true}, 500 )
    }
  })

  // disable enable watcher
  const enableWatcher = ref(false)
  // watch the value changed
  watch([noDO, noSO, register, platNomor, customer], (newVal) => {
    if(enableWatcher.value) {
      // noDO
      if(newVal[0] !== originalRecord.value?.nomor_do) {
        changedValue.value['nomor_do'] = newVal[0]
      }
      // noSO
      if(newVal[1] !== originalRecord.value?.nomor_so) {
        changedValue.value['nomor_so'] = newVal[1]
      }
      // register
      if(newVal[2] !== originalRecord.value?.register) {
        changedValue.value['register'] = newVal[2]
      }
      // platNomor
      if(newVal[3] !== originalRecord.value?.plat_nomor) {
        changedValue.value['plat_nomor'] = newVal[3]
      }
      // customer
      if(newVal[4] !== originalRecord.value?.customer) {
        changedValue.value['customer'] = newVal[4]
      }
    }
  })
  </script>
  