export const STORAGE_KEY = 'mano-vietos-places'

export const WANT_STATUS = 'Noriu aplankyti'
export const VISITED_STATUS = 'Aplankyta'

export const PLACE_STATUSES = [WANT_STATUS, VISITED_STATUS]

export const CATEGORIES = [
  '🍽️ Kavinės ir restoranai',
  '🏛️ Lankytinos vietos',
  '🌿 Gamta ir pasivaikščiojimai',
  '🏖️ Paplūdimiai ir poilsis',
  '🎡 Veiklos ir pramogos',
  '🛍️ Apsipirkimas',
  '🌙 Barai ir naktinis gyvenimas',
  '💆 SPA ir poilsis',
]

const CATEGORY_ALIASES = {
  'kavines ir restoranai': '🍽️ Kavinės ir restoranai',
  'lankytinos vietos': '🏛️ Lankytinos vietos',
  'keliones ir lankytinos vietos': '🏛️ Lankytinos vietos',
  'gamta ir pasivaiksciojimai': '🌿 Gamta ir pasivaikščiojimai',
  'papludimiai ir poilsis': '🏖️ Paplūdimiai ir poilsis',
  'veiklos ir pramogos': '🎡 Veiklos ir pramogos',
  'apsipirkimas': '🛍️ Apsipirkimas',
  'barai ir naktinis gyvenimas': '🌙 Barai ir naktinis gyvenimas',
  'spa ir poilsis': '💆 SPA ir poilsis',
}

function categoryKey(value) {
  return (value || '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function normalizeCategory(category) {
  if (CATEGORIES.includes(category)) return category

  const mapped = CATEGORY_ALIASES[categoryKey(category)]
  return mapped || category || ''
}

export function normalizeStatus(status) {
  return status === VISITED_STATUS ? VISITED_STATUS : WANT_STATUS
}

export function normalizePlace(place) {
  return {
    id: place.id,
    name: place.name || '',
    category: normalizeCategory(place.category),
    city: place.city || '',
    country: place.country || '',
    image: place.image || null,
    status: normalizeStatus(place.status),
  }
}

export function loadPlaces(fallbackPlaces) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return fallbackPlaces.map(normalizePlace)

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return fallbackPlaces.map(normalizePlace)

    return parsed.map(normalizePlace)
  } catch {
    return fallbackPlaces.map(normalizePlace)
  }
}

export function savePlaces(places) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(places.map(normalizePlace)),
  )
}
