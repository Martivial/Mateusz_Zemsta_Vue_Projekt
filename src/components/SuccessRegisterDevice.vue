<template>

<div class="d-flex text-center  flex-column justify-content-center align-items-center px-4 py-5 mx-auto" style="width:100%;min-height:100vh;">
  <img src="../assets/icon.png"/> 
  <h2 fw-bold>Urządzenie zarejestrowane</h2>
  <p>Przejdź do skanowania objecności lub do pulpitu (wymagane logowanie).</p>
  <button class="btn btn-success " style="width:150px" @click="goToScan">Skanuj obecność</button>
  <button class="btn btn-warning btn-md mt-2"style="width:150px" @click="goToLogin">Otworz pulpit</button>
  <button class="btn btn-danger btn-md mt-2" @click="resetDevice">Resetuj</button>
</div>
</template>
<script lang setup="ts">

import {useRouter} from 'vue-router'
import { Backend } from '@/main'

const router = useRouter();

function resetDevice() {
  if (!window.confirm('Czy na pewno chcesz zresetować urządzenie?')) return

  Backend.deviceAuthReset()
  router.replace('/login')
}
function goToLogin() {
  router.push("/login")
}
function goToScan() {
  router.push("/ticket")
}
</script>