import { apiFetch } from "@/utils/api"

export async function fetchProvinces() {
  try {
    const response = await apiFetch('regions/BARMM/provinces')

    return response
  } catch (e) {
    throw e
  }
}

export async function fetchMunicipalities(province: string) {
  try {
    const response = await apiFetch(`regions/BARMM/provinces/${encodeURIComponent(province ?? '')}/municipalities`)

    return response
  } catch (e) {
    throw e
  }
}

export async function fetchBarangays(province: string, municipality: string) {
  try {
    const response = await apiFetch(`regions/BARMM/provinces/${encodeURIComponent(province ?? '')}/municipalities/${encodeURIComponent(municipality ?? '')}/barangays`)

    return response
  } catch (e) {
    throw e
  }
}

export async function fetchPrecincts(province: string, municipality: string, barangay: string) {
  try {
    const response = await apiFetch(`barangays/${encodeURIComponent(barangay ?? '')}/voting-centers?reg=BARMM&prv=${encodeURIComponent(province ?? '').replace(/%20/g, '+')}&mun=${encodeURIComponent(municipality ?? '').replace(/%20/g, '+')}`)

    return response
  } catch (e) {
    throw e
  }
}
