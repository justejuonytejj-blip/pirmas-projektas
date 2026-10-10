# Mano vietos — projekto kontekstas

> Šis failas atnaujintas 2026-10-10 pagal naujausius pateiktus „Mano vietos“ šaltinio failus ir yra pagrindinis projekto konteksto aprašas. Jį reikia atnaujinti po reikšmingų projekto pakeitimų ar darbo sesijų.
>
> Jei šiame faile aprašyta informacija nesutampa su realiu projekto kodu, pirmenybė teikiama dabartiniam kodui.

## 1. Projekto apžvalga

**Projekto pavadinimas:** Mano vietos

„Mano vietos“ šiuo metu yra asmeninė React + Vite programėlė, skirta saugoti vietas, kuriose vartotojas jau buvo arba kurias norėtų aplankyti, ir padėti planuoti, ką aplankyti kelionėje.

Dabartinis tikslas — turėti paprastą ir patogią asmeninę vietų kolekciją, kurioje galima:
- išsisaugoti dominančias vietas;
- pažymėti, ar vieta jau aplankyta;
- matyti vietas pagal miestą ar šalį;
- lengviau prisiminti ir rasti jau išsaugotas vietas kelionės metu;
- palaipsniui plėsti programėlę taip, kad ji padėtų atrasti ir organizuoti vietas skirtinguose miestuose ir šalyse.

Kol kas projektas kuriamas asmeniniam naudojimui. Ateityje gali būti nuspręsta jį plėsti ir pritaikyti kitiems vartotojams, tačiau tai dar nėra dabartinės versijos reikalavimas.

## 2. Projekto kryptis

Trumpalaikė kryptis:
- išlaikyti programėlę paprastą ir aiškią;
- tobulinti vietų saugojimą, paiešką ir kelionių planavimą;
- palengvinti vietų paiešką pagal miestą ir šalį;
- neprarasti jau veikiančio funkcionalumo;
- išlaikyti dabartinę vizualinę kryptį.

Ilgalaikė galima kryptis:
- platesnė vietų paieška ir atradimas;
- patogesnis kelionių planavimas;
- daugiau informacijos apie vietas;
- galimybė projektą pritaikyti ne tik vienam vartotojui;
- galimas backend, autentifikacijos ar duomenų bazės pridėjimas, jei vėliau projektas bus plečiamas.

Šie ilgalaikiai punktai yra galimos kryptys, o ne jau suplanuotas ar įdiegtas funkcionalumas.

## 3. Dabartinis technologijų rinkinys

Patikrinta pagal 2026-10-10 pateiktus `package.json` ir `package-lock.json`:
- React `^19.2.8` ir React DOM `^19.2.8`;
- Vite `^8.3.0` ir `@vitejs/plugin-react` `^6.1.1`;
- JavaScript, JSX, React Hooks ir įprasti CSS failai;
- ESLint `^10.10.0`, `@eslint/js` `^10.0.1`, React Hooks / Refresh ESLint papildiniai.

Nenaudojami React Router, TypeScript, Tailwind ar atskira globalios būsenos biblioteka. `package.json` versijos su `^` yra leidžiami diapazonai, o `package-lock.json` fiksuoja įdiegtų priklausomybių versijas.

Pagrindinės komandos:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## 4. Projekto struktūra

Svarbiausi failai dabartiniame projekto `src/` aplanke:

```text
pirmas-projektas/ (arba dabartinis projekto aplankas)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── coast-background.png
│   │   └── places/
│   │       ├── cafe.png
│   │       └── castle-wide.png
│   ├── App.jsx
│   ├── App.css
│   ├── Rating.jsx
│   ├── Rating.css
│   ├── findPlaceImage.js
│   ├── matchLocation.js
│   ├── placeStorage.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── eslint.config.js
├── vite.config.js
├── README.md
├── agent.md
└── context.md
```

