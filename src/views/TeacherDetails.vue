<template>


  <header class="border-bottom">
    <div class="d-flex justify-content-between align-items-center pt-2 pb-2 mx-auto" style="max-width:1200px">

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
   
     <div class="d-flex justify-content-between align-items-center mx-auto mt-3" style="max-width:1200px">

      <div v-if="session">
      <h2>{{ session.courseName }}</h2>
      <p><b>Termin</b> {{ formatDate(session.dateStart, session.dateEnd).date }} </p>
      <p><b>Godziny</b> {{ formatDate(session.dateStart, session.dateEnd).time }} </p>
      <p><b>Grupa</b> {{ session.courseGroupName }} </p>
      <p><b>Lokalizacja</b> {{ session.locationName}} </p>
    </div>

    <div class="d-flex flex-column gap-4 justify-items-center">
      <button class="btn btn-primary bt-large">Skaner obecności</button>
      <button type="button" class="btn btn-secondary">Rejestracja urządzenia</button>
    </div>
    </div>
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
    

    onMounted(() => {
        loadUser()
        loadSubjects()
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
      const sessionId = Number(route.params.id)
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
  </script>