const LOCATION_ALIASES = {
  lietuva: ['lithuania', 'lietuvos', 'lt'],
  lithuania: ['lietuva', 'lietuvos'],
  italija: ['italy', 'italia'],
  italy: ['italija', 'italia'],
  italia: ['italija', 'italy'],
  ispanija: ['spain', 'espana'],
  spain: ['ispanija', 'espana'],
  vilnius: ['vilniaus'],
  vilniaus: ['vilnius'],
  trakai: ['traku'],
  traku: ['trakai'],
  nida: ['nidos'],
  nidos: ['nida'],
  klaipeda: ['klaipedos'],
}

function normalize(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function expandQuery(query) {
  const normalized = normalize(query)
  if (!normalized) return []

  const aliases = LOCATION_ALIASES[normalized] || []
  return [normalized, ...aliases.map(normalize)]
}

function fieldMatches(field, queries) {
  if (!field) return false

  for (const query of queries) {
    if (query.length < 3) continue
    if (field === query) return true
    if (field.includes(query) || query.includes(field)) return true
  }

  return false
}

export function matchesDestination(place, destination) {
  const queries = expandQuery(destination)
  if (queries.length === 0) return false

  const fields = [place.city, place.country, place.name].map(normalize)
  return fields.some((field) => fieldMatches(field, queries))
}

export function destinationOptions(places) {
  const values = new Set()

  for (const place of places) {
    if (place.city?.trim()) values.add(place.city.trim())
    if (place.country?.trim()) values.add(place.country.trim())
  }

  return [...values].sort((a, b) => a.localeCompare(b, 'lt'))
}