Šis sąrašas yra pateiktų failų ir importų pagrindu sudarytas struktūros orientyras, ne iš naujo patikrintas pilnas katalogo medis: visas projekto ZIP nebuvo pateiktas. `src/assets` gali turėti papildomų paveikslėlių. Gauti `dist` sugeneruoti failai (`index-*.js`, `index-*.css`, paveikslėliai su hash pavadinimu) nėra redaguotini React šaltiniai. `dist/`, `node_modules/` ir `.git/` nelaikyti aplikacijos logikos šaltiniais.

## 5. Programėlės įėjimo taškas

`src/main.jsx`:
- importuoja globalų `index.css`;
- importuoja `App`;
- aplikaciją renderina į `#root`;
- naudoja React `StrictMode`.

`index.html`:
- dokumento kalba nustatyta į lietuvių (`lang="lt"`);
- puslapio pavadinimas yra „Mano vietos“;
- React aplikacija montuojama į `#root`.

## 6. Pagrindinis komponentas — App.jsx

`src/App.jsx` yra pagrindinis programėlės komponentas. Jame yra `App`, vietos kortelės komponentas `PlaceRow` ir keli SVG ikonų komponentai.

`App` valdo:
- vietos pridėjimo formą (pavadinimas, kategorija, miestas, šalis, **pastabos**);
- bendrą `places` masyvą, naujų ir visų vietų sąrašus;
- vietų redagavimą ir šalinimą;
- būsenos „Noriu aplankyti“ / „Aplankyta“ keitimą;
- **mėgstamiausios vietos** (`favorite`) įjungimą ir išjungimą;
- vietų išsaugojimą `localStorage`;
- visų vietų paiešką pagal pavadinimą ir kategorijos filtrą;
- paveikslėlio automatinės paieškos paleidimą;
- `view` principu veikiančią navigaciją tarp `home` ir `all`;
- naują desktop **šoninę navigaciją** ir mobilų išskleidžiamą meniu.

Svarbios būsenos: `name`, `category`, `city`, `country`, `notes`, `places`, `view`, `navOpen`, `search`, `categoryFilter`. Naudojami `useState`, `useEffect`, `useLayoutEffect` ir `useRef`. `PlaceRow` lokaliai valdo trijų taškų meniu, redagavimo režimą ir pastabų išskleidimą.

Navigacija naudoja esamą React būseną `view`, **ne React Router**. Perjungimas neperkrauna puslapio.

## 7. Vietos duomenų modelis

Dabartinio kodo `normalizePlace()` naudojama vietos duomenų struktūra:

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

- `id` – unikalus identifikatorius (naujai vietai generuojamas `Date.now()`).
- `name`, `category`, `city`, `country` – vietos pavadinimas, kategorija, miestas ir šalis.
- `image` – paveikslėlio adresas / importuotas assetas arba `null`.
- `status` – `Noriu aplankyti` arba `Aplankyta`.
- **`favorite`** – `boolean`; `true` reiškia mėgstamiausią vietą, naujoms vietoms `false`.
- **`notes`** – tekstinės pastabos, naujoms vietoms pagal nutylėjimą tuščia eilutė.

Senų įrašų suderinamumas: `placeStorage.js` normalizuodamas trūkstamą `favorite` paverčia į `false`, o trūkstamas ar netinkamo tipo `notes` – į `''`.

## 8. Vietų būsenos

Naudojamos dvi būsenos:
- `Noriu aplankyti`
- `Aplankyta`

UI jos rodomos kaip:
- `❤️ Noriu aplankyti`
- `✅ Aplankyta`

Paspaudus būsenos žymą vietos kortelėje, būsena perjungiama iš vienos į kitą.

Nauja vieta pagal nutylėjimą gauna būseną `Noriu aplankyti`.

## 9. Vietų kategorijos

Dabartinės kategorijos:

