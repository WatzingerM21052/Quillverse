# ADDENDUM ZUM UI MASTER PROMPT V1
## ARCHITEKTUR, KI-INTEGRATION, VISUELLES SYSTEM & BACKUPS

Dieses Dokument **ersetzt V1 nicht**.

Es wird am Ende des bestehenden:

`BRIDGERTON LIVING WORLD — IMMERSIVE UI / WEBAPP / DESKTOP APP — MASTER PROMPT V1`

ergänzt.

Alle bisherigen Regeln bleiben gültig.

---

# A1. ZIELPLATTFORM

Die primäre Anwendung soll als:

> **moderne Webapp / Progressive Web App**

entwickelt werden.

Bevorzugte Deployment-Architektur:

```text
GitHub Repository
        │
        ▼
GitHub Actions
        │
        ▼
GitHub Pages
        │
        ▼
Frontend Webapp
        │
        ▼
Cloudflare Worker API
        │
        ├──── D1 Database
        ├──── R2 Asset Storage
        └──── AI Provider APIs
```

Eine klassische Desktop-Anwendung ist **nicht erforderlich**.

Die Webapp soll trotzdem:

- installierbar,
- responsive,
- fullscreen-fähig,
- app-artig,
- auf Desktop,
- Tablet
- und Smartphone

nutzbar sein.

---

# A2. FRONTEND-TECHNOLOGIE

Geeignete Optionen:

```text
Angular
Ionic Angular
Blazor WebAssembly
```

Alle drei müssen grundsätzlich mit der Architektur kompatibel bleiben.

## Empfehlung für maximale UI-Freiheit

Bevorzugt:

> Angular oder Angular + ausgewählte Ionic-Komponenten

wenn besonders wichtig sind:

- Animationen
- responsive Layouts
- Visual-Novel-UI
- dynamische Overlays
- komplexe Karten
- Character Panels
- PWA
- mobile Nutzung

Ionic soll nicht dazu führen, dass die Anwendung wie eine generische Mobile-App aussieht.

Die Regency-Designsprache hat immer Vorrang vor Standard-Ionic-Komponenten.

---

# A3. BLAZOR ALS ALTERNATIVE

Blazor WebAssembly ist ebenfalls vollständig geeignet, insbesondere wenn der Entwickler bevorzugt mit:

- C#
- .NET
- Razor Components

arbeitet.

Die Architektur darf deshalb nicht von Angular-spezifischen Konzepten abhängig sein.

Backend-Kommunikation erfolgt ausschließlich über klar definierte HTTP-/JSON-APIs.

---

# A4. FRONTEND UND BACKEND STRENG TRENNEN

GitHub Pages enthält ausschließlich:

- HTML
- CSS
- JavaScript/WebAssembly
- statische Assets
- UI-Logik

NICHT:

- geheime API Keys
- Provider Secrets
- private Serverlogik

Alle sensitiven Operationen laufen über:

> Cloudflare Workers.

---

# A5. CLOUDFLARE BACKEND

Verwende:

```text
Cloudflare Workers
```

für:

- REST-/RPC-API
- Authentifizierung
- AI-Aufrufe
- State-Validierung
- Save/Load
- Export
- Import
- Canon-Engine
- Memory Retrieval
- Provider Switching

---

# A6. D1 ALS SINGLE SOURCE OF TRUTH

Cloudflare D1 enthält den autoritativen Spielstand.

Die Datenbank ist:

> **die Wahrheit der Simulation.**

Nicht:

- ChatGPT
- Claude
- Gemini
- Markdown-Dateien
- Browser-Cache

Diese sind lediglich:

- Benutzeroberflächen,
- Erzähler,
- Exporte
- oder temporäre Repräsentationen.

---

# A7. EMPFOHLENE DATENBANKSTRUKTUR

D1 sollte mindestens Tabellen beziehungsweise entsprechende Entitäten für folgende Bereiche besitzen:

```text
users

simulations
simulation_settings

characters
character_visuals

relationships
relationship_memories
inner_thoughts

locations
location_states

world_state
world_events

turns
scenes

memories

letters

rumors
secrets

canon_events
canon_divergences

farms
farm_assets

finances
financial_transactions

inventory

social_events
invitations

savepoints

ai_calls
provider_usage

asset_metadata
```

---

# A8. R2 FÜR BILDER

Bilder gehören NICHT als Base64 oder große Binärdaten in D1.

