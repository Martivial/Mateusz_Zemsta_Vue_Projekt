<template>


  <AppHeader title="Panel wykładowcy"/>
   
     <div class="d-flex justify-content-between align-items-center mx-auto mt-3" style="max-width:1200px">

      <div v-if="session">
      <h3>{{ session.courseName }}</h3>
      <p class="small"><b>Termin</b> {{ formatDate(session.dateStart, session.dateEnd).date }} </p>
      <p class="small"><b>Godziny</b> {{ formatDate(session.dateStart, session.dateEnd).time }} </p>
      <p class="small"><b>Grupa</b> {{ session.courseGroupName }} </p>
      <p class="small"><b>Lokalizacja</b> {{ session.locationName}} </p>
    </div>

    <div class="d-flex flex-column gap-4 justify-items-center">
      <button class="btn btn-primary bt-large" data-bs-toggle="modal"
       data-bs-target="#scannerModal" @click="openScanner">Ekran skanowania</button>
      <button type="button" class="btn btn-secondary" @click="loadAtt">Odśwież</button>
    </div>
    </div>

    <table class="table mx-auto mt-3 table-striped" style="max-width:1200px">
  <thead class="table-dark">
    <tr>
      <th>Imię Nazwisko</th>
      <th>Nr indeksu</th>
      <th>Obecność</th>
    </tr>
  </thead>
  <tbody v-if="attendance.length">
    <tr v-for="a in attendance" :key="a.studentAlbumIdNumber">
      <td>{{ a.userName}} {{ a.userSurname }}</td>
      <td>{{ a.studentAlbumIdNumber }}</td>
      <td>
        <span v-if="a.wasUserPresent" class="bg-success rounded p-1 small text-white fw-bold">Obecny</span>
        <span v-else class="bg-danger rounded p-1 small text-white fw-bold">Nieobecny</span>
      </td>
     
    </tr>
  </tbody>
</table>

<div class="modal fade" id="scannerModal" tabindex="-1" aria-hidden="true">
   <div class="modal-dialog modal-md modal-dialog-centered">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title">Skaner obecności</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <p class="text-muted">
          Do sprawdzania obecności wymagane jest urządzenie wyposażone
          w kamerę (tablet lub telefon). Zeskanuj na nim poniższy kod QR
          lub otwórz adres url, który możesz skopiować poniższym przyciskiem.
          Sprawdzenie obecności polega na umieszczeniu w polu widzenia kamery
          skanera kodu QR wygenerowanego na ekranie telefonu uczestnika.
        </p>

        <div class="text-center"><qrcode-vue v-if="scannerUrl" :value="scannerUrl" :size="300" /> </div>
        <div class="text-center">
        <button class="btn btn-dark">Skopiuj adres </button>
      </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
      </div>
      </div>
      </div>
</div>
  
  </template>

  <script setup lang="ts">

import {ref} from 'vue'
import {onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {Backend} from "@/main"
import QrcodeVue from 'qrcode.vue'
import AppHeader from '@/components/AppHeader.vue'


    const route = useRoute();
    const router = useRouter();
    const user = ref<any> (null)
    const session = ref<any> (null)
    const attendance = ref<any[]> ([])
    const sessionId = Number(route.params.id)
    const scannerUrl = ref<string>('')
    

    onMounted(() => {
        loadUser()
        loadSubjects()
        loadAtt()
        setInterval(()=> {loadAtt()}, 5000)
    })
    function loadUser() {
      const user_data = sessionStorage.getItem('user')
      if(user_data) {user.value = JSON.parse(user_data)}
    }

    function goTeacherView() {router.push({name: 'TeacherView' })}
    
    function logout() {
      sessionStorage.removeItem('user')
      router.push('/login')
    }
    async function loadSubjects() {
      session.value = await Backend.courseTeacherSessionGet(sessionId);
      console.log(session.value)
    }
    
     function formatDate(start:Date, end: Date) {
      return {
        date: start.toLocaleDateString('pl-PL', {day: '2-digit', month: 'long', year: 'numeric'}),
        time: `${start.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})} -
         ${end.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`
      }
     }
     async function loadAtt() {
      if(!sessionId) return;
      
      try {
        attendance.value = await Backend.courseSessionAttendanceListGet(sessionId)
      }
      catch (e) {
        console.error(`Blad pobierania obecnosci dla sesji ${sessionId}`, e);
      }
      }

      async function openScanner() {
        const tokenResult = await Backend.courseSessionAttendanceScannerTokenGet(sessionId)
        scannerUrl.value = `${window.location.origin}/scanner/${tokenResult.token}`
      }
      
  </script>