<script setup lang="ts">
import { Contest } from '@/types/result';
import type { ApexOptions } from 'apexcharts';
import { QCard, QCardSection } from 'quasar';
import { computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps<{
  width?: number,
  height?: number,
  contest: Contest|null,
  options?: ApexOptions
}>()

const options = computed<ApexOptions>(() => ({
  ...props.options,
  labels: props.contest?.candidates.map(x => x.name) ?? [],
  tooltip: {
    y: {
      formatter: x => Number(x).toLocaleString()
    }
  },
  plotOptions: {
    pie: {
      // borderRadius: 25
    }
  }
}))

const series = computed(() => props.contest?.candidates.map(x => x.votes))
</script>
<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h5">{{ contest?.name }}</div>
    </q-card-section>
    <q-card-section>
      <vue-apex-charts v-if="options && series && series?.length > 0" type="pie" :options="options" :series="series" :width="props.width ?? '100%'" :height="props.height ?? 'auto'" />
    </q-card-section>
  </q-card>
</template>
