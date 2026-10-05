# Mano vietos

Asmeninė **React + Vite** programėlė vietoms saugoti, aplankytoms vietoms žymėti ir kelionių planavimui.

Programėlėje galima išsisaugoti dominančias vietas, nurodyti miestą ir šalį, pažymėti ar vieta jau aplankyta, ieškoti bei filtruoti išsaugotas vietas ir rasti, ką aplankyti pasirinktoje kelionės kryptyje.

## Funkcionalumas

Šiuo metu programėlėje galima:

- pridėti naują vietą;
- įvesti vietos pavadinimą, miestą ir šalį;
- pasirinkti vieną iš 8 kategorijų;
- pažymėti vietą kaip `Noriu aplankyti` arba `Aplankyta`;
- redaguoti išsaugotą vietą;
- ištrinti išsaugotą vietą;
- išsaugoti vietas naršyklės `localStorage`;
- matyti bendrą išsaugotų vietų skaičių;
- pagrindiniame ekrane matyti 3 naujausiai pridėtas vietas;
- atidaryti visų vietų sąrašą;
- ieškoti vietų pagal pavadinimą;
- filtruoti vietas pagal kategoriją;
- ieškoti išsaugotų vietų pagal miestą arba šalį;
- filtruoti kelionės paieškos rezultatus pagal būseną;
- automatiškai ieškoti vietai tinkamo paveikslėlio.

## Technologijos

Projektas naudoja:

- React 19;
- React DOM 19;
- Vite 8;
- JavaScript;
- JSX;
- React Hooks;
- CSS;
- ESLint.

Papildomi UI frameworkai ar state management bibliotekos nenaudojami.

## Projekto paleidimas

Reikalingas įdiegtas **Node.js** ir **npm**.

Įdiek projekto priklausomybes:

    npm install

Paleisk projektą:

    npm run dev

Vite terminale parodys lokalų adresą, kuriuo galima atidaryti programėlę naršyklėje.

### Kitos komandos

Sukurti produkcinę versiją:

    npm run build

Patikrinti kodą su ESLint:

    npm run lint

Peržiūrėti produkcinę versiją lokaliai:

    npm run preview

## Projekto struktūra

    pirmas-projektas/
    ├── dist/
    ├── node_modules/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── references/
    ├── src/
    │   ├── assets/
    │   │   ├── coast-background.png
    │   │   └── places/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── Rating.jsx
    │   ├── Rating.css
    │   ├── findPlaceImage.js
    │   ├── matchLocation.js
    │   ├── placeStorage.js
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── agent.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js

## Pagrindinis komponentas

### `src/App.jsx`

`App.jsx` yra pagrindinis programėlės komponentas.

Jis valdo:

- naujos vietos formą;
- vietų sąrašą;
- vietos pridėjimą;
- vietos redagavimą;
- vietos ištrynimą;
- vietos būsenos keitimą;
- vietų išsaugojimą;
- naujausių vietų rodymą;
- visų vietų vaizdą;
- paiešką pagal vietos pavadinimą;
- filtravimą pagal kategoriją;
- automatinės paveikslėlio paieškos paleidimą.

Pagrindinės React būsenos:

- `name`
- `category`
- `city`
- `country`
- `places`
- `view`
- `search`
- `categoryFilter`

## Vietos duomenų modelis

Kiekviena vieta turi tokią struktūrą:

    {
      id,
      name,
      category,
      city,
      country,
      image,
      status
    }

Laukų paskirtis:

- `id` — unikalus vietos identifikatorius;
- `name` — vietos pavadinimas;
- `category` — vietos kategorija;
- `city` — miestas;
- `country` — šalis;
- `image` — vietos paveikslėlio URL arba lokalus paveikslėlis;
- `status` — vietos būsena.

Naujos vartotojo pridėtos vietos ID generuojamas naudojant `Date.now()`.

## Vietų būsenos

Naudojamos dvi būsenos:

- `❤️ Noriu aplankyti`
- `✅ Aplankyta`

Naujai pridėta vieta automatiškai gauna būseną `Noriu aplankyti`.

Paspaudus būsenos žymą vietos kortelėje, būsena pakeičiama į kitą.

## Vietų kategorijos

Programėlėje naudojamos 8 kategorijos:

1. 🍽️ Kavinės ir restoranai
2. 🏛️ Lankytinos vietos
3. 🌿 Gamta ir pasivaikščiojimai
4. 🏖️ Paplūdimiai ir poilsis
5. 🎡 Veiklos ir pramogos
6. 🛍️ Apsipirkimas
7. 🌙 Barai ir naktinis gyvenimas
8. 💆 SPA ir poilsis

