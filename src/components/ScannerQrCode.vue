<template>
  <div
    class="modal fade"
    id="scannerModal"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-md modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Skaner obecności</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body">
          <p class="text-muted">
            Do sprawdzania obecności wymagane jest urządzenie wyposażone
            w kamerę (tablet lub telefon). Zeskanuj na nim poniższy kod QR
            lub otwórz adres url, który możesz skopiować poniższym przyciskiem.
            Sprawdzenie obecności polega na umieszczeniu w polu widzenia kamery
            skanera kodu QR wygenerowanego na ekranie telefonu uczestnika.
          </p>

          <div class="text-center">
            <qrcode-vue v-if="scannerUrl" :value="scannerUrl" :size="300"/>
          </div>

          <div class="text-center mt-3">
            <button class="btn btn-dark">Skopiuj adres</button>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Zamknij
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

 defineProps<{
  scannerUrl?: string
}>()


</script>
