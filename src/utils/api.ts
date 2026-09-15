export async function apiFetch(endpoint: string) {
  const url = `https://results.ppcrv.org/api/${endpoint}`

  const response = await fetch(url, {credentials: 'include'})
  return response.json()
}