1. 🍽️ Kavinės ir restoranai
2. 🏛️ Lankytinos vietos
3. 🌿 Gamta ir pasivaikščiojimai
4. 🏖️ Paplūdimiai ir poilsis
5. 🎡 Veiklos ir pramogos
6. 🛍️ Apsipirkimas
7. 🌙 Barai ir naktinis gyvenimas
8. 💆 SPA ir poilsis

`placeStorage.js` turi senesnių kategorijų pavadinimų normalizavimo logiką, kad anksčiau išsaugoti duomenys galėtų būti pritaikyti dabartinėms kategorijoms.

## 10. Duomenų saugojimas

Vietos saugomos **tik naršyklės `localStorage`**, naudojant tą patį raktą:

```text
mano-vietos-places
```

`placeStorage.js` eksportuoja `STORAGE_KEY`, `WANT_STATUS`, `VISITED_STATUS`, `PLACE_STATUSES`, `CATEGORIES`, `normalizeCategory`, `normalizeStatus`, `normalizePlace`, `loadPlaces`, `savePlaces`.

`loadPlaces()` skaito įrašus iš `localStorage`, normalizuoja senus laukus ir kategorijas; jei duomenų nėra arba jie netinkami, naudoja pradines vietas: „Pilies kavinė“ ir „Trakų pilis“. Svarbu: jei saugykloje yra **tuščias masyvas `[]`**, pavyzdinės vietos negrąžinamos. `savePlaces()` išsaugo normalizuotą masyvą JSON formatu.

`App.jsx` per `useEffect` išsaugo vietas, kai pasikeičia `places`. Išsaugomos ir naujos `favorite`, `notes` reikšmės.

Šiuo metu nėra savo backend, serverinės duomenų bazės, vartotojų prisijungimo ar sinchronizacijos tarp įrenginių. Naršyklės duomenų pašalinimas gali ištrinti įrašus. **Keičiant saugyklos struktūrą ar raktą reikia saugoti esamus vartotojo duomenis.**

## 11. Vietos pridėjimas

Pagrindiniame ekrane yra forma „Pridėti vietą“ su laukais:
- vietos pavadinimas (būtinas, tuščias pavadinimas neįrašomas);
- kategorija (viena iš 8);
- miestas ir šalis (gali būti tušti);
- **pastabos** (pasirenkamas tekstinis laukelis, skirtas įspūdžiams, patarimams ar priminimams).

Pridėjus vietą, sukuriamas `Date.now()` ID, nustatoma būsena `Noriu aplankyti`, `favorite: false`, išsaugomos apkarpytos `notes`, pradinis `image: null`. Įrašas iškart įtraukiamas į `places`, forma išvaloma, o `findPlaceImage()` asinchroniškai ieško nuotraukos. Gavus rezultatą atnaujinamas atitinkamos vietos paveikslėlis.

## 12. Vietos redagavimas ir ištrynimas

Vietos kortelėje trijų taškų meniu yra `Redaguoti` ir `Ištrinti`. Redaguojant galima pakeisti pavadinimą, kategoriją, miestą, šalį **ir pastabas**. Redagavimą galima atšaukti.

Jei pakeistas pavadinimas, miestas arba šalis, paveikslėlis laikinai nustatomas į `null` ir iš naujo ieškomas. Vien pastabų ar kategorijos pakeitimas šios paieškos nepaleidžia (tai dabartinė realaus kodo elgsena).

Meniu uždaromas paspaudus už jo ribų arba `Escape`. Vietos kortelėje galima:
- paspausti būsenos žymą ir ją perjungti;
- paspausti **žvaigždutę** ir pažymėti / nuimti mėgstamiausią vietą;
- perskaityti pastabų santrauką (iki 2 eilučių) ir esant ilgesniam tekstui pasirinkti **„Rodyti daugiau“ / „Rodyti mažiau“**.

Mėgstamiausios žvaigždutės funkcija nepriklauso nuo vietos būsenos.

## 13. Išsaugotų vietų sąrašas

Pagrindiniame ekrane rodomos trys naujausiai pridėtos vietos.

Prie sąrašo rodomas bendras išsaugotų vietų skaičius.

