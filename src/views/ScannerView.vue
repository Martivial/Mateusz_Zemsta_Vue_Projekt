<template>
  <div class="d-flex flex-column align-items-center justify-content-center vh-100 px-3">
    <h2 class="mb-3">Skaner obecności</h2>

    <p class="text-muted text-center mb-3" style="max-width:400px">
      Umieść kod QR studenta w polu widzenia kamery.
    </p>

    <!-- Kamera -->
    <qrcode-stream
      v-if="!success"
      @detect="onDetect"
      @init="onInit"
    />

    <!-- Sukces -->
    <div v-if="success" class="alert alert-success mt-3 text-center">
      ✔ Obecność zarejestrowana<br />
      {{ studentName }}
    </div>

    <!-- Błąd -->
    <div v-if="error" class="alert alert-danger mt-3 text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { QrcodeStream } from 'vue-qrcode-reader'
import { Backend } from '@/main'

const route = useRoute()
const scannerToken = route.params.token as string

const success = ref(false)
const error = ref('')
const studentName = ref('')

// ⚠️ bardzo ważne
onMounted(() => {
  Backend.deviceTokenResult = { token: scannerToken }
})

// po wykryciu QR
function onDetect(result: any) {
  const attenderToken = result[0]?.rawValue
  if (!attenderToken) return

  Backend.courseSessionAttendanceRegister(attenderToken)
    .then(user => {
      success.value = true
      studentName.value = `${user.name} ${user.surname}`

    })
    .catch(() => {
      error.value = 'Nie udało się zarejestrować obecności'
      setTimeout(() => (error.value = ''), 3000)
    })
}

function onInit(promise: Promise<void>) {
  promise.catch(() => {
    error.value = 'Brak dostępu do kamery'
  })
}
</script>
