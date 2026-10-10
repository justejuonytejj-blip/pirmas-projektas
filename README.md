# Mano vietos 🌊

**„Mano vietos“** – asmeninė lietuviška React + Vite programėlė, skirta išsaugoti vietas, kuriose jau buvai arba kurias norėtum aplankyti, ir lengviau susiplanuoti keliones. Projektas veikia naršyklėje, o duomenys išsaugomi jos `localStorage`.

## Ką galima daryti?

- **Pridėti vietą:** įrašyti pavadinimą, pasirinkti kategoriją, nurodyti miestą, šalį ir pastabas.
- **Valdyti vietas:** keisti informaciją, ištrinti įrašą, perjungti būseną tarp `❤️ Noriu aplankyti` ir `✅ Aplankyta`.
- **Pažymėti mėgstamiausias:** žvaigždutės mygtuku įjungti arba išjungti `favorite` žymą.
- **Skaityti pastabas:** ilgos pastabos kortelėje sutrumpinamos, jas galima išskleisti „Rodyti daugiau“ ir vėl suskleisti.
- **Matyti naujausias vietas:** pagrindiniame ekrane pateikiami trys naujausi įrašai ir bendras jų skaičius.
- **Atidaryti „Visos vietos“:** ieškoti pagal pavadinimą ir filtruoti pagal kategoriją.
- **Naudoti „Kur keliaujam šiandien?“:** įvesti miestą ar šalį, rasti toje vietovėje išsaugotas vietas ir filtruoti rezultatus: **Visos**, **Noriu aplankyti**, **Aplankytos**, **Mėgstamiausios**. Kiekvienas filtras rodo atitinkančių vietų skaičių.
- **Gauti automatiškai surastą paveikslėlį:** pridėjus vietą arba pakeitus jos pavadinimą / miestą / šalį, programa mėgina surasti nuotrauką per išorinius viešus šaltinius.

Sąsaja turi dvi skiltis – **Pagrindinis** ir **Visos vietos**. Kompiuteryje navigacija yra kairėje, mažesniuose ekranuose – išskleidžiamame meniu. Perjungimas vyksta React būsena (`view`), be puslapio perkrovimo ir be React Router.

## Vietų kategorijos

1. 🍽️ Kavinės ir restoranai
2. 🏛️ Lankytinos vietos
3. 🌿 Gamta ir pasivaikščiojimai
4. 🏖️ Paplūdimiai ir poilsis
5. 🎡 Veiklos ir pramogos
6. 🛍️ Apsipirkimas
7. 🌙 Barai ir naktinis gyvenimas
8. 💆 SPA ir poilsis

## Technologijos

- **React** `^19.2.8` ir **React DOM** `^19.2.8`
- **Vite** `^8.3.0` ir `@vitejs/plugin-react`
- **JavaScript**, **JSX**, React Hooks
- Įprastas **CSS** ir **ESLint** `^10.10.0`

Projekte nėra TypeScript, Tailwind CSS, React Router, serverio, duomenų bazės ar prisijungimo sistemos.

## Paleidimas kompiuteryje

Reikia **Node.js** ir **npm**. Atidaryk projekto aplanką terminale ir vykdyk:

```bash
npm install
npm run dev
```

Terminale pateiktą lokalų Vite adresą atidaryk naršyklėje (dažnai `http://localhost:5173/`).

Kitos komandos:

```bash
npm run build     # sukuria produkcinę versiją (dist/)
npm run preview   # vietinė sukompiliuotos versijos peržiūra
npm run lint      # ESLint patikra
```

## Projekto struktūra

```text
pirmas-projektas/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── coast-background.png
│   │   └── places/             # pavyzdžių paveikslėliai
│   ├── App.jsx                 # ekranai, vietų CRUD, navigacija
│   ├── App.css                 # puslapis, kortelės, responsive stiliai
│   ├── Rating.jsx              # „Kur keliaujam šiandien?“ komponentas
│   ├── Rating.css
│   ├── findPlaceImage.js       # automatinė paveikslėlių paieška
│   ├── matchLocation.js        # miestų / šalių atpažinimas
│   ├── placeStorage.js         # localStorage ir duomenų normalizavimas
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
├── README.md
├── agent.md
└── context.md
```

Tai pagrindinių failų orientyras pagal pateiktą šaltinio kodą, ne būtinai visas katalogo medis. `dist/` ir `node_modules/` yra sugeneruojami / įdiegiami, jų rankiniu būdu redaguoti nereikia.

## Kaip saugomi duomenys?

`src/placeStorage.js` naudoja `localStorage` raktą:

```text
mano-vietos-places
```

Vietos objektas turi šiuos laukus:

```js
{
  id,
  name,
  category,
  city,
  country,
  image,
  status,
  favorite,
  notes
}
```

- Nauja vieta gauna `Noriu aplankyti` būseną, `favorite: false` ir įvestas pastabas.
- Senesni įrašai normalizuojami: jei nėra mėgstamiausios žymos ar pastabų, naudojama `false` ir tuščia eilutė.
- Jei `localStorage` dar neturi įrašų arba jie negaliojantys, naudojami pavyzdžiai **Pilies kavinė** ir **Trakų pilis**.
- Vietos išsaugomos **tik toje naršyklėje / jos profilyje**. Duomenų sinchronizavimo tarp įrenginių nėra. Išvalius naršyklės svetainės duomenis, išsaugotos vietos gali dingti.

## Kaip veikia nuotraukos?

`findPlaceImage.js` bando surasti tinkamą paveikslėlį per **Wikimedia Commons**, **Wikipedia** ir **Openverse**. Prireikus užklausa gali būti verčiama naudojant **MyMemory** paslaugą. Tai priklauso nuo interneto, viešų API veikimo ir paieškos rezultatų – tinkama nuotrauka ne visada randama.

Pakeitus vietos **pavadinimą, miestą ar šalį**, ankstesnis paveikslėlis pašalinamas ir paleidžiama nauja paieška. Vien pakeitus pastabas ar kategoriją, automatinė pakartotinė nuotraukos paieška šiame kode nepaleidžiama.

## Dizainas

Dizainas paremtas pajūrio nuotrauka, šviesiomis pusiau permatomomis kortelėmis, „glassmorphism“ / `backdrop-filter: blur(...)` efektu, užapvalintais kampais, tamsiai mėlynu tekstu ir melsvai žaliu akcentu. Naudojamas **Plus Jakarta Sans** šriftas. Responsive taisyklės pritaiko išdėstymą mažiems ekranams.

## Techninės ribos ir ateities galimybės

Dabartinė programėlė yra **frontend-only**, skirta asmeniniam naudojimui; be autentifikacijos, backend, duomenų bazės ir debesų sinchronizacijos. Platesnė vietų paieška, bendrinimas ar kelių vartotojų paskyros – galimos ateities kryptys, **ne dabartinės funkcijos**.

## Dokumentacijos priežiūra

- **`context.md`** – išsamus projekto kontekstas Cursor / AI: struktūra, duomenys, taisyklės, techniniai sprendimai.
- **`README.md`** – suprantama projekto apžvalga ir paleidimo instrukcijos.
- **`agent.md`** – instrukcijos AI agentui, kurios neturi prieštarauti dabartiniam kodui.

**Paskutinį kartą atnaujinta:** 2026-10-10 pagal pateiktus šaltinio failus. Funkcijos aprašytos pagal kodą; atskiras veikiančios aplikacijos ar `npm run build` testas nebuvo atliktas.
