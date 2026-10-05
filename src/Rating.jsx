import { useState } from 'react'
import './Rating.css'
import { destinationOptions, matchesDestination } from './matchLocation.js'
import { VISITED_STATUS, WANT_STATUS } from './placeStorage.js'

function DiceIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

function Signpost() {
  return (
    <svg className="signpost" viewBox="0 0 72 56" aria-hidden="true">
      <rect x="34" y="8" width="4" height="44" rx="1.5" fill="#8d6a45" />
      <rect x="12" y="12" width="40" height="12" rx="3" fill="#2f8a8a" />
      <rect x="22" y="28" width="38" height="12" rx="3" fill="#e0a24a" />
      <path d="M52 12l8 6-8 6Z" fill="#2f8a8a" />
      <path d="M22 28l-8 6 8 6Z" fill="#e0a24a" />
    </svg>
  )
}

function Birds() {
  return (
    <svg className="birds" viewBox="0 0 48 18" aria-hidden="true">
      <path
        d="M4 11c3-2 5-2 8 0M10 8c2.2-1.6 3.8-1.6 6.2 0"
        fill="none"
        stroke="#7ea3b3"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M28 9c2.4-1.8 4-1.8 6.6 0M35 7c1.8-1.3 3.2-1.3 5.2 0"
        fill="none"
        stroke="#7ea3b3"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function statusLabel(status) {
  return status === VISITED_STATUS
    ? `✅ ${VISITED_STATUS}`
    : `❤️ ${WANT_STATUS}`
}

function RandomPlace({ places }) {
  const [destination, setDestination] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [emptyMessage, setEmptyMessage] = useState('')

  const options = destinationOptions(places)
  const matches = activeQuery
    ? places.filter((place) => matchesDestination(place, activeQuery))
    : []
  const wantCount = matches.filter(
    (place) => place.status !== VISITED_STATUS,
  ).length
  const visitedCount = matches.filter(
    (place) => place.status === VISITED_STATUS,
  ).length
  const visiblePlaces = matches.filter((place) => {
    if (statusFilter === 'want') return place.status !== VISITED_STATUS
    if (statusFilter === 'visited') return place.status === VISITED_STATUS
    return true
  })

  function showPlaces() {
    const query = destination.trim()

    if (!query) {
      setActiveQuery('')
      setStatusFilter('all')
      setEmptyMessage('Įrašykite miestą arba šalį.')
      return
    }

    setStatusFilter('all')
    setActiveQuery(query)

    const found = places.filter((place) => matchesDestination(place, query))
    setEmptyMessage(
      found.length === 0
        ? 'Šioje vietovėje tinkamų išsaugotų vietų dar nėra.'
        : '',
    )
  }

  return (
    <div className="rating">
      <div className="rating-copy">
        <h2>
          <span className="title-icon">
            <DiceIcon />
          </span>
          Kur keliaujam šiandien?
        </h2>
      </div>
      <div className="rating-art">
        <Birds />
        <Signpost />
      </div>

      <div className="rating-destination">
        <label htmlFor="travel-destination">Miestas arba šalis</label>
        <input
          id="travel-destination"
          type="text"
          list="travel-destinations"
          value={destination}
          onChange={(event) => {
            setDestination(event.target.value)
            setEmptyMessage('')
            setActiveQuery('')
            setStatusFilter('all')
          }}
          placeholder="Pvz. Klaipėda, Vilnius, Italija"
        />
        <datalist id="travel-destinations">
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <div className="rating-options">
        <button type="button" className="rating-option active" onClick={showPlaces}>
          Rodyti vietas
        </button>
      </div>

      {matches.length > 0 && (
        <>
          <div className="rating-filters" role="tablist" aria-label="Būsenos filtrai">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'all'}
              className={`rating-filter${statusFilter === 'all' ? ' active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              Visos
              <span>{matches.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'want'}
              className={`rating-filter${statusFilter === 'want' ? ' active' : ''}`}
              onClick={() => setStatusFilter('want')}
            >
              ❤️ Noriu aplankyti
              <span>{wantCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'visited'}
              className={`rating-filter${statusFilter === 'visited' ? ' active' : ''}`}
              onClick={() => setStatusFilter('visited')}
            >
              ✅ Aplankytos
              <span>{visitedCount}</span>
            </button>
          </div>

          {visiblePlaces.length > 0 ? (
            <ul className="place-list rating-results">
              {visiblePlaces.map((place) => (
                <li key={place.id} className="place">
                  {place.image ? (
                    <img className="place-photo" src={place.image} alt="" />
                  ) : (
                    <div
                      className="place-photo place-photo-pending"
                      aria-hidden="true"
                    />
                  )}
                  <div className="place-info">
                    <strong>{place.name}</strong>
                    <span>{place.category}</span>
                    {(place.city || place.country) && (
                      <span className="place-location">
                        {[place.city, place.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                  <span
                    className={`place-badge ${
                      place.status === VISITED_STATUS
                        ? 'place-badge-visited'
                        : 'place-badge-wish'
                    }`}
                  >
                    {statusLabel(place.status)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rating-empty" role="status">
              Tinkamų vietų nerasta.
            </p>
          )}
        </>
      )}

      {emptyMessage && (
        <p className="rating-empty" role="status">
          {emptyMessage}
        </p>
      )}
    </div>
  )
}

export default RandomPlace
