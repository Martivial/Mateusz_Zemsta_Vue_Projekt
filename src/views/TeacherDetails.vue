<template>


  <AppHeader title="Panel wykładowcy"/>
   <div class="mx-auto" style="max-width:1200px">
     <div class="d-flex justify-content-between align-items-center mx-auto mt-3" >

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

    <table class="table mt-3 table-striped">
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
</div>
  <ScannerQrModal :scannerUrl="scannerUrl" />
  </template>

  <script setup lang="ts">

import {ref} from 'vue'
import {onMounted} from 'vue'
import { useRoute} from 'vue-router'
import {Backend} from "@/main"
import AppHeader from '@/components/AppHeader.vue'
import ScannerQrModal from '@/components/ScannerQrModal.vue'

    const route = useRoute();
    const session = ref<any> (null)
    const attendance = ref<any[]> ([])
    const sessionId = Number(route.params.id)
    const scannerUrl = ref<string>('')

    onMounted(() => {
        loadSubjects()
        loadAtt()
        setInterval(()=> {loadAtt()}, 2000)
    })
 

    function loadSubjects() {
      Backend.courseTeacherSessionGet(sessionId)
      .then(result => {session.value = result})
    }
    
     function formatDate(start:Date, end: Date) {
      return {
        date: start.toLocaleDateString('pl-PL', {day: '2-digit', month: 'long', year: 'numeric'}),
        time: `${start.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})} -
         ${end.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'})}`
      }
     }

    function loadAtt() {
      Backend.courseSessionAttendanceListGet(sessionId)
      .then(result => {attendance.value = result})
      .catch(e => console.log("Nie udalo sie wygenerowac listy obecnosci" +e))
    }

    function openScanner() {
      Backend.courseSessionAttendanceScannerTokenGet(sessionId)
      .then(tokenResult => {scannerUrl.value = `${window.location.origin}/scanner/${tokenResult.token}`})
      .catch(e => console.log("Nie udało sie wygenerowac tokenu"+ e))

    }
  </script>