## Duomenų saugojimas

Vietos saugomos naršyklės `localStorage`.

Naudojamas raktas:

    mano-vietos-places

Už duomenų saugojimą atsakingas `src/placeStorage.js`.

Jis:

- saugo kategorijų sąrašą;
- saugo galimas vietų būsenas;
- normalizuoja vietų duomenis;
- suderina kai kuriuos senesnius kategorijų pavadinimus;
- užkrauna vietas iš `localStorage`;
- išsaugo vietas į `localStorage`.

Jeigu `localStorage` dar nėra duomenų arba išsaugoti duomenys netinkami, naudojamos dvi pradinės vietos:

- Pilies kavinė — Vilnius, Lietuva;
- Trakų pilis — Trakai, Lietuva.

## Vietos pridėjimas

Pagrindiniame ekrane yra forma „Pridėti vietą“.

Galima nurodyti:

- vietos pavadinimą;
- kategoriją;
- miestą;
- šalį.

Vietos pavadinimas yra būtinas.

Miestą ir šalį galima palikti tuščius.

Pridėjus vietą:

1. ji iš karto įtraukiama į vietų sąrašą;
2. jai priskiriama būsena `Noriu aplankyti`;
3. paveikslėlio reikšmė iš pradžių yra tuščia;
4. paleidžiama automatinė paveikslėlio paieška;
5. radus paveikslėlį vietos duomenys atnaujinami.

## Vietos redagavimas ir ištrynimas

Kiekviena vietos kortelė turi papildomų veiksmų meniu.

Galimi veiksmai:

- `Redaguoti`;
- `Ištrinti`.

Redaguojant vietą galima pakeisti:

- pavadinimą;
- kategoriją;
- miestą;
- šalį.

Jeigu pakeičiamas vietos pavadinimas, miestas arba šalis, senas paveikslėlis pašalinamas ir paleidžiama nauja paveikslėlio paieška.

Papildomų veiksmų meniu galima uždaryti:

- paspaudus už meniu ribų;
- paspaudus `Escape`.

## Išsaugotos vietos

Pagrindiniame ekrane rodoma:

- bendra išsaugotų vietų suma;
- 3 naujausiai pridėtos vietos.

Jeigu vietų nėra, rodomas pranešimas:

    Išsaugotų vietų dar nėra.

Mygtukas „Peržiūrėti visas vietas“ atidaro atskirą visų vietų vaizdą.

## „Visos vietos“ vaizdas

Visų vietų vaizde galima:

- matyti visas išsaugotas vietas;
- ieškoti pagal vietos pavadinimą;
- filtruoti pagal kategoriją;
- pakeisti vietos būseną;
- redaguoti vietą;
- ištrinti vietą;
- grįžti į pagrindinį ekraną.

Vietos rodomos nuo naujausiai pridėtos iki seniausios.

Jeigu pagal pasirinktą paiešką ar filtrą nieko nerandama, rodoma:

    Tinkamų vietų nerasta.

## „Kur keliaujam šiandien?“ funkcija

`src/Rating.jsx` šiuo metu naudojamas kelionės krypties paieškai.

Komponento pavadinimas kode yra `RandomPlace`.

Vartotojas gali įvesti miestą arba šalį ir paspausti:

    Rodyti vietas

Paieška tikrina:

- vietos miestą;
- šalį;
- vietos pavadinimą.

Įvedimo laukas taip pat siūlo miestus ir šalis iš jau išsaugotų vietų.

Paieškos rezultatus galima filtruoti:

- `Visos`;
- `❤️ Noriu aplankyti`;
- `✅ Aplankytos`.

Prie kiekvieno filtro rodomas atitinkančių vietų skaičius.

Jeigu paieškos laukas tuščias, rodoma:

    Įrašykite miestą arba šalį.

Jeigu pasirinktoje vietovėje išsaugotų vietų nėra, rodoma:

    Šioje vietovėje tinkamų išsaugotų vietų dar nėra.

## Vietovių atpažinimas

Už vietovių paiešką atsakingas `src/matchLocation.js`.

Paieškos tekstas:

- paverčiamas mažosiomis raidėmis;
- normalizuojamas;
- iš jo pašalinami diakritiniai ženklai;
- leidžiami daliniai atitikmenys.

Taip pat palaikomi keli miestų ir šalių variantai.

Pavyzdžiai:

- Lietuva ↔ Lithuania;
- Italija ↔ Italy / Italia;
- Ispanija ↔ Spain / España;
- Vilnius ↔ Vilniaus;
- Trakai ↔ Trakų;
- Nida ↔ Nidos;
- Klaipėda ↔ Klaipėdos.

