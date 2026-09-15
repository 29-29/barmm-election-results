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

const partyColors = {
  'UBJP': '#2a7115',
  'BFP': '#2a4383',
  'BGC': '#fac82a',
  'MAHARDIKA': '#9ca3af',
  'RAAYAT DEMOCRATIC PARTY': '#43de79',
  'BAPA': '#ff0000',
  'PRO BANGSAMORO PARTY': '#3a9f5b',
  'MORO AKO': '#705507',
  'BEST PARTY': '#a87731'
}

const getPartyColor = (key: string | undefined): string => {
  if (key && key in partyColors) {
    return partyColors[key as keyof typeof partyColors];
  }
  return '#9ca3af'; // Fallback gray
};

const computedColors = computed(() => {
  return props.contest?.candidates.map(c => {
    if (props.contest?.category == 'BARMM REGIONAL PARLIAMENT') {
      if (c.name in partyColors) {return getPartyColor(c.name)}
      else return '#9ca3af'
    } else {
      const match = c.name.match(/\(([^)]+)\)/)
      if (match) {
        const extracted = match[1];
        return getPartyColor(extracted)
      } else return '#9ca3af'
    }
  })
})

const options = computed<ApexOptions>(() => ({
  ...props.options,
  labels: props.contest?.candidates.map(x => x.name) ?? [],
  colors: computedColors.value?.filter(((c): c is string => Boolean(c))) ?? [],
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
