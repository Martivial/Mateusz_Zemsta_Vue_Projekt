<template>
    <div class="px-2 py-2 d-flex justify-content-center align-items-center m-auto flex-column" style="width:100vw">
        <img src="../assets/icon.png" @click="router.back()" style="cursor:pointer">


        <div v-if="deviceRegistered === true" class="pt-4">

        <qrcode-vue v-if="ticket" :value="ticket" :size="300"/>
        <p class="pt-4 text-center" style="max-width:300px">
            Aby zarejestorować obecność umieść telefon w polu widzenia skanera.
             W razie wątpliwości poproś osobę prowadzącą zajęcia o pomoc.
        </p>
        </div>
        <div v-else>
            <p class="alert alert-danger text-center mt-3" style="max-width:500px">
                Wystąpił błąd podczas pobierania kodu, 
                sprawdź poprawność działania sieci oraz 
                czy twoje urządzenie jest prawidłowo zarejestrowane. 
                W razie wątpliwości poproś wykładowcę o pomoc."
            </p>
        </div>
        </div>
</template>

<script setup lang="ts">
    import QrcodeVue from 'qrcode.vue';
    import {Backend} from '@/main'
    import {ref, onMounted, onUnmounted} from 'vue'
    import {useRouter} from 'vue-router'

    const ticket = ref<string>()
    const info = ref<string>()
    let interval: number
    const router = useRouter()
    const deviceRegistered = ref<boolean | null>(null)

    onMounted(() => {
        loadTicket()
        interval = setInterval(loadTicket,2000)

    })
    onUnmounted(() => {
        clearInterval(interval)
    })

    function loadTicket() {
        Backend.userAttendanceTicketGet()
        .then(r => {
            ticket.value = r.token
            deviceRegistered.value = true
            
        })
        .catch(()=> {
            deviceRegistered.value = false
            localStorage.removeItem('attend-me:deviceAuthData')
        })
         }

   
</script>