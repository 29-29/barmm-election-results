<template>
  <q-page class="q-mx-sm q-gutter-y-sm">
    <div class="row q-gutter-sm">
      <province-select v-model="form.province" class="col" @update:model-value="reloadChart" />
      <municipality-select v-model="form.municipality" :province="form.province" class="col" @update:model-value="reloadChart" />
      <barangay-select v-model="form.barangay" :form="form" class="col" @update:model-value="reloadChart" />
      <precinct-select v-model="form.precinct" :form="form" class="col" @update:model-value="reloadChart" />
    </div>

    <div class="row q-gutter-x-sm">
      <q-card flat bordered class="col">
        <q-card-section>
          <div class="text-h5">Voter Distribution</div>
        </q-card-section>
        <q-card-section>
          <q-spinner v-if="!chartLoaded" />
          <vue-apex-charts v-if="chartLoaded && series.length > 0" type="donut" :options="options" :series="series" :key="chartKey"></vue-apex-charts>
        </q-card-section>
      </q-card>
      <contest-pie-chart :contest="contests[0] ?? null" :options="{legend: {position: 'bottom'}}" class="col" />
    </div>

    <!-- CONTESTS -->

    <q-card flat bordered>
      <q-card-section class="q-gutter-y-sm">
        <div class="text-h5">PARLIAMENTARY SECTORAL REPRESENTATIVE</div>
        <div class="row wrap q-gutter-x-sm">
          <contest-pie-chart v-for="sector in sectoralContests" :contest="sector" :options="{legend: {show: false}}" class="col-12 col-sm-6 col-md" style="min-width: 220px;" />
        </div>
      </q-card-section>
    </q-card>

    <!-- LEGISLATIVE CONTESTS -->

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h5 q-mb-sm">LEGISLATIVE DISTRICT REPRESENTATIVE</div>
        <div class="row q-col-gutter-md">
          <div class="col-3" v-for="district in legislativeContests" >
            <contest-pie-chart :contest="district" :options="{legend: {show: false}}" />
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import { fetchBarangays, fetchMunicipalities, fetchPrecincts, fetchProvinces } from '@/api/functions';
import BarangaySelect from '@/components/barangaySelect.vue';
import ContestPieChart from '@/components/contestPieChart.vue';
import MunicipalitySelect from '@/components/municipalitySelect.vue';
import PrecinctSelect from '@/components/precinctSelect.vue';
import ProvinceSelect from '@/components/provinceSelect.vue';
import { Contest, Result } from '@/types/result';
import { apiFetch } from '@/utils/api';
import { ApexOptions } from 'apexcharts';
import { QCard, QCardSection, QSpinner } from 'quasar';
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const form = reactive({
  province: null,
  municipality: null,
  barangay: null,
  precinct: null
})

const getLevel = () => {
  return form.province ? (form.municipality ? (form.barangay ? (form.precinct ? 'precinct' : 'barangay') : 'municipality') : 'province') : 'region'
}

const results = ref<Result | null>(null)
const contests = computed<Contest[]>(() => results.value?.contests ?? [])
const sectoralContests = computed<Contest[]>(() => {
  let initialContests = contests.value.filter(x => x.category == "PARLIAMENTARY SECTORAL REPRESENTATIVE") ?? []
  initialContests.forEach(c => {
    switch (c.name) {
      case "PARLIAMENTARY SECTORAL REPRESENTATIVE FOR SETTLER COMMUNITIES of BARMM":
        c.name = "Settler Communities"
        break
      case "PARLIAMENTARY SECTORAL REPRESENTATIVE FOR WOMEN of BARMM":
        c.name = "Women"
        break
      case "PARLIAMENTARY SECTORAL REPRESENTATIVE FOR YOUTH of BARMM":
        c.name = "Youth"
        break
      case "PARLIAMENTARY SECTORAL REPRESENTATIVE FOR THE ULAMA of BARMM":
        c.name = "Ulama"
        break
      case "PARLIAMENTARY SECTORAL REPRESENTATIVE FOR THE TRADITIONAL LEADERS of BARMM":
        c.name = "Traditional Leaders"
    }
  })
  return initialContests
})

