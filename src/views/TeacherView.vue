<template>


  <header class="border-bottom">
    <div class="d-flex justify-content-between align-items-center p-3 mx-auto " style="max-width:1200px">

      <div class="d-flex align-items-center">
      <img src="@/assets/icon.png" style="height:80px">
      <h3 class="">Pulpit wykładowcy</h3>
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
      <option value="month">Bieżący miesiąc</option>
      <option value="today">Dzisiaj</option>
      <option value="week">Bieżący tydzień</option>
      <option value="future">Przyszłe</option>
      <option value="past">Minione</option>
      <option value="all">Wszystkie</option>
    </select>
  </div>
   <div class="d-flex align-items-center gap-2">
      <input type="text" class="form-control" placeholder="Szukaj po przedmiocie lub lokalizacji"">
      <button class="btn btn-primary">Szukaj</button>
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

     if (filter.value === 'month') {
       const startMonth = new Date(now)
        startMonth.setHours(0,0,0,0)

       const endMonth = new Date(startMonth.getFullYear(), startMonth.getMonth() + 1, 0)
       endMonth.setHours(23,59,59,999)

        return date_subject >= startMonth && date_subject <= endMonth
       }

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

  function formatDayTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleString('pl-PL', options)
}

function formatTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
  return new Date(date).toLocaleTimeString('pl-PL', options)
}

function openDetails(session: any) {
  alert(`Szczegóły zajęć:\n${session.courseName}\n${session.courseGroupName}\nLokalizacja: ${session.locationName}`)
}

</script>