Mygtukas „Peržiūrėti visas vietas“ atidaro atskirą visų vietų vaizdą.

## 14. „Visos vietos“ vaizdas

Šoninės navigacijos arba „Peržiūrėti visas vietas“ mygtuku pasiekiamame vaizde:
- rodomos visos išsaugotos vietos, pradedant naujausia;
- galima ieškoti **pagal vietos pavadinimą**;
- galima filtruoti **pagal kategoriją**;
- galima redaguoti, trinti, keisti būseną, **žymėti mėgstamiausias**;
- rodomos vietų pastabos, prireikus išskleidžiamos;
- galima grįžti į „Pagrindinis“.

Svarbu: šiame vaizde **nėra atskiro mėgstamiausių ar būsenos filtro**; toks mėgstamiausių filtras yra „Kur keliaujam šiandien?“ paieškos rezultatuose. `openAllPlaces()` išvalo pavadinimo ir kategorijos filtrus.

## 15. „Kur keliaujam šiandien?“ funkcija

Nors failo pavadinimas `Rating.jsx`, jame yra `RandomPlace` – **išsaugotų vietų paieška pagal kelionės kryptį**, ne atsitiktinių vietų generatorius ir ne senoji emoji įvertinimo funkcija.

- Įvedamas miestas arba šalis, siūlymai (`datalist`) surenkami iš išsaugotų įrašų.
- Spustelėjus „Rodyti vietas“, ieškoma pagal `matchesDestination()`.
- Jei rasta vietų, rodomi rezultatų skaičiai ir **4 filtrai**: `Visos`, `❤️ Noriu aplankyti`, `✅ Aplankytos`, **`⭐ Mėgstamiausios`**.
- Mėgstamiausių filtras tikrina `place.favorite === true`.
- Rezultatų kortelės rodo pavadinimą, kategoriją, lokaciją, nuotrauką ir būseną.
- Tuščia užklausa: `Įrašykite miestą arba šalį.`; jei vietų nėra: `Šioje vietovėje tinkamų išsaugotų vietų dar nėra.`; jei filtras neranda rezultatų: `Tinkamų vietų nerasta.`

`Rating.css` apibrėžia šios skilties stilių. Komponento pavadinimas `RandomPlace` nereiškia, kad vietos parenkamos atsitiktinai.

## 16. Vietovių atpažinimas

`matchLocation.js`:
- normalizuoja tekstą į mažąsias raides;
- pašalina diakritinius ženklus;
- leidžia dalinius atitikmenis;
- naudoja kelis vietovių aliasus.

Pavyzdžiai:
- Lietuva ↔ Lithuania;
- Italija ↔ Italy / Italia;
- Ispanija ↔ Spain / España;
- Vilnius ↔ Vilniaus;
- Trakai ↔ Trakų;
- Nida ↔ Nidos;
- Klaipėda ↔ Klaipėdos.

`destinationOptions()` generuoja unikalų miestų ir šalių sąrašą iš išsaugotų vietų ir rikiuoja jį pagal lietuvišką lokalę.

## 17. Automatinė vietos paveikslėlio paieška

`findPlaceImage.js` bando automatiškai rasti tinkamą vietos paveikslėlį.

Naudojami šaltiniai:
- Wikimedia Commons;
- Wikipedia;
- Openverse.

Jei reikia, užklausa gali būti išversta iš lietuvių į anglų kalbą naudojant MyMemory vertimo API.

Paieška bando:
1. tikslų vietos pavadinimą su miestu ir šalimi;
2. kitus pavadinimo ir lokacijos derinius;
3. miesto ar šalies užklausą;
4. kategorijai tinkantį bendresnį paveikslėlį kaip fallback.

Yra:
- paprastas rezultatų vertinimas pagal žodžių atitikimą;
- lokacijos tikrinimas;
- kelių šalių pavadinimų vertimai;
- paveikslėlių užklausų cache atmintyje.

