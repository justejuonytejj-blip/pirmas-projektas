import { useEffect, useRef, useState } from 'react'
import './App.css'
import RandomPlace from './Rating.jsx'
import { findPlaceImage } from './findPlaceImage.js'
import {
  CATEGORIES,
  loadPlaces,
  savePlaces,
  VISITED_STATUS,
  WANT_STATUS,
} from './placeStorage.js'
import coastBg from './assets/coast-background.png'
import cafeImg from './assets/places/cafe.png'
import castleImg from './assets/places/castle-wide.png'

const EXAMPLE_PLACES = [
  {
    id: 1,
    name: 'Pilies kavinė',
    category: '🍽️ Kavinės ir restoranai',
    city: 'Vilnius',
    country: 'Lietuva',
    status: WANT_STATUS,
    image: cafeImg,
  },
  {
    id: 2,
    name: 'Trakų pilis',
    category: '🏛️ Lankytinos vietos',
    city: 'Trakai',
    country: 'Lietuva',
    status: WANT_STATUS,
    image: castleImg,
  },
]

function PinIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
      />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v16.1a.75.75 0 0 1-1.2.6L12 16.4l-4.8 4.05a.75.75 0 0 1-1.2-.6V3.75Z"
      />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg className="more-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="18" cy="12" r="1.7" fill="currentColor" />
    </svg>
  )
}

