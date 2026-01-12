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
   <div style="max-width:300px">
      <input type="text" v-model="searchText" class="form-control" placeholder="Przedmiot, grupa, lokalizacja" style="width: 280px;">
    </div>
</div>

 <div v-for="lesson in Subjects" :key="lesson.courseSessionId" @click="navDetails(lesson.courseSessionId)"> 

    <div class="bg light mt-3 border rounded row mx-auto d-flex flex-column p-3" style="max-width:1200px">
      <span class="rounded py-1 " :class="lesson.dateEnd < new Date() ? 'bg-secondary text-white' : 'bg-warning'" style="max-width:190px;">{{formatDate(lesson.dateStart, lesson.dateEnd)}}</span>
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
const searchText = ref('')


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
       
      let filterMatch = false;
      if(filter.value === 'today') { filterMatch= x.dateStart.toDateString() === now.toDateString()}
      if(filter.value === 'future') { filterMatch= date_subject > now}
      if(filter.value === 'past') {filterMatch = date_subject < now}

     if (filter.value === 'week') {
    const startWeek = new Date(now)  
    startWeek.setHours(0,0,0,0)      

    const endWeek = new Date(now)    
    endWeek.setDate(now.getDate() + (7 - now.getDay()))  
    endWeek.setHours(23,59,59,999)  

    return date_subject >= startWeek && date_subject <= endWeek
  }
    if(filter.value === "all") {filterMatch= true}

  let textMatch = true;

  if(searchText.value.trim() !== '') {
    const text = searchText.value.toLowerCase()
    textMatch =  x.courseName.toLowerCase().includes(text) ||
    x.courseGroupName.toLowerCase().includes(text) ||
    x.locationName.toLowerCase().includes(text)
  }

  return filterMatch && textMatch
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