Svarbu: šis paveikslėlių paieškos mechanizmas priklauso nuo išorinių viešų API ir interneto ryšio.

## 18. Dizaino kryptis

**Dabartinę dizaino kryptį būtina išlaikyti**, nebent vartotojas aiškiai prašo ją pakeisti. Dabartiniai 2026-10-10 ekranvaizdžiai yra vizualinis orientyras.

- Pajūrio fotografija per visą ekraną (`coast-background.png`), kelionių nuotaika.
- **Desktop**: du stulpeliai – kairėje šviesi permatoma **šoninė navigacija** (~220 px), dešinėje siauras turinio stulpelis (iki ~500 px). Bendro išdėstymo plotis iki ~1080 px.
- `Pagrindinis` / `Visos vietos` pasirinkimai; aktyvus punktas paryškintas žalsvu fonu.
- Šviesios pusiau permatomos kortelės su `backdrop-filter: blur(10px)`, dideliais apvalinimais, subtiliais šešėliais.
- Vietos kortelėse yra mažos nuotraukos, būsenos žyma, mėgstamiausių žvaigždutė, papildomų veiksmų meniu ir (jei pridėtos) pastabos.
- Teal / melsvai žalias mygtukų akcentas, tamsiai mėlynas tekstas.
- Šriftas – `Plus Jakarta Sans`.

Pagrindiniai `index.css` kintamieji:

```css
--text: #5d7384;
--text-h: #163a56;
--accent: #2c8a96;
--accent-hover: #247a85;
--card: rgba(255, 255, 255, 0.86);
```

Dizainą realizuoja `App.css`, `Rating.css` ir `index.css`. Nereikia jo pakeisti į tamsią/violetinę kitame („Flowly“) projekte naudojamą temą.

## 19. Responsive dizainas

Responsive taisyklės yra `App.css` ir `Rating.css`.

- **Iki 720 px**: desktop šoninė navigacija paslepiama, atsiranda mobilus meniu (hamburgerio mygtukas); meniu uždaromas pasirinkus vaizdą, paspaudus išorėje arba `Escape`.
- **Iki 520 px**: mažinami paddingai, kortelių kampai; miesto ir šalies laukeliai pereina į vieną stulpelį; vietos kortelių išdėstymas perorganizuojamas, kad tilptų žvaigždutė, meniu ir statusas.
- **Iki 420 px** (`Rating.css`): mažinamos kelionės skilties iliustracijos ir koreguojamas turinio plotis.

Nauji pakeitimai turi išlikti patogūs desktop ir mobile. Mobilios navigacijos neprarasti.

## 20. Accessibility principai, jau esantys kode

Dabartiniame kode yra susieti formų `label` / `htmlFor`, `aria-label`, `aria-pressed` (būsenai ir mėgstamiausiam), `aria-expanded` (meniu), `aria-controls` (mobiliajai navigacijai), `aria-current="page"` (aktyviam navigacijos punktui), `role="menu"`, `role="menuitem"`, `role="tablist"`, `role="tab"`, `aria-selected`, `role="status"` ir `focus-visible` stiliai.

Naujuose pakeitimuose nepanaikinti esamo prieinamumo palaikymo. Ilgas pastabas rodyti skaitomas ir su valdomu išskleidimu.

## 21. Dabartinės techninės ribos

Šiuo metu projektas:
- yra frontend-only aplikacija;
- duomenis saugo tik toje naršyklėje, kurioje jie buvo sukurti;
- neturi autentifikacijos;
- neturi debesų sinchronizacijos;
- neturi savo backend;
- neturi tikros duomenų bazės;
- neturi React Router;
- neturi TypeScript;
- neturi Tailwind CSS;
- neturi globalios state management bibliotekos.

Tai nėra klaidos — tai dabartinės projekto apimties dalis.

## 22. Kodo ir architektūros principai