Verwende:

> Cloudflare R2

für:

- Charakterbilder
- Charakter-Expressions
- Orte
- Häuser
- Karten
- Szenenbilder
- Briefe als Bilder
- besondere Erinnerungsbilder
- generierte Artworks

D1 speichert nur:

```text
assetId
owner
type
R2 object key
metadata
visual bible data
createdAt
```

---

# A9. VISUELLE BÜHNEN-ARCHITEKTUR

Nicht jede neue AI-Antwort erzeugt ein komplett neues Szenenbild.

Verwende stattdessen ein:

> **STAGE COMPOSITION SYSTEM**

Eine Szene entsteht aus mehreren wiederverwendbaren Ebenen.

Beispiel:

```text
BACKGROUND
    ↓
WEATHER / TIME LAYER
    ↓
ENVIRONMENT EFFECTS
    ↓
CHARACTER LEFT
    ↓
CHARACTER RIGHT
    ↓
FOREGROUND DECORATION
    ↓
DIALOGUE UI
```

---

# A10. BEISPIEL EINER SZENE

```text
Base Location:
player_farm_yard

Season:
spring

Time:
evening

Weather:
light rain

Characters:
matthias_neutral
eloise_amused

Effects:
rain
soft_lantern_light
moving_leaves
```

Die Anwendung komponiert daraus automatisch die aktuelle Szene.

---

# A11. VORTEIL DES STAGE SYSTEMS

Dadurch bleiben:

- Gesichter konsistent
- Häuser konsistent
- Orte wiedererkennbar
- Kleidung kontrollierbar
- Ladezeiten kurz
- Bildkosten niedrig

und trotzdem können Szenen visuell unterschiedlich wirken.

---

# A12. VISUAL STATE EINES CHARAKTERS

Jeder Charakter erhält einen persistenten visuellen Zustand:

```json
{
  "characterId": "...",
  "basePortrait": "...",
  "currentOutfit": "...",
  "currentHairState": "...",
  "currentAge": "...",
  "currentCondition": "...",
  "availableExpressions": []
}
```

---

# A13. EXPRESSIONS

Mindestens wichtige Figuren können Varianten besitzen:

```text
neutral
smiling
amused
concerned
angry
embarrassed
sad
surprised
cold
warm
flirtatious
tired
```

Nicht jede Figur benötigt sofort alle Varianten.

---

# A14. AUSDRUCK SOLL NICHT ALLES VERRATEN

Expressions dürfen keine geheimen Gefühle spoilern.

Beispiel:

Wenn ein NPC heimlich starke Anziehung empfindet, muss das Portrait nicht automatisch:

```text
seductive
```

anzeigen.

Die sichtbare Expression richtet sich nach dem:

> tatsächlich gezeigten Verhalten.

Nicht nach GM-Only-Gefühlen.

---

# A15. ORTSBIBLIOTHEK

Ein Ort kann aus einem Grundmotiv mehrere Zustände erhalten:

```text
player_farm

morning
day
sunset
night

spring
summer
autumn
winter

clear
rain
fog
snow
storm
```

Diese Varianten sollen möglichst durch:

- Lighting
- Overlays
- Particles
- Color Grading

erzeugt werden, bevor für jede Variante ein komplett neues Bild erstellt wird.

---

# A16. CINEMATIC ARTWORK SYSTEM

Komplett neu generierte Szenenbilder nur für besondere Momente.

Beispiele:

```text
First Meeting
First Ball
Major Argument
Romantic Milestone
Wedding
Major Canon Divergence
Major Estate Upgrade
Important Journey
```

Diese Artworks werden dauerhaft gespeichert.

---

# A17. MEMORY GALLERY

Cinematic Artworks erscheinen automatisch im:

```text
Journal
    └── Memories
```

mit:

- Datum
- Ort
- beteiligten Personen
- kurzem Titel
- zugehöriger Szene

---

# A18. ZENTRALE KI-ARCHITEKTUR

Grundsatz:

> **Die KI besitzt niemals das Gedächtnis.**

Die Anwendung besitzt das Gedächtnis.

Ein AI-Modell erhält lediglich eine temporäre Sicht auf den benötigten State.

---

# A19. AI PROVIDER MODES

Unterstütze drei unterschiedliche Modi:

```text
DIRECT API
FREE API
MANUAL RELAY
```

---

# A20. DIRECT API MODE

