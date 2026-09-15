<template>
  <q-select v-model="value" label="Precinct" :options="options" :loading="isLoading" outlined clearable />
</template>

<script setup lang="ts">
import { fetchPrecincts } from '@/api/functions'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  form: {
    type: [Object],
    default: () => ({
      province: null,
      municipality: null,
      barangay: null
    })
  }
})

const options = ref([])
const isLoading = ref(true)
const value = defineModel()

const fetchData = async() => {
  isLoading.value = true
  try {
    const data = await fetchPrecincts(props.form.province, props.form.municipality, props.form.barangay)

    options.value = data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.form.barangay,
  (newVal) => {
    if (!newVal) {
      value.value = null
      options.value = []
    } else {
      fetchData()
    }
  }
)
</script>
