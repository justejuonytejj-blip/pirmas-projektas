import { normalizeCategory } from './placeStorage.js'

const imageCache = new Map()

const STOP_WORDS = new Set([
  'ir',
  'the',
  'of',
  'a',
  'an',
  'in',
  'on',
  'at',
  'to',
  'for',
  'su',
  'bei',
  'ar',
  'is',
  'and',
])

const COUNTRY_ENGLISH = {
  lietuva: 'Lithuania',
  lithuania: 'Lithuania',
  ispanija: 'Spain',
  spain: 'Spain',
  espana: 'Spain',
  italija: 'Italy',
  italy: 'Italy',
  italia: 'Italy',
  prancuzija: 'France',
  france: 'France',
  vokietija: 'Germany',
  germany: 'Germany',
  portugalija: 'Portugal',
  portugal: 'Portugal',
  graikija: 'Greece',
  greece: 'Greece',
  lenkija: 'Poland',
  poland: 'Poland',
  latvija: 'Latvia',
  latvia: 'Latvia',
  estija: 'Estonia',
  estonia: 'Estonia',
}

const LITHUANIA_HINTS = [
  'nida',
  'nidos',
  'neringa',
  'vilnius',
  'trakai',
  'klaipeda',
  'kaunas',
  'palanga',
  'lietuva',
  'lithuania',
  'lithuanian',
]

const CATEGORY_QUERIES = {
  '🍽️ Kavinės ir restoranai': [
    'cafe restaurant terrace',
    'coffee shop interior',
  ],
  '🏛️ Lankytinos vietos': [
    'historic landmark architecture',
    'famous monument sightseeing',
  ],
  '🌿 Gamta ir pasivaikščiojimai': [
    'nature hiking trail landscape',
    'forest walk scenery',
  ],
  '🏖️ Paplūdimiai ir poilsis': [
    'sandy beach coastline',
    'seaside resort beach',
  ],
  '🎡 Veiklos ir pramogos': [
    'amusement park attraction',
    'outdoor activity recreation',
  ],
  '🛍️ Apsipirkimas': [
    'shopping street market',
    'city shops boulevard',
  ],
  '🌙 Barai ir naktinis gyvenimas': [
    'night city bar lights',
    'nightlife street evening',
  ],
  '💆 SPA ir poilsis': [
    'spa wellness resort',
    'relaxing spa pool',
  ],
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

function tokens(value) {
  return normalize(value)
    .split(' ')
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
}

function uniqueQueries(values) {
  const seen = new Set()
  const result = []

  for (const value of values) {
    const trimmed = (value || '').trim()
    const key = normalize(trimmed)
    if (!trimmed || seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }

  return result
}

function englishCountry(country) {
  return COUNTRY_ENGLISH[normalize(country)] || ''
}

function wikipediaLangs(country) {
  const key = normalize(country)
  if (key === 'lietuva' || key === 'lithuania') return ['lt', 'en']
  if (key === 'ispanija' || key === 'spain' || key === 'espana') return ['es', 'en']
  if (key === 'italija' || key === 'italy' || key === 'italia') return ['it', 'en']
  if (key === 'prancuzija' || key === 'france') return ['fr', 'en']
  if (key === 'vokietija' || key === 'germany') return ['de', 'en']
  if (key) return ['en', 'lt']
  return ['lt', 'en']
}

function tokenMatches(haystack, token) {
  if (haystack.includes(token)) return true
  if (token.length > 4 && haystack.includes(token.slice(0, -1))) return true
  if (token.length > 5 && haystack.includes(token.slice(0, -2))) return true
  return false
}

function scoreMatch(haystack, query) {
  const queryTokens = tokens(query)
  if (queryTokens.length === 0) return 0

  const hay = normalize(haystack)
  const hits = queryTokens.filter((token) => tokenMatches(hay, token)).length
  return hits / queryTokens.length
}

function locationConflict(haystack, { city, country }) {
  const hay = normalize(haystack)
  const query = normalize([city, country].filter(Boolean).join(' '))
  const queryIsLithuania = LITHUANIA_HINTS.some((hint) => query.includes(hint))

  if (queryIsLithuania) return false

  return LITHUANIA_HINTS.some((hint) => hay.includes(hint))
}

function isGoodMatch(haystack, query, context, minScore) {
  if (!haystack) return false
  if (locationConflict(haystack, context)) return false

  const score = scoreMatch(haystack, query)
  const nameScore = context.name ? scoreMatch(haystack, context.name) : 0
  const locationQuery = [context.city, context.country].filter(Boolean).join(' ')
  const locationScore = locationQuery ? scoreMatch(haystack, locationQuery) : 0
  const locationTokens = tokens(locationQuery)

  if (context.requireLocation && locationTokens.length > 0 && locationScore < 0.34) {
    return false
  }

  return score >= minScore || nameScore >= 0.5 || (nameScore >= 0.3 && locationScore >= 0.34)
}

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) return null

  return response.json()
}

