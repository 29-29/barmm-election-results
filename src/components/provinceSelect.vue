<template>
  <q-select v-model="province" label="Province" :options="provinces" :loading="isLoading" outlined clearable />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchProvinces } from '@/api/functions'


const provinces = ref([])
const isLoading = ref(true)
const province = defineModel()

const fetchData = async() => {
  isLoading.value = true
  try {
    const data = await fetchProvinces()

    provinces.value = data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
