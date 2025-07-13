# Experiments Directory

Welkom in de `/src/experiments` map! Hier werk je aan alle losse Three.js/R3F experimenten voor deze applicatie.

## 🔹 Werkwijze
- **Elk experiment is een eigen `.tsx` bestand** in deze map.
- **Je hoeft alleen in deze map te werken**: voeg nieuwe experimenten toe, pas bestaande aan, of verwijder experimenten.
- **Experimenteer vrij**: gebruik React Three Fiber, Drei, postprocessing, etc. volgens de projectstandaarden.

## 🔹 Automatische integratie
- **Experiments worden automatisch opgepikt** door de app:
  - Een Node-script scant deze map en genereert een up-to-date experimentenlijst (`experiments.generated.ts`).
  - De sidebar, filters en experimentenpagina’s werken direct met deze lijst.
  - Je hoeft dus **nooit handmatig imports of exports aan te passen** buiten deze map.
- **Tags, categorieën en metadata** worden automatisch toegevoegd via een metadata-object in het script. Wil je extra info tonen? Voeg het toe aan het metadata-blok in het script of overleg met de maintainer.

## 🔹 Waar loop je tegenaan?
- **SSR/CSR issues**: Gebruik geen browser-API’s (zoals `window`, `document`) direct in de root van je component. Gebruik altijd React hooks (`useEffect`, `useState`) of laat de experimenten via dynamic import `{ ssr: false }` laden (dit is al geregeld in de app).
- **Hydration mismatches**: Zie je een hydration error? Controleer of je experiment niet op de server probeert te renderen. De app laadt experimenten automatisch client-only, maar vermijd conditionele rendering op basis van `typeof window` in de root.
- **Three.js vs R3F**: Gebruik declaratieve JSX (`<mesh>`, `<ambientLight>`, etc.) en gebruik `THREE` alleen voor types, vectoren en materiaalmanipulatie via refs. Gebruik nooit `<THREE.Mesh>` of `<THREE.Canvas>` als JSX.
- **Performance**: Experimenteer gerust met zware scenes, maar houd rekening met performance. Gebruik de ingebouwde performance tools en houd de app responsief.

## 🔹 Best practices
- Gebruik alleen deze map voor experimenten.
- Voeg duidelijke tags, categorieën en een korte beschrijving toe aan je experiment (zie bestaande voorbeelden).
- Houd je aan de projectstandaarden (TypeScript, Tailwind, R3F, Drei, zie root README).
- Gebruik geen globale state of side effects buiten React hooks.

## 🔹 Veelvoorkomende fouten
- Hydration mismatch: los je op door dynamic import met `{ ssr: false }` (is al geregeld).
- Canvas/THREE namespace error: gebruik alleen R3F JSX, niet direct Three.js JSX.
- Imports vergeten: je hoeft geen imports/exports aan te passen buiten deze map.

## 🔹 Hulp nodig?
- Zie de root README voor algemene projectinstructies.
- Vraag de maintainer als je een nieuwe feature of experimenttype wilt toevoegen aan de automatische integratie.

Happy experimenting! 🚀
