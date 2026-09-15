<template>
  <q-select v-model="value" label="Barangay" :options="options" :loading="isLoading" outlined clearable />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  form: {
    type: [Object],
    default: () => ({
      province: null,
      municipality: null
    })
  }
})

const options = ref([])
const isLoading = ref(true)
const value = defineModel()

const fetchBarangays = async() => {
  isLoading.value = true
  try {
    const response = await fetch(`/api/regions/BARMM/provinces/${encodeURIComponent(props.form.province ?? '')}/municipalities/${encodeURIComponent(props.form.municipality ?? '')}/barangays`)
    const data = await response.json()

    options.value = data
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.form.municipality,
  (newVal) => {
    if (!newVal) {
      value.value = null
      options.value = []
    } else {
      fetchBarangays()
    }
  }
)
</script>