`destinationOptions()` surenka unikalius miestų ir šalių pavadinimus iš išsaugotų vietų ir surikiuoja juos pagal lietuvišką lokalę.

## Automatinė vietos paveikslėlio paieška

Už automatinę paveikslėlio paiešką atsakingas `src/findPlaceImage.js`.

Naudojami šaltiniai:

- Wikimedia Commons;
- Wikipedia;
- Openverse.

Jeigu reikia, lietuviška paieškos užklausa gali būti išversta į anglų kalbą naudojant MyMemory vertimo API.

Paveikslėlio paieška pirmiausia bando naudoti:

- vietos pavadinimą;
- miestą;
- šalį;
- anglišką šalies pavadinimą.

Paieškos rezultatai vertinami pagal žodžių sutapimą ir vietovės informaciją.

Jeigu konkrečios vietos paveikslėlio rasti nepavyksta, bandoma:

1. ieškoti pagal miestą arba šalį;
2. naudoti kategorijai tinkantį bendresnį paveikslėlį.

Palaikomi kategorijų fallback paveikslėliai visoms 8 kategorijoms.

Paveikslėlių užklausos sesijos metu saugomos atminties cache, kad tos pačios užklausos nereikėtų kartoti.

Šiai funkcijai reikalingas interneto ryšys, nes naudojami išoriniai API.

## Dizainas

Programėlė turi pajūrio ir kelionių tematikos dizainą.

Pagrindiniai dizaino elementai:

- viso puslapio pajūrio foninis paveikslėlis;
- centruotas turinys;
- maksimalus pagrindinio turinio plotis apie `500px`;
- šviesios pusiau permatomos kortelės;
- `backdrop-filter: blur(10px)`;
- stipriai užapvalinti kampai;
- subtilūs šešėliai;
- tamsiai mėlyna pagrindinė tipografija;
- melsvai žalias akcentas;
- dideli formų laukeliai ir mygtukai.

Naudojamas šriftas:

- **Plus Jakarta Sans**

Pagrindinės spalvos:

- pagrindinis tekstas: `#163a56`;
- antrinis tekstas: `#5d7384`;
- pagrindinis akcentas: `#2c8a96`;
- hover akcentas: `#247a85`.

Programėlė naudoja šviesų `color-scheme`.

## Responsive dizainas

Programėlė pritaikyta mažesniems ekranams.

Pagrindinis responsive breakpoint:

    520px

Mažesniame ekrane:

- sumažinami puslapio tarpai;
- sumažinami kortelių paddingai;
- miesto ir šalies laukai iš dviejų stulpelių pereina į vieną;
- šiek tiek sumažinama vietos būsenos žyma.

„Kur keliaujam šiandien?“ komponentas turi papildomą breakpoint:

    420px

Jame mažesniame ekrane sumažinamas dekoratyvinis kelio ženklas ir antraštės dydis.

## Accessibility

Kode naudojami keli accessibility sprendimai:

- formų `label` susieti su laukais naudojant `htmlFor`;
- naudojami `aria-label`;
- naudojamas `aria-pressed`;
- naudojamas `aria-expanded`;
- naudojamas `aria-haspopup`;
- veiksmų meniu naudoja `role="menu"` ir `role="menuitem"`;
- būsenų filtrai naudoja `role="tab"` ir `aria-selected`;
- tuščios būsenos pranešimai naudoja `role="status"`;
- dekoratyviniai SVG elementai turi `aria-hidden="true"`;
- klaviatūros fokusui naudojamas `:focus-visible`.

Fokusuojamiems mygtukams, įvedimo laukams ir pasirinkimo laukams rodomas aiškus outline.

## Pagrindinis aplikacijos įėjimo taškas

`src/main.jsx`:

- importuoja globalų `index.css`;
- importuoja `App`;
- aplikaciją renderina į `#root`;
- naudoja React `StrictMode`.

## Dabartinės techninės ribos

Šiuo metu projektas:

- yra frontend-only aplikacija;
- duomenis saugo tik vartotojo naršyklėje;
- neturi vartotojų paskyrų;
- neturi prisijungimo ar autentifikacijos;
- neturi serverinės duomenų bazės;
- neturi debesų sinchronizacijos;
- neturi React Router;
- neturi TypeScript;
- neturi Tailwind CSS;
- neturi papildomos globalios state management bibliotekos.

Todėl skirtinguose įrenginiuose išsaugotos vietos automatiškai nesinchronizuojamos.