function wikipediaSearchUrl(lang, query) {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`)
  url.searchParams.set('action', 'query')
  url.searchParams.set('generator', 'search')
  url.searchParams.set('gsrsearch', query)
  url.searchParams.set('gsrlimit', '10')
  url.searchParams.set('prop', 'pageimages')
  url.searchParams.set('piprop', 'thumbnail')
  url.searchParams.set('pithumbsize', '800')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')
  return url
}

async function searchWikipedia(query, lang, context, minScore = 0.4) {
  const data = await fetchJson(wikipediaSearchUrl(lang, query))
  const pages = Object.values(data?.query?.pages || {})

  const ranked = pages
    .filter((page) => page.thumbnail?.source)
    .map((page) => ({
      url: page.thumbnail.source,
      score: scoreMatch(page.title, query),
      title: page.title,
    }))
    .filter((item) => isGoodMatch(item.title, query, context, minScore))
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.url || null
}

async function searchCommons(query, context, minScore = 0.45) {
  const url = new URL('https://commons.wikimedia.org/w/api.php')
  url.searchParams.set('action', 'query')
  url.searchParams.set('generator', 'search')
  url.searchParams.set('gsrsearch', query)
  url.searchParams.set('gsrnamespace', '6')
  url.searchParams.set('gsrlimit', '12')
  url.searchParams.set('prop', 'imageinfo')
  url.searchParams.set('iiprop', 'url|mime')
  url.searchParams.set('iiurlwidth', '800')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')

  const data = await fetchJson(url)
  const pages = Object.values(data?.query?.pages || {})
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

  const ranked = pages
    .map((page) => {
      const info = page.imageinfo?.[0]
      if (!info || !allowed.has(info.mime)) return null

      const haystack = `${page.title} ${info.url || ''}`
      return {
        url: info.thumburl || info.url,
        score: Math.max(scoreMatch(page.title, query), scoreMatch(info.url || '', query)),
        haystack,
      }
    })
    .filter((item) => item && isGoodMatch(item.haystack, query, context, minScore))
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.url || null
}

async function searchOpenverse(query, context, minScore = 0.5) {
  const url = new URL('https://api.openverse.org/v1/images/')
  url.searchParams.set('q', query)
  url.searchParams.set('page_size', '8')
  url.searchParams.set('mature', 'false')

  const data = await fetchJson(url)
  const results = data?.results || []

  const ranked = results
    .filter((item) => item.url)
    .map((item) => ({
      url: item.url,
      score: Math.max(
        scoreMatch(item.title || '', query),
        scoreMatch(item.foreign_landing_url || '', query),
      ),
      haystack: `${item.title || ''} ${item.foreign_landing_url || ''}`,
    }))
    .filter((item) => isGoodMatch(item.haystack, query, context, minScore))
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.url || null
}

async function translateToEnglish(query) {
  const url = new URL('https://api.mymemory.translated.net/get')
  url.searchParams.set('q', query)
  url.searchParams.set('langpair', 'lt|en')

  const data = await fetchJson(url)
  const translated = data?.responseData?.translatedText?.trim()

  if (!translated) return null
  if (normalize(translated) === normalize(query)) return null

  return translated
}

async function firstHit(lookups) {
  for (const lookup of lookups) {
    try {
      const image = await lookup()
      if (image) return image
    } catch {
      // Try the next source if one API is unavailable.
    }
  }

  return null
}

async function searchSources(query, context, minScore) {
  const langs = wikipediaLangs(context.country)
  const image = await firstHit([
    () => searchCommons(query, context, minScore),
    ...langs.map((lang) => () => searchWikipedia(query, lang, context, minScore)),
    () => searchOpenverse(query, context, minScore),
  ])

  if (image) return image

  try {
    const translated = await translateToEnglish(query)
    if (!translated) return null

    return firstHit([
      () => searchCommons(translated, context, minScore),
      () => searchWikipedia(translated, 'en', context, minScore),
      () => searchOpenverse(translated, context, minScore),
    ])
  } catch {
    return null
  }
}

function buildSpecificQueries({ name, city, country }) {
  const countryEn = englishCountry(country)

  return uniqueQueries([
    [name, city, country].filter(Boolean).join(', '),
    [name, city, countryEn].filter(Boolean).join(', '),
    [name, city].filter(Boolean).join(', '),
    [name, country].filter(Boolean).join(', '),
    [name, countryEn].filter(Boolean).join(', '),
    name,
  ])
}

function buildLocationQueries({ city, country }) {
  const countryEn = englishCountry(country)

  return uniqueQueries([
    [city, country].filter(Boolean).join(', '),
    [city, countryEn].filter(Boolean).join(', '),
    city,
    countryEn,
    country,
  ])
}

async function searchCategoryImage(category) {
  const queries = CATEGORY_QUERIES[normalizeCategory(category)] || []
  const context = { name: '', city: '', country: '', requireLocation: false }

  for (const query of queries) {
    const image = await firstHit([
      () => searchCommons(query, context, 0.2),
      () => searchOpenverse(query, context, 0.2),
      () => searchWikipedia(query, 'en', context, 0.2),
    ])
    if (image) return image
  }

  return null
}

export async function findPlaceImage(place) {
  const name = (place?.name || '').trim()
  const city = (place?.city || '').trim()
  const country = (place?.country || '').trim()
  const category = place?.category || ''

  if (!name && !city && !country) return null

  const cacheKey = normalize([name, city, country, category].join('|'))
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey)

  const specificContext = { name, city, country, requireLocation: false }
  for (const query of buildSpecificQueries({ name, city, country })) {
    const image = await searchSources(query, specificContext, 0.4)
    if (image) {
      imageCache.set(cacheKey, image)
      return image
    }
  }

  const locationContext = {
    name: city || country,
    city,
    country,
    requireLocation: true,
  }
  for (const query of buildLocationQueries({ city, country })) {
    const image = await searchSources(query, locationContext, 0.45)
    if (image) {
      imageCache.set(cacheKey, image)
      return image
    }
  }

  const categoryImage = await searchCategoryImage(category)
  imageCache.set(cacheKey, categoryImage || null)
  return categoryImage || null
}