Für Provider mit direkter API-Verbindung:

```text
Player
   ↓
Frontend
   ↓
Cloudflare Worker
   ↓
Context Builder
   ↓
AI Provider
   ↓
Structured Response
   ↓
Validation
   ↓
D1 Commit
   ↓
Frontend
```

---

# A21. FREE API MODE

Falls ein AI-Provider einen kostenlosen Entwickler-/API-Tier anbietet, soll dieser wie ein normaler Provider behandelt werden.

Beispiel:

```text
Gemini Free API
```

kann als:

> Default Story Provider

konfiguriert werden.

Die App darf jedoch niemals davon ausgehen, dass:

- jedes Modell kostenlos ist,
- Limits dauerhaft gleich bleiben,
- unbegrenzt Requests verfügbar sind.

Providerlimits müssen konfigurierbar bleiben.

---

# A22. KEINE ANNAHME ÜBER CHAT-ABONNEMENTS

Die Architektur darf NICHT voraussetzen, dass ein normales:

```text
ChatGPT Free
ChatGPT Plus
ChatGPT Pro

Claude Free
Claude Pro
Claude Max

Gemini Consumer Subscription
```

automatisch als programmatische API genutzt werden kann.

Ein Consumer-Chat-Abo und eine Entwickler-API werden technisch als getrennte Integrationsarten behandelt.

---

# A23. MANUAL RELAY MODE

Damit trotzdem normale Chat-Abos verwendet werden können, implementiere:

> **Manual AI Relay**

Ablauf:

```text
Current Simulation
        ↓
Generate Context Package
        ↓
Copy
        ↓
External Chat
        ↓
ChatGPT / Claude / Gemini
        ↓
Copy Response
        ↓
Import Response
        ↓
Validate
        ↓
Commit
```

---

# A24. MANUAL RELAY UI

Button:

```text
Use External AI
```

öffnet ein Modal:

```text
1. Generate Context
2. Copy Prompt
3. Open Provider
4. Paste AI Response
5. Validate & Continue
```

---

# A25. PROVIDER QUICK LINKS

Optional können Buttons vorhanden sein:

```text
Open ChatGPT
Open Claude
Open Gemini
```

Sie öffnen lediglich den jeweiligen Dienst.

Die Anwendung versucht nicht, dessen Weboberfläche automatisiert zu steuern.

---

# A26. CONTEXT PACKAGE

Das exportierte Context Package enthält nur relevante Informationen.

Beispiel:

```text
SIMULATION MASTER RULES

PROMPT VERSION

STATE VERSION

CURRENT SCENE

CURRENT WORLD DATE

PLAYER

CURRENT LOCATION

PRESENT CHARACTERS

RELEVANT CHARACTER STATES

RELEVANT RELATIONSHIPS

RELEVANT MEMORIES

RELEVANT CANON EVENTS

OPEN THREADS

PLAYER ACTION

OUTPUT FORMAT
```

---

# A27. AI RESPONSE FORMAT

Jeder Provider muss möglichst strukturiert antworten.

Beispiel:

```json
{
  "story": {},
  "statePatch": {},
  "newMemories": [],
  "relationshipChanges": [],
  "worldEvents": [],
  "canonUpdates": []
}
```

---

# A28. STATE PATCH STATT FULL STATE

AI-Modelle schreiben niemals den gesamten Spielstand neu.

Sie liefern nur:

> Änderungen.

Das verhindert, dass Provider beim Wechsel versehentlich alte Fakten überschreiben.

---

# A29. PROVIDER SWITCHING

Beispiel:

```text
Turn 105
Gemini

Turn 106
Gemini

Turn 107
Gemini limit reached

Turn 108
OpenAI

Turn 109
Claude

Turn 110
Gemini
```

Alle greifen auf denselben:

> State Version 110

zu.

Dadurch bleibt die Geschichte identisch.

---

# A30. STATE VERSIONING

Jeder erfolgreiche Turn erhöht:

```text
stateVersion
```

Beispiel:

```text
401
↓
402
↓
403
```

Jede AI-Antwort enthält:

```text
baseStateVersion
```

---

# A31. STALE RESPONSE

Wenn eine AI-Antwort auf:

```text
State 401
```

basiert, der aktuelle State aber bereits:

```text
403
```

ist:

> Antwort NICHT automatisch committen.

Stattdessen:

```text
This response is based on an older world state.
Regenerate / Review / Force Import
```

