<template>


  <header class="border-bottom">
    <div class="d-flex justify-content-between align-items-center p-3 mx-auto " style="max-width:1200px">

      <div class="d-flex align-items-center">
      <img src="@/assets/icon.png" style="height:80px">
      <h3 class="">Panel wykładowcy</h3>
    </div>

  <div class="d-flex align-items-center gap-3 " >
        <p class="mb-0">{{ user?.name }} {{ user?.surname }} </p>
        <button class="btn btn-outline-danger btn-md" @click="logout">Wyloguj</button>
    </div>
    </div>
  </header>
  

   <div class="d-flex justify-content-between align-items-center bg-light p-3 border mx-auto mt-3 rounded" style="max-width:1200px">
    <div>
    <h5>Filtry</h5>
    <select class="form-select" v-model="filter">
      <option value="today">Dzisiaj</option>
      <option value="week">Bieżący tydzień</option>
      <option value="future">Przyszłe</option>
      <option value="past">Minione</option>
      <option value="all">Wszystkie</option>
    </select>
  </div>
   <div class="d-flex align-items-center gap-2">
      <input type="text" class="form-control" placeholder="Szukaj po przedmiocie lub lokalizacji">
      <button class="btn btn-primary">Szukaj</button>
    </div>
</div>

 <div class="" v-for="lesson in Subjects" :key="lesson.courseSessionId" @click="navDetails(lesson.courseSessionId)"> 

    <div class="bg light mt-3 border rounded row mx-auto d-flex flex-column p-3" style="max-width:1200px">
      <span class="bg-warning rounded py-1" style="max-width:180px;">{{formatDate(lesson.dateStart, lesson.dateEnd)}}</span>
        <h5 class="pt-2">{{ lesson.courseName }}</h5>
          <span class="align-self-end">{{lesson.courseGroupName }}</span>
          <span>{{lesson.locationName}}</span>
             <span class="" >{{formatDate2(lesson.dateStart)}}</span>
    </div>

  </div>


</template>

<script setup lang="ts">
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Backend} from "@/main"
import {dateReviver} from '@/helpers/JsonHelpers'
import {computed } from 'vue'


const router = useRouter()
const user = ref<any>(null)
const sessions = ref<any[]>([])
const filter = ref('all')


  onMounted( function() {
    const user_data = sessionStorage.getItem('user')
    if(user_data) { user.value = JSON.parse(user_data)}
   console.log(user_data)
  
  loadSubjects()
  })

  function logout() {
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  async function loadSubjects() {
    try {
      const response = await Backend.courseTeacherSessionsGet({pageNumber:1, pageSize:99999})
      sessions.value = JSON.parse(JSON.stringify(response.items), dateReviver)
      console.log(sessions.value)
    }
    catch { console.error("blad pobierania zajec")}
  }

  const Subjects = computed(() => {

    return sessions.value.filter(x => {
      
      const now = new Date()
      const date_subject = x.dateStart  

      if(filter.value === 'today') { return x.dateStart.toDateString() === now.toDateString()}
      if(filter.value === 'future') { return date_subject > now}
      if(filter.value === 'past') {return date_subject < now}

     if (filter.value === 'week') {
    const startWeek = new Date(now)  // dziś
    startWeek.setHours(0,0,0,0)      // początek dnia

    const endWeek = new Date(now)    // niedziela
    endWeek.setDate(now.getDate() + (7 - now.getDay()))  // ile dni do niedzieli
    endWeek.setHours(23,59,59,999)  // koniec dnia

    return date_subject >= startWeek && date_subject <= endWeek
  }
    })
  })
  function formatDate(start: Date, end: Date)
   {
      const day = start.toLocaleString('pl-PL', {weekday:'long'})
      const sTime = start.toLocaleString('pl-PL', {hour: '2-digit', minute: '2-digit'})
      const eTime = end.toLocaleString('pl-PL', {hour: '2-digit', minute: '2-digit'} )
      return `${day} ${sTime} - ${eTime}`
    }
  
    function formatDate2(date: Date)
   {
      const month = date.toLocaleString('pl-PL', { day: '2-digit', month:'2-digit', year: 'numeric'})

      return  `${month}`
    }

    function navDetails(sessionId: number)
    {
      router.push({name: 'TeacherDetails', params: {id: sessionId}})
    }
</script>
