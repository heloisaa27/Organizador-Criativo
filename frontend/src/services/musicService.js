const BASE_URL = "https://corsproxy.io/?https://api.deezer.com"

export async function getTrendingMusicas() {
    const res = await fetch(`${BASE_URL}/chart`)
    const data = await res.json()
    return data.tracks?.data || []
}

export async function searchMusicas(query) {
    if (!query) return []

    const res = await fetch(`${BASE_URL}/search?q=${query}`)
    const data = await res.json()
    return data.data || []
}
