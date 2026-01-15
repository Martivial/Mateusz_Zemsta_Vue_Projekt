<template>
    <div><AppHeader title="Panel studenta" /></div>
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

 <ul class="list-unstyled">
  <li 
    v-for="lesson in Subjects" 
    :key="lesson.courseSessionId" 
    @click="navDetails(lesson.courseSessionId)" 
    class="mb-0"
  >
    <div 
      class="bg-light border rounded row mx-auto d-flex flex-column p-3 mb-0" 
      style="max-width:1200px;"
    >
      <span 
        class="rounded py-1 d-inline-block" 
        :class="lesson.dateEnd < new Date() ? 'bg-secondary text-white' : 'bg-warning'" 
        style="max-width:190px;"
      >
        {{ formatDate(lesson.dateStart, lesson.dateEnd) }}
      </span>
      <h5 class="pt-2">{{ lesson.courseName }}</h5>
      <span>{{ lesson.locationName }}</span>
      <span>{{ formatDate2(lesson.dateStart) }}</span>
    </div>
  </li>
</ul>
  


</template>

<script setup lang="ts">
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Backend} from "@/main"
import {dateReviver} from '@/helpers/JsonHelpers'
import {computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'



const router = useRouter()
const sessions = ref<any[]>([])
const filter = ref('all')
const searchText = ref('')


  onMounted(() => {loadSubjects()})


  async function loadSubjects() {
    try {
      const response = await Backend.courseStudentSessionsGet({pageNumber:1, pageSize:99999})
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