Kol nėra aiškios priežasties keisti:
- naudoti React + Vite;
- naudoti JavaScript ir JSX;
- naudoti funkcinius React komponentus;
- naudoti React Hooks;
- naudoti paprastus `.css` failus;
- nepridėti bibliotekų vien dėl patogumo;
- nekeisti į TypeScript be aiškaus sprendimo;
- nepridėti Tailwind be aiškaus sprendimo;
- vengti nereikalingo refaktorinimo;
- išlaikyti kodą suprantamą pradedančiajam;
- keisti tik tuos failus, kuriuos reikia keisti konkrečiai užduočiai.

Jei projektas vėliau smarkiai išaugs, šios taisyklės gali būti peržiūrėtos.

## 23. Vartotojo sąsajos kalba

Vartotojui matomas tekstas šiuo metu yra lietuvių kalba.

Naujas UI tekstas pagal nutylėjimą taip pat turi būti lietuvių kalba, nebent vartotojas aiškiai nusprendžia kitaip.

Kodo kintamųjų, funkcijų ir komponentų pavadinimai gali likti anglų kalba.

## 24. Svarbios dabartinės projekto taisyklės

1. Dabartinio dizaino krypties nekeisti be aiškaus vartotojo prašymo.
2. Neištrinti veikiančio funkcionalumo dėl refaktorinimo.
3. Prieš keičiant kodą tikrinti realius dabartinius projekto failus.
4. `context.md` yra projekto konteksto santrauka, bet realus kodas lieka galutinis techninės tiesos šaltinis.
5. Pasenęs `README.md` arba `agent.md` neturi būti laikomas patikimesniu už dabartinį kodą ir šį kontekstą.
6. Naujas funkcionalumas turi derėti su esama UI stilistika.
7. Projektas kol kas orientuotas į vieną vartotoją.
8. Backend, paskyros ir duomenų bazė nėra dabartinis reikalavimas.
9. Ateityje projektas gali būti išplėstas ir kitiems vartotojams, todėl nereikia priimti sprendimų, kurie be reikalo apsunkintų tokį plėtimą.

## 25. Dabartinė projekto būsena

**Pagal 2026-10-10 pateiktą šaltinio kodą implementuota:**
- vietos pridėjimas su pavadinimu, kategorija, miestu, šalimi ir **pastabomis**;
- 8 kategorijos ir senų jų pavadinimų normalizavimas;
- automatinė paveikslėlių paieška;
- `Noriu aplankyti` / `Aplankyta` būsenos;
- **mėgstamiausių vietų žvaigždutė** ir duomenų išsaugojimas;
- pastabų santrumpa ir **„Rodyti daugiau / mažiau“**;
- `localStorage` išsaugojimas (įskaitant `favorite` ir `notes`);
- naujausios 3 vietos pagrindiniame ekrane;
- atskiras visų vietų vaizdas, pavadinimo paieška ir kategorijos filtras;
- redagavimas, ištrynimas, būsenos ir mėgstamiausių keitimas;
- `Kur keliaujam šiandien?` paieška pagal miestą / šalį ir 4 rezultatų filtrai, įskaitant mėgstamiausias;
- **desktop šoninė navigacija** ir **mobilus hamburgerio meniu**;
- lietuviška vartotojo sąsaja, responsive / glassmorphism dizainas.

Pastaba: aukščiau nurodyta **iš kodo nustatyta funkcijų realizacija**, ne savarankiško paleidimo ar galutinio end-to-end testavimo rezultatai. Ekranvaizdyje rodomas vietų skaičius (pvz., 62) yra naršyklės duomenų būsena, ne iš anksto užkoduotas kiekis.

## 26. Dokumentacijos būsena

`README.md` atnaujintas 2026-10-10 pagal naujausią pateiktą šaltinio kodą. `agent.md` faile yra „Mano vietos“ AI taisyklės; prieš keitimų darbus remtis naujausiu kodu. `AGENTS.md` iš kito „Flowly“ projekto šiai programėlei nepriklauso.

