export async function fetchProvinces() {
  try {
    const response = await fetch('/api/regions/BARMM/provinces')
    const data = await response.json()

    return data
  } catch (e) {
    throw e
  }
}

export async function fetchMunicipalities(province: string) {
  try {
    const response = await fetch(`/api/regions/BARMM/provinces/${encodeURIComponent(province ?? '')}/municipalities`)
    const data = await response.json()

    return data
  } catch (e) {
    throw e
  }
}

export async function fetchBarangays(province: string, municipality: string) {
  try {
    const response = await fetch(`/api/regions/BARMM/provinces/${encodeURIComponent(province ?? '')}/municipalities/${encodeURIComponent(municipality ?? '')}/barangays`)
    const data = await response.json()

    return data
  } catch (e) {
    throw e
  }
}

export async function fetchPrecincts(province: string, municipality: string, barangay: string) {
  try {
    const response = await fetch(`/api/barangays/${encodeURIComponent(barangay ?? '')}/voting-centers?reg=BARMM&prv=${encodeURIComponent(province ?? '').replace(/%20/g, '+')}&mun=${encodeURIComponent(municipality ?? '').replace(/%20/g, '+')}`)
    const data = await response.json()

    return data
  } catch (e) {
    throw e
  }
}