---

# A32. AUTOMATISCHER FALLBACK

Optional:

```text
Primary Provider:
Gemini Free

Fallback 1:
OpenAI

Fallback 2:
Claude

Fallback 3:
Manual Relay
```

Automatischer Fallback darf nur stattfinden, wenn für den Provider eine echte API-Verbindung existiert.

---

# A33. MODELLWAHL PRO AUFGABE

Optional können unterschiedliche Modelle unterschiedliche Aufgaben übernehmen.

Beispiel:

```text
Story Narration:
Provider A

Memory Compression:
Provider B

Continuity Audit:
Provider C

Scene Image Prompt:
Provider A
```

Aber:

Eine einzelne KI muss weiterhin alles übernehmen können.

---

# A34. BACKUP-GRUNDSATZ

Die Cloud-Datenbank ist der aktive Save.

Zusätzlich muss der Nutzer jederzeit ein:

> lokales Backup

erstellen können.

---

# A35. BACKUP BUTTON

In Settings:

```text
Backup & Export
```

mit drei Modi.

---

# A36. COMPACT SAVE

```text
Compact Save
```

enthält:

```text
simulation.json

markdown/
    MASTER_STATE.md
    PLAYER.md
    WORLD.md
    RELATIONSHIPS.md
    CHARACTERS.md
    CANON.md
    HISTORY.md
```

Keine Bilder.

Ziel:

> sehr kleiner, schneller, portabler Save.

---

# A37. FULL MARKDOWN BACKUP

```text
Markdown Archive
```

enthält detailliertere Dateien.

Beispiel:

```text
/characters/
    eloise.md
    anthony.md
    daphne.md

/relationships/
    eloise-player.md
    anthony-player.md

/world/
    world-state.md
    rumors.md
    canon.md

/player/
    player.md
    farm.md
    finances.md

/history/
    timeline.md
    recent-history.md
```

Auch 20, 50 oder mehr Markdown-Dateien sind erlaubt.

---

# A38. FULL ARCHIVE

```text
Full Archive
```

enthält zusätzlich:

```text
/assets/
```

mit:

- Portraits
- Locations
- Cinematic Artworks
- Maps
- optionalen User Uploads

Dies kann erheblich größer werden.

---

# A39. ZIP FORMAT

Backups werden als:

```text
bridgerton-save-[name]-[date].zip
```

heruntergeladen.

---

# A40. BACKUP MANIFEST

Jedes ZIP enthält:

```json
manifest.json
```

Beispiel:

```json
{
  "formatVersion": 1,
  "simulationId": "...",
  "simulationName": "...",
  "stateVersion": 582,
  "worldDate": "...",
  "createdAt": "...",
  "includesAssets": false
}
```

---

# A41. JSON BLEIBT MASCHINENWAHRHEIT

Markdown dient:

- Lesbarkeit
- manueller Kontrolle
- AI-Weitergabe
- Notfallwiederherstellung

Der vollständige strukturierte JSON-State bleibt aber ebenfalls im Backup.

Dadurch muss ein späterer Import nicht versuchen, 50 Markdown-Dateien wieder fehleranfällig zu parsen.

---

# A42. IMPORT BACKUP

Unterstütze:

```text
Import ZIP
```

Ablauf:

```text
Read manifest
↓
Check version
↓
Validate JSON
↓
Check asset references
↓
Preview
↓
Import as new simulation
```

---

# A43. BACKUP DARF AKTIVEN SAVE NICHT ÜBERSCHREIBEN

Standardmäßig:

> Import creates new timeline/save.

Überschreiben nur nach ausdrücklicher Auswahl.

---

# A44. AUTO-CLOUD-SAVE

Nach jedem erfolgreichen Turn:

```text
D1 Commit
```

Dadurch muss der Nutzer nicht ständig lokale ZIP-Dateien erstellen.

ZIP ist:

> Backup, Export und Portabilität.

Nicht das eigentliche Speichersystem.

---

# A45. OPTIONAL LOCAL CACHE

Browser darf zusätzlich:

- letzte Szenen
- UI-Einstellungen
- zuletzt verwendete Assets
- temporären Draft

lokal cachen.

Der Browsercache ist aber nicht die autoritative Simulation.

---

# A46. OFFLINE LESEN

Optional kann die PWA:

- zuletzt geladene Szenen
- Journal
- Character Sheets
- gespeicherte Bilder

