<template>
  <div v-if="!registeredDevice">
  <div class="pt-5 ps-5 pe-5 d-flex flex-column align-items-center">
    <img src="../assets/icon.png" style="font-size:80px;">
    <h2 class="mt-3 mb-2 fw-bold ">Rejestracja urządzenia</h2>
    <p class="lead text-center ">
      Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności.
      Uzupełnij poniższe dane i naciśnij przycisk "Rejestruj".
    </p>
  </div>

  <div class="d-flex align-items-center justify-content-center mx-auto pb-5 ps-5 pe-5">
    <form class="card p-3 bg-light bg-gradient" style="max-width: 400px; width: 100%;" @submit.prevent="register">
      <div class="mb-3">
        <label class="form-label">Nazwa urządzenia</label>
        <input type="text" class="form-control" v-model="deviceDTO.deviceName" placeholder="Wprowadź nazwę urządzenia" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Twoje imię</label>
        <input type="text" class="form-control" v-model="deviceDTO.studentName" placeholder="Wprowadź swoje imię" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Twoje nazwisko</label>
        <input type="text" class="form-control" v-model="deviceDTO.studentSurname"  placeholder="Wprowadź swoje nazwisko" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Twój numer albumu</label>
        <input type="number" class="form-control" v-model.number="deviceDTO.albumIdNumber" placeholder="Wprowadź numer albumu" required>
      </div>
      <button type="submit" class="btn btn-success w-100">Zarejestruj</button>
    </form>
  </div>
  </div>
  <SuccessRegisterDevice v-else />

</template>

<script setup lang="ts">

    import { useRoute, useRouter } from 'vue-router'
    import {reactive} from 'vue'
    import {Backend} from "@/main"
    import { ref } from 'vue'
    import SuccessRegisterDevice from '@/components/SuccesRegisterDevice.vue'
  
    const route = useRoute()
    const token = route.params.token as string
    const registeredDevice = ref(false)

    const deviceDTO = reactive({
        deviceName: '',
        studentName: '',
        studentSurname: '',
        albumIdNumber: 0
    })

    function register() {
        Backend.userDeviceRegisterWithToken(token, deviceDTO) 
            .then(() => {registeredDevice.value = true})
            .catch((e) => {
            console.error('Błąd rejestracji urządzenia:', e)
            alert('Nie udało się zarejestrować urządzenia')
    })
        }
    
  

</script>
