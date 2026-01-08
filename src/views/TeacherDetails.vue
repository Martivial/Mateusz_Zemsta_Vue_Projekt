<template>


  <header class="border-bottom">
    <div class="d-flex justify-content-between align-items-center pt-2 pb-2 mx-auto" style="max-width:1000px">

      <div class="d-flex align-items-center">
      <img src="@/assets/icon.png" class="m-0" style="height:80px">
      <h3 class="">Panel wykładowcy</h3>
    </div>

  <div class="d-flex align-items-center gap-3 " >
        <p class="mb-0">{{ user?.name }} {{ user?.surname }} </p>
        <button class="btn btn-outline-danger btn-md" @click="logout">Wyloguj</button>
    </div>
    </div>
  </header>
   
     <div class="d-flex justify-content-between align-items-center mx-auto mt-3" style="max-width:1000px">

      <div v-if="session">
      <h3>{{ session.courseName }}</h3>
      <p class="small"><b>Termin</b> {{ formatDate(session.dateStart, session.dateEnd).date }} </p>
      <p class="small"><b>Godziny</b> {{ formatDate(session.dateStart, session.dateEnd).time }} </p>
      <p class="small"><b>Grupa</b> {{ session.courseGroupName }} </p>
      <p class="small"><b>Lokalizacja</b> {{ session.locationName}} </p>
    </div>

    <div class="d-flex flex-column gap-4 justify-items-center">
      <button class="btn btn-primary bt-large">Skaner obecności</button>
      <button type="button" class="btn btn-secondary">Rejestracja urządzenia</button>
    </div>
    </div>

    <table class="table mx-auto mt-3 table-striped" style="max-width:1000px">
  <thead class="table-dark">
    <tr>
      <th>Imię Nazwisko</th>
      <th>Nr indeksu</th>
      <th>Obecność</th>
      <th>Akcja</th>
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
      <td><button class="btn btn-dark btn-sm" @click="changePresent(a)">Zaznacz</button></td>
    </tr>
  </tbody>
</table>

  </template>

  <script setup lang="ts">

import {ref} from 'vue'
import {onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {Backend} from "@/main"
import {dateReviver} from '@/helpers/JsonHelpers'
import {computed } from 'vue'

    const route = useRoute();
    const router = useRouter();
    const user = ref<any> (null)
    const session = ref<any> (null)
    const attendance = ref<any[]> ([])
    const sessionId = Number(route.params.id)
    

    onMounted(() => {
        loadUser()
        loadSubjects()
        loadAtt()
    })
    function loadUser() {
      const user_data = sessionStorage.getItem('user')
      if(user_data) {user.value = JSON.parse(user_data)}
    }
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
      attendance.value = await Backend.courseSessionAttendanceListGet(sessionId)
      }
      console.log(attendance.value)
    
     
  </script>