const legislativeContests = computed<Contest[]>(() => {
  let initialContests = contests.value.filter(x => x.category == 'LEGISLATIVE DISTRICT REPRESENTATIVE') ?? []
  const regex = /\s+-\s+([^-]+?|.+?)\s+-\s+(.+)$/
  initialContests.forEach(c => {
    const match = c.name.match(regex)
    if (match) {
      let province = match[1]?.trim()
      switch (province) {
        case 'BASILAN':
          province = 'Basilan'
          break
        case 'LANAO DEL SUR':
          province = 'Lanao del Sur'
          break
        case 'TAWI-TAWI':
          province = 'Tawi-Tawi'
          break
        case 'MAGUINDANAO DEL NORTE':
          province = 'Maguindanao del Norte'
          break
        case 'MAGUINDANAO DEL SUR':
          province = 'Maguindanao del Sur'
          break
        case 'CITY OF COTABATO':
          province = 'City of Cotabato'
          break
        case 'SPECIAL GEOGRAPHIC AREA':
          province = 'Special Geographic Area (SGA)'
          break
      }

      let district = match[2]?.trim()
      switch (district) {
        case 'FIRST PARLIAMENTARY DISTRICT':
          district = '1st District'
          break
        case 'SECOND PARLIAMENTARY DISTRICT':
          district = '2nd District'
          break
        case 'THIRD PARLIAMENTARY DISTRICT':
          district = '3rd District'
          break
        case 'FOURTH PARLIAMENTARY DISTRICT':
          district = '4th District'
          break
        case 'FIFTH PARLIAMENTARY DISTRICT':
          district = '5th District'
          break
        case 'SIXTH PARLIAMENTARY DISTRICT':
          district = '6th District'
          break
        case 'SEVENTH PARLIAMENTARY DISTRICT':
          district = '7th District'
          break
        case 'EIGTHT PARLIAMENTARY DISTRICT':
          district = '8th District'
          break
        case 'NINTH PARLIAMENTARY DISTRICT':
          district = '9th District'
          break
      }

      c.name = `${province} ${district}`
    }
  })
  return initialContests
})

const fetchResults = async() => {
  let level = form.province ? (form.municipality ? (form.barangay ? (form.precinct ? 'precinct' : 'barangay') : 'municipality') : 'province') : 'region'

  const query = `results?level=${level}&` +
  (level == 'region'
    ? `reg=BARMM`
    : level == 'province'
    ? `prv=${encodePlus(form.province ?? '')}`
    : level == 'municipality'
    ? `mun=${encodePlus(form.municipality ?? '')}`
    : level == 'barangay'
    ? `brgy=${encodePlus(form.barangay ?? '')}`
    : level == 'precinct'
    ? `vc=${encodePlus(form.precinct ?? '')}` : ''
  )

  const response = await apiFetch(query)
  results.value = response
}

const encodePlus = (s:string) => encodeURIComponent(s).replace(/%20/g, '+')

const fetchVoterDistrib = async (level: string, form: {province: string|null, municipality: string|null, barangay: string|null}) => {
  let query = `results?level`
  let subUnits = []

  // level determination
  let queryLevel = ''
  let identifier = ''
  if (level == 'region') {
    subUnits = await fetchProvinces()
    queryLevel = 'province'
    identifier = 'prv'
  } else if (level == 'province' && form.province) {
    subUnits = await fetchMunicipalities(form.province)
    queryLevel = 'municipality'
    identifier = 'mun'
  } else if (level == 'municipality' && form.province && form.municipality) {
    subUnits = await fetchBarangays(form.province, form.municipality)
    queryLevel = 'barangay'
    identifier = 'brgy'
  } else if (level == 'barangay' && form.province && form.municipality && form.barangay) {
    subUnits = await fetchPrecincts(form.province, form.municipality, form.barangay)
    queryLevel = 'precinct'
    identifier = 'vc'
  }

  // specifier
  let specifier = `reg=BARMM`
  if (form.province) {
    specifier += `&prv=${encodePlus(form.province)}`
    if (form.municipality) {
      specifier += `&mun=${encodePlus(form.municipality)}`
      if (form.barangay) {
        specifier += `&brgy=${encodePlus(form.barangay)}`
      }
    }
  }

  // getting sub units
  const voters = Promise.all(
    subUnits.map(async (u: string) => {
      try {
        const response = await apiFetch(`${query}=${queryLevel}&${specifier}&${identifier}=${encodePlus(u)}`)
        const data = response

        return {
          name: u,
          voters: data.contests[0]?.totalVotes ?? 0
        }
      } catch (e) {
        console.error(e)
        return {
          name: u, voters: 0
        }
      }
    }
  ))
  return voters
}

const series = ref<number[]>([])
const options = ref<ApexOptions>({
  labels: [],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Voters',
            showAlways: true,
            formatter: (w) => {
              const total = w.globals.seriesTotals.reduce((a:number, b:number) => a+b, 0)
              return total.toLocaleString()
            }
          },
        }
      }
    }
  },
  tooltip: {
    y: {
      formatter: (val) => Number(val).toLocaleString()
    }
  },
  legend: {
    position: 'bottom'
  }
})
const chartLoaded = ref(false)
const chartKey = ref(0)

const getPieChartSeries = async () => {
  fetchVoterDistrib(getLevel(), form)
    .then(response => {
      if (response && response.length > 0) {
        series.value = response.map(u => u.voters)
        options.value = {...options.value, labels: response.map(u => u.name)}
      } else {
        series.value = []
        options.value = {...options.value, labels: []}
      }
    })
    .finally(() => {
      chartLoaded.value = true
    })
}

const reloadChart = async () => {
  chartLoaded.value = false
  try {
    await getPieChartSeries()
    await fetchResults()
  } catch (e) {
    console.error(e)
  } finally {
    await nextTick()
    chartLoaded.value = true
  }
}

onMounted(async () => {
  reloadChart()
})
</script>