function PlaceRow({ place, onSave, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(place.name)
  const [editCategory, setEditCategory] = useState(place.category)
  const [editCity, setEditCity] = useState(place.city || '')
  const [editCountry, setEditCountry] = useState(place.country || '')
  const menuRef = useRef(null)
  const isVisited = place.status === VISITED_STATUS

  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function startEdit() {
    setEditName(place.name)
    setEditCategory(place.category)
    setEditCity(place.city || '')
    setEditCountry(place.country || '')
    setEditing(true)
    setMenuOpen(false)
  }

  function cancelEdit() {
    setEditing(false)
    setEditName(place.name)
    setEditCategory(place.category)
    setEditCity(place.city || '')
    setEditCountry(place.country || '')
  }

  async function saveEdit(event) {
    event.preventDefault()

    const trimmedName = editName.trim()
    if (!trimmedName) return

    await onSave(place.id, {
      name: trimmedName,
      category: editCategory,
      city: editCity.trim(),
      country: editCountry.trim(),
      previousName: place.name,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="place place-editing">
        {place.image ? (
          <img className="place-photo" src={place.image} alt="" />
        ) : (
          <div className="place-photo place-photo-pending" aria-hidden="true" />
        )}
        <form className="place-edit" onSubmit={saveEdit}>
          <label htmlFor={`edit-name-${place.id}`}>Vietos pavadinimas</label>
          <input
            id={`edit-name-${place.id}`}
            type="text"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
          />
          <label htmlFor={`edit-category-${place.id}`}>Kategorija</label>
          <select
            id={`edit-category-${place.id}`}
            value={editCategory}
            onChange={(event) => setEditCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor={`edit-city-${place.id}`}>Miestas</label>
          <input
            id={`edit-city-${place.id}`}
            type="text"
            value={editCity}
            onChange={(event) => setEditCity(event.target.value)}
            placeholder="Pvz. Vilnius"
          />
          <label htmlFor={`edit-country-${place.id}`}>Šalis</label>
          <input
            id={`edit-country-${place.id}`}
            type="text"
            value={editCountry}
            onChange={(event) => setEditCountry(event.target.value)}
            placeholder="Pvz. Lietuva"
          />
          <div className="place-edit-actions">
            <button type="button" className="place-edit-cancel" onClick={cancelEdit}>
              Atšaukti
            </button>
            <button type="submit" className="place-edit-save">
              Išsaugoti
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="place">
      {place.image ? (
        <img className="place-photo" src={place.image} alt="" />
      ) : (
        <div className="place-photo place-photo-pending" aria-hidden="true" />
      )}
      <div className="place-info">
        <strong>{place.name}</strong>
        <span>
          {place.category}
        </span>
        {(place.city || place.country) && (
          <span className="place-location">
            {[place.city, place.country].filter(Boolean).join(', ')}
          </span>
        )}
      </div>
      <button
        type="button"
        className={`place-badge ${isVisited ? 'place-badge-visited' : 'place-badge-wish'}`}
        aria-pressed={isVisited}
        aria-label={`${place.name}: ${isVisited ? VISITED_STATUS : WANT_STATUS}. Pakeisti būseną`}
        onClick={() =>
          onStatusChange(
            place.id,
            isVisited ? WANT_STATUS : VISITED_STATUS,
          )
        }
      >
        {isVisited ? '✅ Aplankyta' : '❤️ Noriu aplankyti'}
      </button>
      <div className="place-menu" ref={menuRef}>
        <button
          type="button"
          className="place-menu-toggle"
          aria-label={`Daugiau veiksmų: ${place.name}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MoreIcon />
        </button>
        {menuOpen && (
          <div className="place-menu-list" role="menu">
            <button type="button" role="menuitem" onClick={startEdit}>
              Redaguoti
            </button>
            <button
              type="button"
              role="menuitem"
              className="place-menu-delete"
              onClick={() => onDelete(place.id)}
            >
              Ištrinti
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

function App() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [places, setPlaces] = useState(() => loadPlaces(EXAMPLE_PLACES))
  const [view, setView] = useState('home')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    savePlaces(places)
  }, [places])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) return

    const id = Date.now()
    const selectedCategory = category
    const trimmedCity = city.trim()
    const trimmedCountry = country.trim()

    setPlaces((current) => [
      ...current,
      {
        id,
        name: trimmedName,
        category: selectedCategory,
        city: trimmedCity,
        country: trimmedCountry,
        status: WANT_STATUS,
        image: null,
      },
    ])

    setName('')
    setCategory(CATEGORIES[0])
    setCity('')
    setCountry('')

    const image = await findPlaceImage({
      name: trimmedName,
      city: trimmedCity,
      country: trimmedCountry,
      category: selectedCategory,
    })

    setPlaces((current) =>
      current.map((place) => (place.id === id ? { ...place, image } : place)),
    )
  }

  async function handleSavePlace(id, updates) {
    let previous = null

    setPlaces((list) => {
      previous = list.find((place) => place.id === id)
      return list.map((place) =>
        place.id === id
          ? {
              ...place,
              name: updates.name,
              category: updates.category,
              city: updates.city,
              country: updates.country,
              image:
                updates.name !== updates.previousName ||
                updates.city !== (previous?.city || '') ||
                updates.country !== (previous?.country || '')
                  ? null
                  : place.image,
            }
          : place,
      )
    })

    const shouldRefreshImage =
      updates.name !== updates.previousName ||
      updates.city !== (previous?.city || '') ||
      updates.country !== (previous?.country || '')

    if (!shouldRefreshImage) return

    const image = await findPlaceImage({
      name: updates.name,
      city: updates.city,
      country: updates.country,
      category: updates.category,
    })

    setPlaces((list) =>
      list.map((place) => (place.id === id ? { ...place, image } : place)),
    )
  }

  function handleDeletePlace(id) {
    setPlaces((current) => current.filter((place) => place.id !== id))
  }

  function handleStatusChange(id, nextStatus) {
    setPlaces((current) =>
      current.map((place) =>
        place.id === id ? { ...place, status: nextStatus } : place,
      ),
    )
  }

  function openAllPlaces() {
    setSearch('')
    setCategoryFilter('all')
    setView('all')
  }

  const recentPlaces = [...places].slice(-3).reverse()
  const filteredPlaces = [...places].reverse().filter((place) => {
    const query = search.trim().toLowerCase()
    const matchesName = place.name.toLowerCase().includes(query)
    const matchesCategory =
      categoryFilter === 'all' || place.category === categoryFilter
    return matchesName && matchesCategory
  })

  const placeList = (items) => (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceRow
          key={place.id}
          place={place}
          onSave={handleSavePlace}
          onDelete={handleDeletePlace}
          onStatusChange={handleStatusChange}
        />
      ))}
    </ul>
  )

  return (
    <main className="page">
      <img className="page-bg" src={coastBg} alt="" />
      <section className="places">
        {view === 'all' ? (
          <>
            <header className="intro">
              <h1>Visos vietos</h1>
              <svg className="wave" viewBox="0 0 120 12" aria-hidden="true">
                <path
                  d="M2 8c8-8 16 8 24 0s16 8 24 0 16 8 24 0 16 8 24 0 16 8 24 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <p>Ieškok ir filtruok visas išsaugotas vietas.</p>
            </header>

            <div className="saved-places">
              <div className="list-header">
                <h2>
                  <span className="title-icon">
                    <BookmarkIcon />
                  </span>
                  Visos vietos
                </h2>
                <span>{places.length}</span>
              </div>

              <div className="places-filters">
                <label htmlFor="place-search">Paieška</label>
                <input
                  id="place-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ieškoti pagal pavadinimą"
                />
                <label htmlFor="place-filter">Kategorija</label>
                <select
                  id="place-filter"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="all">Visos kategorijos</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {filteredPlaces.length > 0 ? (
                placeList(filteredPlaces)
              ) : (
                <p className="places-empty">Tinkamų vietų nerasta.</p>
              )}

              <button
                type="button"
                className="back-home"
                onClick={() => setView('home')}
              >
                Grįžti
              </button>
            </div>
          </>
        ) : (
          <>
        <header className="intro">
          <h1>Atrask vietas</h1>
          <svg className="wave" viewBox="0 0 120 12" aria-hidden="true">
            <path
              d="M2 8c8-8 16 8 24 0s16 8 24 0 16 8 24 0 16 8 24 0 16 8 24 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <p>
            Išsaugok vietas, kuriose buvai arba kurias norėtum aplankyti.
          </p>
        </header>

        <form className="card add-card" onSubmit={handleSubmit}>
          <h2>
            <span className="title-icon">
              <PinIcon />
            </span>
            Pridėti vietą
          </h2>

          <label htmlFor="place-name">Vietos pavadinimas</label>

          <input
            id="place-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Pvz. Nidos kopos"
          />

          <label htmlFor="place-category">Kategorija</label>

          <select
            id="place-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="add-location">
            <div>
              <label htmlFor="place-city">Miestas</label>
              <input
                id="place-city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Pvz. Klaipėda"
              />
            </div>
            <div>
              <label htmlFor="place-country">Šalis</label>
              <input
                id="place-country"
                type="text"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="Pvz. Lietuva"
              />
            </div>
          </div>

          <button type="submit">
            <span className="btn-plus" aria-hidden="true">
              +
            </span>
            Pridėti
          </button>
        </form>

        <div className="saved-places">
          <div className="list-header">
            <h2>
              <span className="title-icon">
                <BookmarkIcon />
              </span>
              Išsaugotos vietos
            </h2>
            <span>{places.length}</span>
          </div>
          {recentPlaces.length > 0 ? (
            placeList(recentPlaces)
          ) : (
            <p className="places-empty">Išsaugotų vietų dar nėra.</p>
          )}
          <button type="button" className="view-all" onClick={openAllPlaces}>
            Peržiūrėti visas vietas
            <span>{places.length}</span>
          </button>
        </div>

        <RandomPlace places={places} />
          </>
        )}
      </section>
    </main>
  )
}

export default App
