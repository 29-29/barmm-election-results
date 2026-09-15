import { defineBoot } from '#q-app'
import VueApexCharts from 'vue3-apexcharts'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({app}) => {
  app.use(VueApexCharts)
})