Dokumentacijos autoriteto tvarka:
1. Dabartinis vykdomas **šaltinio kodas** – techninė tiesa;
2. Šis `context.md` – projekto funkcijų, krypties ir taisyklių santrauka;
3. `agent.md` / `AGENTS.md` – AI darbo taisyklės (jei jos neprieštarauja kodui ir vartotojo nurodymams);
4. `README.md` – naudotojui skirta apžvalga.

Svarbu nesumaišyti šio projekto su kitu „Flowly“ užduočių / autentifikacijos projektu, kurio failai taip pat buvo atsiųsti atskirai.

## 27. Kaip prižiūrėti context.md

Po kiekvienos reikšmingos darbo sesijos reikia peržiūrėti, ar pasikeitė:
- projekto tikslas;
- technologijos;
- failų struktūra;
- duomenų modelis;
- funkcionalumas;
- architektūra;
- dizaino taisyklės;
- išoriniai API;
- dabartinės ribos;
- artimiausi planai.

Jei pasikeitė — atnaujinti atitinkamą šio failo skyrių.

Nereikia kiekvieną kartą perrašyti viso failo. Keisti tik informaciją, kuri realiai pasikeitė.

## 28. Sprendimų žurnalas

### 2026-10-04
- Projektas apibrėžtas kaip asmeninė vietų saugojimo ir kelionių planavimo programėlė.
- Galima ateities plėtra kitiems vartotojams, tačiau autentifikacija / multi-user architektūra nebuvo dabartinis reikalavimas.
- Nuspręsta išlaikyti pajūrio ir kelionių dizaino kryptį.
- Pradėta tvarkyti `context.md`, vėliau planuota peržiūrėti `README.md` ir `agent.md`.

### 2026-10-10
- Pagal naujai pateiktus failus užfiksuota **šoninė navigacija** (`home` / `all`) desktop versijoje ir mobilus meniu iki 720 px.
- Užfiksuoti vietos modelio nauji laukai: `notes` ir `favorite`.
- Vietų kūrimo ir redagavimo formose yra pastabos, kortelėse galima jas išskleisti.
- Kortelėse pridėta mėgstamiausių žvaigždutė; `Rating.jsx` kelionių rezultatams pridėtas mėgstamiausių filtras.
- Patvirtinta, kad nauji duomenys vis dar saugomi tame pačiame `localStorage` rakte.
- Patvirtinta, kad projektas lieka React + Vite su JavaScript / JSX ir paprastu CSS (React `^19.2.8`, Vite `^8.3.0` patikrinta pagal `package.json`).
- Esamas programėlės kodas nekeistas; atnaujinti `context.md` ir `README.md`.

## 29. Paskutinės sesijos santrauka

### 2026-10-04
- Peržiūrėta tuometinė React + Vite struktūra, vietų CRUD ir `localStorage`.
- Užfiksuotos 8 kategorijos, 2 būsenos, vietovių atpažinimas, automatinė paveikslėlių paieška, esama UI kryptis.
- Pažymėta, kad dokumentaciją būtina derinti su naujausiu kodu.

### 2026-10-10
- Palygintas ankstesnis `context.md` su naujai pateiktais `App.jsx`, `App.css`, `Rating.jsx`, `Rating.css`, `placeStorage.js`, `matchLocation.js`, `findPlaceImage.js`, `main.jsx`, `index.css` ir `agent.md`.
- Pridėta informacija apie navigaciją, pastabas, mėgstamiausias vietas, naujas `localStorage` reikšmes ir responsive ribas.
- `dist` build failai atskirti nuo redaguotinų šaltinio failų.
- `package.json`, `package-lock.json`, `README.md`, `vite.config.js`, `eslint.config.js` ir `index.html` peržiūrėti; visas `src/assets` katalogas ir praktinis paleidimo / build testas netikrinti.
- `README.md` sinchronizuotas su šiuo kontekstu; dokumentus ateityje atnaujinti pasikeitus funkcijoms.

