<template>
  <q-select v-model="municipality" label="Municipality" :options="municipalities" :loading="isLoading" outlined clearable />
</template>

<script setup lang="ts">
import { fetchMunicipalities } from '@/api/functions'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  province: {
    type: [String, null],
    default: null
  }
})

const municipalities = ref([])
const isLoading = ref(true)
const municipality = defineModel()

const fetchOptions = async() => {
  isLoading.value = true
  try {
    const data = await fetchMunicipalities(props.province ?? '')

    municipalities.value = data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.province,
  (newVal) => {
    if (!newVal) {
      municipality.value = null
      municipalities.value = []
    } else {
      fetchOptions()
    }
  }
)
</script>