offline anzeigen.

Neue AI-Züge benötigen weiterhin Netzwerkzugang.

---

# A47. SECRET MANAGEMENT

Provider API Keys dürfen niemals im GitHub-Pages-Bundle liegen.

Für eine persönliche Installation:

```text
Cloudflare Worker Secrets
```

verwenden.

---

# A48. MEHRBENUTZER-BETRIEB

Falls später mehrere Nutzer eigene Provider Keys verwenden:

Diese dürfen nicht unverschlüsselt im Frontend oder normalen D1-State gespeichert werden.

Entwickle dafür eine separate:

> Provider Credential Layer.

---

# A49. KOSTENLOSE STANDARDKONFIGURATION

Die Architektur soll ermöglichen:

```text
Frontend:
GitHub Pages

Backend:
Cloudflare Workers

Database:
Cloudflare D1

Images:
Cloudflare R2

AI:
Free API Provider wenn verfügbar
```

Dadurch soll ein persönlicher beziehungsweise kleiner Betrieb möglichst weit mit Free-Tiers möglich sein.

---

# A50. ASSET-BACKUP NICHT BEI JEDEM SAVE

Bilder verändern sich wesentlich seltener als Story-State.

Deshalb:

```text
Quick Backup
→ only data

Full Backup
→ data + assets
```

Dadurch bleiben normale Backups extrem schnell.

---

# A51. CONTENT HASHES

Assets sollten optional einen:

```text
SHA / content hash
```

erhalten.

So müssen identische Bilder bei Backup/Import nicht mehrfach gespeichert werden.

---

# A52. VISUELLE ASSET REFERENZEN

Markdown-Dateien referenzieren Bilder beispielsweise über:

```text
asset://character/eloise/base
```

nicht über temporäre CDN-URLs.

Beim Rendering löst die App die Asset-ID auf.

---

# A53. FALLBACK BEI FEHLENDEM BILD

Wenn ein Asset fehlt:

- Story darf trotzdem funktionieren.
- neutrales Placeholder-Artwork verwenden.
- Nutzer kann Asset später reparieren.

Visuelle Fehler dürfen niemals den Spielstand zerstören.

---

# A54. PERFORMANCE-REGEL

Story-State und Text müssen immer zuerst verfügbar sein.

Priorität:

```text
State
↓
Story Text
↓
Character Portraits
↓
Background
↓
Decorations
↓
Animations
```

Die Simulation darf niemals auf eine dekorative Animation warten.

---

# A55. FINALE ARCHITEKTUR

Empfohlene Gesamtstruktur:

```text
                         ┌───────────────┐
                         │ GitHub Pages  │
                         │ Angular/PWA   │
                         └───────┬───────┘
                                 │
                                 ▼
                       ┌───────────────────┐
                       │ Cloudflare Worker │
                       │       API         │
                       └─────┬─────┬───────┘
                             │     │
                    ┌────────┘     └────────┐
                    ▼                       ▼
               ┌─────────┐             ┌─────────┐
               │   D1    │             │   R2    │
               │  State  │             │ Images  │
               └────┬────┘             └─────────┘
                    │
                    ▼
             ┌───────────────┐
             │ Context       │
             │ Builder       │
             └───────┬───────┘
                     │
        ┌────────────┼─────────────┐
        ▼            ▼             ▼
     Gemini       OpenAI        Claude
       API          API           API

                     │
                     ▼
                Manual Relay
             für externe Chats
```

---

# A56. FINALE GRUNDSÄTZE

> **Die App besitzt die Wahrheit.**

> **D1 besitzt den aktuellen State.**

> **R2 besitzt die visuellen Assets.**

> **Markdown besitzt die menschenlesbare Sicherung.**

> **JSON besitzt die maschinenlesbare Sicherung.**

> **Die KI erzählt und schlägt Änderungen vor.**

> **Die KI darf niemals allein entscheiden, was dauerhaft gespeichert wird.**

> **Jeder Provider sieht denselben Weltzustand.**

> **Ein Providerwechsel erzeugt keine neue Realität.**

> **Bilder werden wiederverwendet und komponiert, statt für jede Nachricht neu erzeugt zu werden.**

> **Normale Backups enthalten nur State und Text; Bilder sind optional.**

> **Die Welt muss selbst dann vollständig wiederherstellbar sein, wenn morgen jeder einzelne AI-Provider ausgetauscht wird.**