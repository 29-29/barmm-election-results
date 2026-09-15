import { defineBoot } from '#q-app'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://results.ppcrv.org/api'
})

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(async ({app}) => {
  // something to do
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

})

export {axios, api}
