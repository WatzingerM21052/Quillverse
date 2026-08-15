# BRIDGERTON LIVING WORLD
## IMMERSIVE UI / WEBAPP / DESKTOP APP — MASTER PROMPT V1

---

# 0. PROJEKTZIEL

Entwirf und implementiere eine **hochgradig immersive grafische Benutzeroberfläche für eine persistente KI-gesteuerte Bridgerton-Living-World-Simulation**.

Die zugrunde liegende Simulation besitzt bereits einen umfangreichen Master-Prompt und simuliert:

- die Bridgerton-Welt zum Stand von Staffel 1,
- Canon-Ereignisse,
- alternative Zeitlinien,
- NPCs,
- Beziehungen,
- innere Gedanken,
- Landwirtschaft,
- Besitz,
- Finanzen,
- gesellschaftlichen Aufstieg,
- London Season,
- Gerüchte,
- Lady Whistledown,
- Briefe,
- Reisen,
- Kalender,
- Wetter,
- soziale Schichten,
- Weltzustand,
- langfristige Konsequenzen.

Die neue Anwendung soll diese Simulation **nicht einfach als Textchat darstellen**.

Sie soll sich anfühlen wie eine Mischung aus:

- interaktivem Roman,
- Visual Novel,
- Living-World-Simulation,
- Charakterdrama,
- Regency-Life-Simulator,
- Gesellschaftssimulation,
- persönlichem Tagebuch,
- digitalem Rollenspiel,
- dynamischem Storybook.

Der Spieler soll möglichst selten das Gefühl haben:

> „Ich schreibe gerade mit einem Chatbot.“

Stattdessen soll er fühlen:

> „Ich befinde mich innerhalb dieser Welt.“

---

# 1. OBERSTER DESIGNGRUNDSATZ

## KEIN CHATGPT-KLON

Die Benutzeroberfläche darf NICHT hauptsächlich bestehen aus:

```text
User:
Text

AI:
viel Text

User:
Text

AI:
viel Text
```

Die KI-Kommunikation soll hinter einer immersiven Oberfläche verborgen werden.

Die Geschichte wird dargestellt durch:

- Szenen,
- Charakterportraits,
- Dialogboxen,
- Umgebungsbilder,
- Karten,
- Briefe,
- Tagebuchseiten,
- Beziehungsdossiers,
- Kalender,
- Zeitlinien,
- gesellschaftliche Nachrichten,
- kleine Animationen,
- Sounddesign optional,
- visuelle Veränderungen der Umgebung.

Der Chat-Input ist lediglich das Mittel, mit dem der Spieler seinen Charakter kontrolliert.

---

# 2. DESIGNVISION

Die Oberfläche soll elegant, hochwertig und atmosphärisch wirken.

Visuelle Richtung:

> luxuriöses Regency-England + romantisches Storybook + moderne Premium-App

Nicht:

> billiges Rollenspiel-UI.

Nicht:

> generisches Bootstrap-Dashboard.

Nicht:

> Discord-artiger Chat.

Nicht:

> überladenes Fantasy-HUD.

Die moderne technische Oberfläche soll sich hinter der Welt verstecken.

---

# 3. VISUELLE IDENTITÄT

Verwende eine elegante Regency-inspirierte Designsprache.

## Farbwelt

Mögliche Hauptfarben:

- Elfenbein
- warmes Creme
- Pergament
- Champagner
- dezentes Gold
- Salbeigrün
- Dusty Blue
- Wisteria/Lavendel
- Rosé
- dunkles Regency-Blau
- Burgundy/Oxblood für Akzente
- warmes dunkles Braun

Dunkle Bereiche dürfen wirken wie:

- Mahagoniholz
- dunkler Samt
- Kerzenlicht
- alte Bibliothek

---

# 4. GOLD NICHT ÜBERTREIBEN

Gold dient für:

- Rahmen
- dünne Linien
- Ornamentik
- aktive Elemente
- Wachssiegel
- ausgewählte Icons

Keine komplette Goldoberfläche.

Ziel:

> luxuriös statt kitschig.

---

# 5. TYPOGRAFIE

Verwende Kombination aus:

## Display Serif

Für:

- Namen
- Kapitel
- Orte
- Gesellschaft
- Überschriften

Elegant und klassisch.

## Lesbare Serif

Für:

- Story
- Briefe
- Tagebuch
- längere Texte

## Saubere UI-Schrift

Optional für:

- Einstellungen
- technische Anzeigen
- Debuginformationen

Die Story sollte wie ein schön gesetzter Roman lesbar sein.

---

# 6. ORNAMENTIK

Verwende dezent:

- florale Linien
- Glyzinien/Wisteria
- Rosen
- Blätter
- feine Rahmen
- Wachssiegel
- Initialen
- kalligrafische Akzente
- kleine Kronen
- Federn
- Briefornamente

Aber:

> Inhalt vor Dekoration.

---

# 7. HAUPTNAVIGATION

Die Anwendung erhält beispielsweise folgende Hauptbereiche:

```text
STORY
WORLD
CHARACTERS
RELATIONSHIPS
MAP
ESTATE
SOCIETY
LETTERS
JOURNAL
TIMELINE
```

Zusätzlich:

```text
SETTINGS
AI / MODEL
SAVE
```

GM-/Entwicklerinformationen werden separat versteckt.

---

# 8. STANDARD-ANSICHT — STORY MODE

Die wichtigste Ansicht ist:

# STORY

Sie soll etwa 80 % der eigentlichen Spielzeit ausmachen.

---

# 9. STORY LAYOUT

Desktop ungefähr:

```text
┌──────────────────────────────────────────────────────────────┐
│ Datum       Ort                     Wetter           Menü    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                    SCENE BACKGROUND                          │
│                                                              │
│        CHARACTER                CHARACTER                    │
│          LEFT                      RIGHT                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│            NARRATION / DIALOGUE AREA                         │
│                                                              │
│                    PLAYER INPUT                              │
└──────────────────────────────────────────────────────────────┘
```

Die Szene soll möglichst den Bildschirm füllen.

---

# 10. SCENE BACKGROUND

Der Hintergrund zeigt den aktuellen Ort.

Beispiele:

- Bauernhof am Morgen
- Feld
- Küche
- Dorfmarkt
- Landstraße
- Bridgerton House
- Ballsaal
- Garten
- Aubrey Hall
- Londoner Straße
- Modiste
- Vauxhall
- Stall
- Bibliothek

Der Hintergrund verändert sich abhängig von:

- Ort
- Tageszeit
- Wetter
- Jahreszeit
- besonderem Ereignis

---

# 11. VISUELLE ZEITVARIANTEN

Ein Ort kann mehrere Varianten besitzen.

Beispiel:

```text
farm_spring_morning
farm_spring_evening
farm_summer_day
farm_rain
farm_autumn
farm_winter
farm_night
```

Die App soll möglichst automatisch die passende Variante wählen.

---

# 12. KEIN BILD FÜR JEDE EINZELNE ANTWORT ERZEUGEN

Um Kosten, Inkonsistenzen und Wartezeit zu vermeiden:

> Verwende eine persistente Asset-Bibliothek.

Generiere oder hinterlege Orte einmal und verwende sie wieder.

Nur bedeutende Szenen erhalten optional ein neues Cinematic Artwork.

---

# 13. CINEMATIC MOMENTS

Bei wichtigen Ereignissen darf die App automatisch anbieten:

> „Szene illustrieren“

Beispiele:

- erstes Treffen
- erster Ball
- Streit
- Kuss
- Heiratsantrag
- dramatische Reise
- große gesellschaftliche Enthüllung

Diese Bilder werden anschließend im Journal gespeichert.

---

# 14. CHARACTER PORTRAITS

Jeder wichtige NPC besitzt ein konsistentes Portrait.

Varianten können existieren:

```text
neutral
smiling
amused
angry
sad
surprised
embarrassed
formal
casual
```

Nicht zwingend alle.

---

# 15. CHARACTER VISUAL BIBLE

Für jede Figur speichere:

```json
{
  "characterId": "",
  "canonicalDescription": "",
  "faceDescription": "",
  "hair": "",
  "eyes": "",
  "build": "",
  "height": "",
  "wardrobe": [],
  "visualReferences": [],
  "portraitAssets": []
}
```

Dadurch bleiben generierte Darstellungen konsistent.

---

# 16. DIALOGDARSTELLUNG

Wenn ein NPC spricht:

- Portrait erscheint oder wird hervorgehoben.
- Name erscheint elegant oberhalb der Dialogbox.
- Dialog steht prominent.
- Körpersprache kann kleiner darunter erscheinen.

Beispiel:

```text
╭────────────────────────────────────╮
│ ELOISE BRIDGERTON                  │
│                                    │
│ „Das ist eine bemerkenswert        │
│ gefährliche Meinung.“              │
│                                    │
│ Sie hebt leicht eine Braue.        │
╰────────────────────────────────────╯
```

---

# 17. CHARAKTERPOSITION

Charaktere können beispielsweise links oder rechts erscheinen.

Wenn mehrere Personen sprechen:

- aktive Person erhält Fokus,
- andere werden leicht abgedunkelt,
- Portrait kann sanft wechseln.

Keine hektischen Animationen.

---

# 18. ERZÄHLTEXT

Narration wird anders dargestellt als Dialog.

Beispielsweise:

- auf leicht transparentem Pergamentpanel,
- ohne Portrait,
- breitere Textspalte,
- Serifenschrift.

Dialog und Narration müssen visuell sofort unterscheidbar sein.

---

# 19. PLAYER INPUT

Am unteren Bildschirmrand befindet sich kein generisches:

> „Message ChatGPT“

sondern beispielsweise:

> **Was tust oder sagst du?**

Der Spieler kann frei schreiben.

Beispiele:

```text
Ich lächle leicht. „Das nehme ich jetzt einfach als Kompliment.“
```

oder:

```text
Ich verlasse den Raum und gehe zum Stall.
```

---

# 20. OPTIONALER ACTION MODE

Zusätzlich darf es kleine kontextuelle Vorschläge geben:

```text
[Antworten]
[Schweigen]
[Gehen]
[Beobachten]
```

Aber:

Diese sind nur Vorschläge.

Freitext bleibt jederzeit möglich.

---

# 21. STORY TEXT HISTORY

Vergangener Text soll nicht permanent den Bildschirm füllen.

Stattdessen:

- aktuelle Szene im Vordergrund,
- ältere Szene über Scroll/Journal erreichbar.

Dadurch wirkt die App nicht wie ein Chatverlauf.

---

# 22. SCENE TRANSITIONS

Bei Ortswechsel:

- leichte Fade-Transition
- Hintergrundwechsel
- Ortsname erscheint kurz

Beispiel:

```text
LONDON
Grosvenor Square

18. April 1813
```

Danach verschwindet die Einblendung.

---

# 23. ZEITÜBERGÄNGE

Bei größerem Zeitsprung:

```text
Drei Tage später
```

oder:

```text
Mai 1813
```

als elegante Kapitelkarte.

---

# 24. AMBIENT ANIMATIONS

Optional sehr subtile Animationen:

- Vorhänge bewegen sich
- Kerzen flackern
- Regen am Fenster
- Blätter bewegen sich
- Staubpartikel
- Kaminfeuer
- Sonnenlicht
- Schnee
- Wisteria-Blüten

Keine übertriebene Bewegung.

---

# 25. OPTIONAL AUDIO

Optional:

- Regen
- Kamin
- Vogelstimmen
- Marktgeräusche
- Ballsaal
- Pferdekutschen
- Schritte
- Feder auf Papier

Musik nur dezent.

Audio muss vollständig deaktivierbar sein.

---

# 26. FOCUS MODE

Biete:

> **Focus Story Mode**

Dabei verschwinden nahezu alle UI-Elemente.

Nur:

- Szene
- Charakter
- Dialog
- Input

bleiben sichtbar.

Perfekt für längere Sessions.

---

# 27. CHARACTERS SCREEN

Der Bereich:

# CHARACTERS

zeigt alle Personen, die der Spieler tatsächlich kennt.

Keine unbekannten NPCs spoilern.

---

# 28. CHARACTER GRID

Darstellung als elegante Portraitkarten.

```text
[ Portrait ]

Eloise Bridgerton

Bekanntschaft

Letztes Treffen:
Vor 4 Tagen
```

---

# 29. CHARACTER SHEET

Beim Öffnen:

```text
PORTRAIT

ELOISE BRIDGERTON

Alter
Familie
gesellschaftlicher Stand
aktueller bekannter Aufenthaltsort
```

Darunter:

```text
Was du über sie weißt
```

Nur Player Knowledge.

---

# 30. BEZIEHUNGSBEREICH INNERHALB DES CHARACTERSHEETS

Darstellung bevorzugt qualitativ.

Beispielsweise:

```text
Vertrautheit      ●●●○○
Vertrauen         ●●○○○
Humor             ●●●●○
Nähe              ●●○○○
Spannung          ●●●○○
```

ODER noch natürlicher:

```text
Vertrauen:
vorsichtig wachsend

Humor:
deutlich gemeinsame Wellenlänge

Nähe:
noch zurückhaltend
```

---

# 31. KEINE SPOILER IN CHARACTER SHEETS

Nicht anzeigen:

- geheime Gefühle
- innere Gedanken
- verborgene Pläne

außer:

> GM MODE wurde bewusst aktiviert.

---

# 32. GM CHARACTER VIEW

Im GM-Modus darf zusätzlich erscheinen:

```text
INNER THOUGHTS
PRIVATE FEELINGS
ATTRACTION
MISCONCEPTIONS
GOALS
CURRENT PLANS
HIDDEN MEMORIES
```

Optisch klar markieren:

> GM ONLY

---

# 33. INNER THOUGHT TIMELINE

Eine sehr interessante Debug-/GM-Funktion:

```text
12. April
„Er scheint höflich, aber etwas eigenartig.“

18. April
„Sein Humor ist leider besser als erwartet.“

27. April
„Warum freue ich mich eigentlich darauf, ihn zu sehen?“
```

Damit lässt sich nachvollziehen, wie Gefühle entstanden sind.

---

# 34. RELATIONSHIPS SCREEN

# RELATIONSHIPS

zeigt Beziehungen grafisch.

Mögliche Ansicht:

## Relationship Web

Spieler in der Mitte.

Rundherum:

- Familie
- Freunde
- Rivalen
- Bekannte
- gesellschaftliche Kontakte

Linien können qualitative Bedeutungen zeigen.

---

# 35. KEINE RPG-ZAHLEN IM NORMALMODUS

Nicht:

```text
LOVE: 76
FRIENDSHIP: 61
```

Sondern:

```text
enge Bekanntschaft
wachsendes Vertrauen
spielerische Spannung
leichte Rivalität
```

Exakte Werte nur im optionalen Debug-Modus.

---

# 36. RELATIONSHIP DETAIL VIEW

Zeige:

```text
Erstes Treffen
Letztes Treffen
wichtige gemeinsame Erinnerungen
aktuelle Dynamik
öffentliche Beziehung
private Beziehung
```

Dazu eventuell kleine Erinnerungsbilder.

---

# 37. WORLD SCREEN

# WORLD

ist das lebende Welt-Dashboard.

Nicht als trockene Tabelle.

Sondern wie ein:

> gesellschaftliches Gazetteer / Almanach.

---

# 38. WORLD OVERVIEW

Zeige beispielsweise:

```text
18. April 1813

London Season
in vollem Gang

Gesellschaftliche Stimmung
angespannt / neugierig / skandalhungrig

Region
...

Wetter
...
```

---

# 39. WORLD EVENTS

Karten für:

- gesellschaftliche Ereignisse
- politische Entwicklungen
- lokale Ereignisse
- wirtschaftliche Entwicklungen

Nur Player Knowledge.

---

# 40. MAP SCREEN

# MAP

Verwende eine elegante Regency-Karte.

Darauf:

- Hof
- Dorf
- London
- bekannte Häuser
- Märkte
- wichtige Orte
- besuchte Orte

---

# 41. FOG OF KNOWLEDGE

Unbekannte Orte müssen nicht vollständig dargestellt werden.

Neue Orte können durch:

- Gespräche
- Reisen
- Briefe
- Karten

freigeschaltet werden.

---

# 42. TRAVEL

Beim Auswählen eines bekannten Ziels:

```text
Entfernung
geschätzte Reisezeit
Verkehrsmittel
voraussichtliche Kosten
```

Dann:

> Reise beginnen

Die KI entscheidet anschließend anhand des Weltzustands, was während der Reise geschieht.

---

# 43. REISEANIMATION

Optional:

Eine kleine Kutschenmarkierung bewegt sich über die Karte.

Aber nur dekorativ.

Keine unnötig lange Animation.

---

# 44. ESTATE SCREEN

# ESTATE

stellt den Hof visuell dar.

Das ist eine der wichtigsten Funktionen, damit der Bauern-Teil nicht nur Text ist.

---

# 45. ESTATE OVERVIEW

Möglicherweise als Illustration oder stilisierte Draufsicht.

Bereiche:

- Haus
- Scheune
- Stall
- Felder
- Weiden
- Garten
- Lager
- Zufahrt

---

# 46. GEBÄUDE ENTWICKELN SICH VISUELL

Wenn der Spieler später:

- Dach repariert,
- Stall erweitert,
- neues Haus baut,
- Land kauft,

soll dies sichtbar werden.

---

# 47. ESTATE STATS

Dezent:

```text
Land       18 acres
Pacht      jährlich ...
Vieh       ...
Vorräte    ...
Arbeiter   ...
```

---

# 48. FARM CALENDAR

Zeige als Jahresrad:

```text
FRÜHLING
Aussaat

SOMMER
Heu

HERBST
Ernte

WINTER
Instandhaltung
```

Aktuelle Aufgaben werden hervorgehoben.

---

# 49. FINANCE LEDGER

Finanzen erscheinen wie ein:

> Geschäftsbuch / Ledger.

```text
12 Apr   Saatgut          - ...
15 Apr   Marktverkauf     + ...
17 Apr   Reparatur        - ...
```

Nicht wie Online-Banking.

---

# 50. SOCIETY SCREEN

# SOCIETY

ist das Fenster in den Ton.

Am Anfang fast leer.

Weil der Spieler kaum Zugang besitzt.

---

# 51. SOCIAL ACCESS

Visualisiere gesellschaftlichen Zugang nicht als XP-Bar.

Beispielsweise als Kreise:

```text
LOCAL COMMUNITY
        ↓
LOCAL GENTRY
        ↓
HIGH SOCIETY
        ↓
THE TON
        ↓
ROYAL CIRCLE
```

Aktuell zugängliche Ebene wird hervorgehoben.

---

# 52. SOCIAL CALENDAR

Veranstaltungen erscheinen als elegante Einladungskarten.

```text
LADY DANBURY'S EVENING

20 April

Zugang:
nicht eingeladen
```

Wenn der Spieler davon weiß.

---

# 53. EINLADUNGEN

Eine tatsächliche Einladung erscheint als:

> eigener animierter Briefumschlag.

Spieler öffnet ihn.

Danach sieht er die Einladung.

---

# 54. DANCE CARD

Bei Bällen kann eine digitale Dance Card angezeigt werden.

Beispiel:

```text
1. Dance — ...
2. Dance — available
3. Dance — ...
```

Nur wenn es für die Situation sinnvoll ist.

---

# 55. LADY WHISTLEDOWN SCREEN

Sehr wichtig.

Nicht einfach als Feed.

Sondern als:

> echte gesellschaftliche Zeitung.

---

# 56. WHISTLEDOWN VISUAL

Komplette Pergament-/Papieransicht.

Headline.

Datum.

Kolumnen.

Ornamentik.

Optional:

kleine Druckanimation.

---

# 57. WHISTLEDOWN ARCHIVE

Alte Ausgaben werden archiviert.

Spieler kann später zurückblättern.

---

# 58. PLAYER MENTION

Wenn der Spieler irgendwann tatsächlich erwähnt wird:

Hebe die Stelle NICHT mit einem Computersystem hervor.

Lass ihn sie selbst beim Lesen entdecken.

Optional kann das UI später eine Erinnerung markieren.

---

# 59. LETTERS SCREEN

# CORRESPONDENCE

sieht aus wie ein Schreibtisch.

Auf dem Tisch:

- eingegangene Briefe
- Entwürfe
- versandte Briefe
- Einladungen

---

# 60. BRIEF ÖFFNEN

Animation:

- Umschlag
- Wachssiegel
- Papier wird geöffnet

Dann Briefansicht.

---

# 61. HANDSCHRIFT

Optional kann für kurze Überschriften eine Handschriftfont verwendet werden.

Längere Briefe müssen trotzdem gut lesbar bleiben.

---

# 62. BRIEF VERFASSEN

Kein E-Mail-Composer.

Stattdessen:

Pergament.

```text
Dear ...
```

oder entsprechend deutsche Darstellung.

Spieler schreibt frei.

---

# 63. BRIEF STATUS

Dezent anzeigen:

```text
Written
Sent
In Transit
Delivered
Answered
```

---

# 64. JOURNAL

# JOURNAL

ist das persönliche Erinnerungsbuch der Simulation.

Hier landen:

- wichtige Storymomente
- Cinematic Artworks
- persönliche Notizen
- wichtige Entscheidungen
- Erinnerungen
- Orte
- besondere Gegenstände

---

# 65. STORY CHAPTERS

Die Simulation kann automatisch in Kapitel eingeteilt werden.

Beispiele:

```text
CHAPTER I
A Quiet Spring

CHAPTER II
The First Invitation

CHAPTER III
London
```

Kapitel entstehen aus der Geschichte.

Nicht vorab festlegen.

---

# 66. TIMELINE

# TIMELINE

zeigt die tatsächliche Zeitlinie.

Beispielsweise vertikal:

```text
APR 12
Simulation Start

APR 16
First meeting with ...

APR 18
...

MAY 02
...
```

---

# 67. CANON DIVERGENCE VIEW

Eine besonders starke Funktion:

> **Butterfly Timeline**

Nur optional, eher Analyse/GM-Modus.

Links:

```text
Original Season 1 Timeline
```

Rechts:

```text
Current Simulation Timeline
```

Abweichungen werden verbunden.

---

# 68. CANON EVENT VISUAL

Beispiel:

```text
ORIGINAL
Event A
   │
   │ player intervention
   ▼
CURRENT
Modified Event A
   │
   ├── consequence B
   └── consequence C
```

Sehr interessant für lange Simulationen.

---

# 69. PLAYER PROFILE

Eigener Character Sheet.

Zeige:

- Portrait
- Name
- Alter
- Herkunft
- Beruf
- gesellschaftlicher Status
- Aussehen
- Kleidung
- Fähigkeiten
- Besitz
- Beziehungen
- persönliche Ziele

---

# 70. WARDROBE

Kleidung wird visuell verwaltet.

Karten:

```text
Work Shirt
Sunday Coat
Formal Waistcoat
...
```

---

# 71. OUTFIT IMPACT

Bei bestimmten Veranstaltungen:

```text
Suitable
Barely Appropriate
Inappropriate
```

Aber nicht als Videospielwert.

Eher elegant formuliert.

---

# 72. INVENTORY

Nur relevante Gegenstände.

Nicht:

> 7 Kartoffeln

wenn irrelevant.

Sehr wohl:

- Brief
- Schmuckstück
- Uhr
- besonderes Buch
- Geschenk
- Vertrag

---

# 73. MEMORY SYSTEM UI

Die zentrale AI-Memory soll für den Nutzer teilweise sichtbar sein.

Unter:

# MEMORY / ARCHIVE

Aber normale Spieler brauchen diesen Bereich nicht permanent.

---

# 74. MEMORY TYPES

Speichere:

```text
FACT
CHARACTER MEMORY
RELATIONSHIP MEMORY
WORLD EVENT
PROMISE
SECRET
RUMOR
CANON CHANGE
```

---

# 75. MEMORY INSPECTOR

Optionaler technischer Modus:

```text
Memory:
Matthias helped X.

Importance:
IMPORTANT

Referenced by:
X
Y

Created:
...
```

Extrem hilfreich zum Debuggen.

---

# 76. DIE ZENTRALE ARCHITEKTURREGEL

## DIE KI BESITZT NIEMALS DEN MASTER-STATE

Die App besitzt ihn.

Nicht:

ChatGPT.

Nicht:

Claude.

Nicht:

Gemini.

Die Modelle erhalten für jede Antwort nur eine **temporäre, kontrollierte Projektion** des benötigten Weltzustands.

---

# 77. SINGLE SOURCE OF TRUTH

Es gibt genau eine autoritative Quelle:

```text
SIMULATION STATE DATABASE
```

Darauf basieren alle Anbieter.

---

# 78. PROVIDER-INDEPENDENT MEMORY

Struktur:

```text
USER
 │
 ▼
APP
 │
 ├── MASTER STATE
 ├── EVENT LOG
 ├── NPC MEMORY
 ├── RELATIONSHIPS
 ├── WORLD STATE
 ├── CANON STATE
 └── ASSET LIBRARY
 │
 ▼
CONTEXT BUILDER
 │
 ├──── Claude
 ├──── OpenAI
 └──── Gemini
```

Modelle tauschen untereinander kein Gedächtnis aus.

Sie lesen denselben App-State.

---

# 79. MODEL ADAPTER LAYER

Implementiere eine abstrakte Schnittstelle.

Beispiel:

```ts
interface AIProvider {
  generate(request: SimulationRequest): Promise<SimulationResponse>;
}
```

Adapter:

```text
OpenAIProvider
AnthropicProvider
GeminiProvider
ExternalRelayProvider
```

Die Simulation selbst kennt den Anbieter nicht.

---

# 80. MODEL SWITCHING

In Einstellungen:

```text
Story Model

● Claude
○ OpenAI
○ Gemini
○ External
```

Der Spieler kann jederzeit wechseln.

---

# 81. KEINE MODEL-SPEZIFISCHE WAHRHEIT

Ein Modellwechsel darf NIEMALS:

- Beziehungen zurücksetzen
- Figuren verändern
- Weltzustand ändern
- Canon-Abweichungen vergessen
- Geld zurücksetzen
- Briefe verschwinden lassen

Alle Fakten stammen aus dem zentralen State.

---

# 82. CONTEXT BUILDER

Vor jedem AI-Call erstellt die Anwendung automatisch ein Context Package.

Beispiel:

```text
MASTER SIMULATION RULES

CURRENT DATE / LOCATION

CURRENT SCENE

PLAYER CHARACTER

RELEVANT WORLD STATE

NPCs PRESENT IN SCENE

THEIR RELEVANT MEMORIES

THEIR RELATIONSHIP STATE

RELEVANT CANON EVENTS

RECENT STORY HISTORY

RELEVANT LONG-TERM MEMORIES

OPEN THREADS

USER ACTION
```

---

# 83. NICHT DEN GANZEN SAVE JEDES MAL SENDEN

Die Anwendung muss relevante Informationen selektieren.

Beispiel:

Eine Szene mit einem Bauern auf dem Markt benötigt nicht automatisch:

> sämtliche inneren Gedanken von Queen Charlotte.

---

# 84. MEMORY RETRIEVAL

Nutze:

- Entity IDs
- Tags
- Beziehungen
- zeitliche Relevanz
- Importance
- optional semantische Suche

um passende Erinnerungen zu laden.

---

# 85. ENTITY IDs

Jede Entität erhält eine stabile ID.

Beispiele:

```text
char_player_matthias
char_eloise_bridgerton
loc_player_farm
loc_bridgerton_house
event_first_market_meeting
letter_00037
```

Keine Referenzen ausschließlich über Namen.

---

# 86. STRUKTURIERTER MASTER STATE

Speichere den tatsächlichen State NICHT ausschließlich als Markdown.

Verwende intern strukturierte Daten.

Beispiel:

```json
{
  "world": {},
  "player": {},
  "characters": {},
  "relationships": {},
  "locations": {},
  "events": {},
  "letters": {},
  "canon": {},
  "economy": {}
}
```

Markdown ist:

> Export- und Menschenleseformat.

---

# 87. EVENT SOURCING

Jeder Spielzug erzeugt einen unveränderlichen Event-Eintrag.

Beispiel:

```json
{
  "turn": 184,
  "timestamp": "...",
  "worldDate": "...",
  "playerAction": "...",
  "model": "...",
  "events": [],
  "statePatch": []
}
```

---

# 88. STATE PATCHES

Das Modell soll niemals den kompletten State neu schreiben.

Es liefert Änderungen.

Beispiel:

```json
{
  "relationshipUpdates": [],
  "worldUpdates": [],
  "memoryEvents": [],
  "timelineEvents": [],
  "financeUpdates": []
}
```

---

# 89. RESPONSE CONTRACT

Jede AI-Antwort soll technisch aus zwei Teilen bestehen:

```text
VISIBLE STORY OUTPUT

STRUCTURED STATE PATCH
```

Der zweite Teil wird NICHT dem normalen Spieler gezeigt.

---

# 90. BEISPIEL RESPONSE

Intern:

```json
{
  "scene": {
    "narration": "...",
    "dialogue": []
  },
  "statePatch": {
    "relationships": [],
    "memories": [],
    "world": []
  }
}
```

---

# 91. VALIDATION

Bevor State-Änderungen übernommen werden:

prüfe:

- Schema
- IDs
- Wertebereiche
- Zeit
- Geld
- Beziehungen
- Canon
- bekannte Entitäten

Ungültige Änderungen werden nicht blind übernommen.

---

# 92. STATE VERSION

Jeder State besitzt:

```text
stateVersion
```

Beispiel:

```text
1381
```

Eine AI-Antwort basiert auf:

```text
baseStateVersion = 1381
```

Nach erfolgreichem Commit:

```text
stateVersion = 1382
```

---

# 93. STALE RESPONSE PROTECTION

Falls inzwischen ein neuer Zug gespeichert wurde:

Eine Antwort auf eine alte State-Version darf nicht automatisch überschreiben.

Dadurch können verschiedene Provider niemals versehentlich unterschiedliche Realitäten erzeugen.

---

# 94. SNAPSHOTS

Erstelle regelmäßig vollständige Snapshots.

Beispielsweise:

- alle 10 Turns
- vor wichtigen Ereignissen
- vor Modelwechsel
- manuell

---

# 95. SAVEPOINTS

Spieler kann auswählen:

> Create Save Point

Beispiele:

```text
Before First Ball
After Harvest
Chapter III
```

---

# 96. AUTOSAVE

Nach jedem erfolgreichen Turn.

Keine manuelle Speicherpflicht.

---

# 97. MODEL FALLBACK

Falls Provider A:

- Limit erreicht
- Fehler liefert
- nicht verfügbar ist

kann die Anwendung anbieten:

> Continue with Provider B

Provider B erhält automatisch denselben aktuellen Context.

---

# 98. PROVIDER CHANGE INDICATOR

Nicht prominent.

Vielleicht nur kleines Symbol:

```text
Narrator: Claude
```

im technischen Menü.

Die Story selbst soll davon nichts merken.

---

# 99. DIRECT API MODE

Wenn ein Provider direkt verbunden ist:

```text
App
→ Context Builder
→ Provider API
→ Structured Response
→ State Validation
→ Commit
→ UI Rendering
```

---

# 100. EXTERNAL RELAY MODE

Unterstütze zusätzlich:

> External AI Relay

für Situationen, in denen der Nutzer einen externen Chat manuell verwenden möchte.

---

# 101. EXPORT CONTEXT PACKAGE

Button:

> **Continue in external AI**

Die App erzeugt ein paketiertes Prompt-Dokument:

```text
SIMULATION RULES
CURRENT STATE
RELEVANT MEMORY
CURRENT SCENE
OUTPUT CONTRACT
```

---

# 102. COPY MODE

Button:

> Copy Context

Danach kann Nutzer den Inhalt in:

- ChatGPT
- Claude
- Gemini
- anderes Modell

einfügen.

---

# 103. IMPORT RESPONSE

Danach:

> Import AI Response

Nutzer fügt Antwort ein.

App extrahiert:

- Story
- State Patch
- Memories
- Events

und validiert sie.

---

# 104. MANUAL IMPORT SAFETY

Wenn State Patch widersprüchlich ist:

Zeige:

```text
Potential continuity conflict detected.
```

und nicht automatisch speichern.

---

# 105. AI ORCHESTRATOR

Optional kann ein Modell unterschiedliche Aufgaben übernehmen.

Beispiel:

```text
Story Narration:
Claude

Continuity Check:
OpenAI

Summarization:
Gemini
```

Aber:

Das ist optional.

Ein einziges Modell muss alles übernehmen können.

---

# 106. CONTINUITY GUARD

Vor Commit kann optional ein zweiter kleiner AI-Call prüfen:

```text
Does this response contradict current state?
```

Nur bei wichtigen Szenen.

Nicht nach jedem Frühstück.

---

# 107. PROMPT COMPILER

Die Anwendung besitzt nicht einen gigantischen statischen Prompt bei jedem Call.

Sondern:

```text
BASE RULES
+
SCENE RULES
+
RELEVANT SYSTEM MODULES
+
STATE
+
MEMORY
```

---

# 108. MODULE SYSTEM

Promptmodule:

```text
CORE_SIMULATION
RELATIONSHIPS
ROMANCE
ECONOMY
FARMING
CANON
SOCIETY
TRAVEL
LETTERS
```

Nur relevante Module werden geladen.

---

# 109. TOKEN MANAGEMENT

Bei Context-Limits:

Priorität:

```text
1. Immutable Facts
2. Current Scene
3. Relevant NPC State
4. Relevant Relationship Memory
5. Open Threads
6. Canon Context
7. Recent History
8. Older Memories
```

Ältere irrelevante Texte werden komprimiert.

---

# 110. MEMORY SUMMARIZATION

Nach vielen Ereignissen:

```text
10 kleine Erinnerungen
```

dürfen zusammengefasst werden zu:

```text
During April, Matthias and Eloise repeatedly developed a dry,
teasing conversational rhythm.
```

Aber wichtige konkrete Momente bleiben einzeln.

---

# 111. IMAGE ASSET SYSTEM

Eigener:

```text
ASSET REGISTRY
```

---

# 112. ASSET TYPES

```text
character_portrait
character_expression
location
building
room
object
outfit
event_artwork
map
letter_texture
ornament
```

---

# 113. IMAGE GENERATION

Optional Provider-unabhängig.

Mögliche Funktionen:

```text
Generate Character Portrait
Generate Location
Generate Scene Artwork
Generate Outfit
```

---

# 114. IMAGE CONSISTENCY

Jede Generierung verwendet:

```text
visual bible
reference assets
canonical description
current age
current outfit
location
```

---

# 115. NIEMALS ZUFÄLLIGES REDESIGN

Eine Figur darf nicht:

- plötzlich andere Haarfarbe,
- anderes Alter,
- anderes Gesicht

haben.

---

# 116. MAJOR EVENT GALLERY

Große Szenen werden automatisch im:

> Memories / Gallery

gespeichert.

---

# 117. PLAYER HOUSE VISUAL PROGRESSION

Sehr wichtig:

Der Hof soll sich über Jahre entwickeln.

Beispielsweise:

```text
Year 1
kleines reparaturbedürftiges Haus

Year 3
renovierter Stall

Year 5
zusätzliches Land

Year 8
größeres Landhaus
```

Damit wird Fortschritt visuell spürbar.

---

# 118. WEATHER LAYER

Wetter kann visuell als Overlay dargestellt werden.

Beispiele:

```text
Rain
Snow
Fog
Sunlight
Clouds
```

---

# 119. SEASONAL VISUALS

Orte ändern sich:

```text
spring blossoms
summer greenery
autumn leaves
winter snow
```

---

# 120. UI SHOULD REACT TO STORY

Beispiel:

Wenn Spieler gesellschaftlich aufsteigt:

Neue Menüs und Informationen werden organisch relevanter.

Anfang:

```text
Society
fast leer
```

Später:

```text
Society
voller Kalender
Einladungen
Kontakte
Bälle
```

---

# 121. PROGRESS THROUGH WORLD, NOT LEVELS

Keine:

```text
LEVEL 12
XP +50
```

Fortschritt erscheint durch:

- Haus
- Kleidung
- Kontakte
- Besitz
- Briefe
- Einladungen
- bekannte Orte
- Beziehungen

---

# 122. HOME SCREEN

Beim Öffnen der App:

Vollbildillustration des aktuellen Ortes.

Beispielsweise:

> Bauernhaus bei Sonnenaufgang.

Darüber:

```text
BRIDGERTON
A LIVING WORLD

April 1813
```

Buttons:

```text
Continue
Journal
World
```

---

# 123. SAVE SELECTION

Mehrere alternative Zeitlinien möglich.

Darstellung wie Bücher.

```text
Volume I
The Farmer

Volume II
Alternative Timeline
```

---

# 124. TIMELINE IDENTITY

Jeder Save erhält:

- Titel
- aktuelles Datum
- Spielerportrait
- aktueller Ort
- kleine Zusammenfassung
- letztes Bild

---

# 125. LOADING SCREEN

Nicht:

> spinner.gif

Sondern beispielsweise:

- Feder schreibt langsam eine Linie
- Wachssiegel
- sanfter Seitenwechsel

Aber Loading muss schnell bleiben.

---

# 126. STREAMING RESPONSE

Wenn AI Text streamt:

Narration erscheint fließend.

Optional leichter Typwriter-Effekt.

Aber:

Nutzer muss Animation deaktivieren können.

---

# 127. DIALOG STREAMING

Dialog kann zeilenweise erscheinen.

Nicht Buchstabe für Buchstabe extrem langsam.

---

# 128. REDUCED MOTION

Unterstütze:

```text
prefers-reduced-motion
```

Alle wesentlichen Funktionen bleiben ohne Animation nutzbar.

---

# 129. ACCESSIBILITY

Mindestens:

- ausreichender Kontrast
- Tastatursteuerung
- Screenreader Labels
- skalierbare Schrift
- reduzierte Bewegung
- Untertitel für Audio
- keine Information ausschließlich über Farbe

---

# 130. MOBILE

Mobile Version darf nicht einfach Desktop zusammendrücken.

Story Mode:

```text
Scene Image
Character Portrait
Dialogue
Input
```

Navigation über Bottom Bar.

---

# 131. TABLET

Tablet eignet sich besonders gut als digitales Storybook.

Nutze größere:

- Bildflächen
- Seitenübergänge
- Charakterkarten

---

# 132. DESKTOP

Desktop darf:

- größere Cinematic Backgrounds
- Seitenpanels
- Karte
- Character overlays

verwenden.

---

# 133. PWA

Die Webapp sollte installierbar sein.

Unterstütze:

- Homescreen
- Offline Asset Cache
- lokale Saves soweit möglich
- Desktop Feeling

---

# 134. OPTIONAL DESKTOP WRAPPER

Optional:

> Tauri oder vergleichbare Desktop-Shell

damit:

- lokale Datenbank
- sicherer Secret Storage
- Dateisystemzugriff
- native App Experience

möglich werden.

---

# 135. DATABASE

Trenne mindestens:

```text
simulations
characters
relationships
memories
locations
events
turns
letters
assets
canonEvents
finances
inventory
```

---

# 136. MASTER STATE != CHATLOG

Chatlog ist nur Historie.

Die Wahrheit liegt in strukturierten Tabellen beziehungsweise State-Objekten.

---

# 137. TURN OBJECT

Beispiel:

```json
{
  "id": "",
  "simulationId": "",
  "turnNumber": 128,
  "stateVersionBefore": 938,
  "stateVersionAfter": 939,
  "worldTimeBefore": "",
  "worldTimeAfter": "",
  "playerInput": "",
  "provider": "",
  "model": "",
  "sceneOutput": {},
  "statePatch": {},
  "createdAt": ""
}
```

---

# 138. CHARACTER OBJECT

Beispiel:

```json
{
  "id": "",
  "name": "",
  "canon": true,
  "appearance": {},
  "personality": {},
  "playerKnowledge": {},
  "gmState": {},
  "location": "",
  "goals": [],
  "memories": []
}
```

---

# 139. RELATIONSHIP OBJECT

```json
{
  "from": "",
  "to": "",
  "type": "",
  "trust": 0,
  "respect": 0,
  "familiarity": 0,
  "humor": 0,
  "emotionalCloseness": 0,
  "attraction": 0,
  "romanticInterest": 0,
  "romanticFeelings": 0,
  "rivalry": 0,
  "jealousy": 0,
  "momentum": "",
  "attention": "",
  "innerThoughts": [],
  "memories": []
}
```

Die Zahlen werden im normalen UI nicht angezeigt.

---

# 140. MEMORY OBJECT

```json
{
  "id": "",
  "entityIds": [],
  "date": "",
  "type": "",
  "importance": "",
  "fact": "",
  "interpretation": {},
  "visibility": "",
  "tags": []
}
```

---

# 141. CANON EVENT OBJECT

```json
{
  "id": "",
  "baseline": "",
  "requirements": [],
  "window": {},
  "status": "",
  "playerInfluence": "",
  "divergence": "",
  "consequences": []
}
```

---

# 142. SCENE OBJECT

Eine AI-Antwort kann strukturiert zurückgeben:

```json
{
  "scene": {
    "locationId": "",
    "time": "",
    "weather": "",
    "narration": [],
    "dialogue": [
      {
        "speakerId": "",
        "text": "",
        "expression": "",
        "position": ""
      }
    ],
    "imageCue": {}
  }
}
```

Dadurch kann die UI Dialoge tatsächlich visuell darstellen.

---

# 143. STORY MARKUP

Alternativ darf das Modell ein eigenes leichtes Markup verwenden:

```text
[NARRATION]
...

[DIALOGUE character="eloise" expression="amused"]
...

[ACTION]
...
```

Die Anwendung wandelt dies in UI-Komponenten um.

---

# 144. PROVIDER OUTPUT MUSS GLEICH SEIN

Egal ob:

- Claude
- OpenAI
- Gemini
- anderes Modell

alle müssen dasselbe Response Schema verwenden.

---

# 145. PROVIDER-SPEZIFISCHE PROMPTS

Falls notwendig darf pro Anbieter ein kleiner Adapter-Prompt existieren.

Aber:

Die Simulationsregeln bleiben identisch.

---

# 146. PROMPT VERSIONING

Master Prompt besitzt:

```text
promptVersion
```

Beispiel:

```text
simulation-v3.0
```

Alle Turns speichern, welche Promptversion genutzt wurde.

---

# 147. MIGRATIONS

Wenn der Master Prompt später geändert wird:

Bereits bestehende Saves dürfen weiter funktionieren.

Keine komplette Neuerstellung verlangen.

---

# 148. EXPORT

Unterstütze:

```text
Export Full Simulation
```

als:

- JSON
- Markdown
- ZIP

---

# 149. MARKDOWN EXPORT

Erzeuge automatisch:

```text
BRIDGERTON_SIMULATION_STATE.md
```

entsprechend dem Master-Prompt.

---

# 150. IMPORT

Ein alter Markdown-Save darf wieder importierbar sein.

Die Anwendung versucht:

- Charaktere
- Beziehungen
- Welt
- Erinnerungen
- Canon

zu rekonstruieren.

---

# 151. CONFLICT DETECTION

Wenn Import widersprüchliche Fakten enthält:

Nicht stillschweigend wählen.

Zeige:

```text
Continuity Conflict
```

mit Optionen.

---

# 152. EDIT STATE

Im GM-Modus darf Nutzer State manuell korrigieren.

Beispiel:

> NPC location falsch.

Korrektur wird als eigenes Admin-Event gespeichert.

---

# 153. UNDO

Mindestens:

> Undo Last Turn

Dabei State-Version zurücksetzen.

Optional:

Branch erstellen.

---

# 154. BRANCHING TIMELINES

Sehr starke Langzeitfunktion:

Von einem Savepoint:

> Create Alternate Timeline

Dadurch können zwei Versionen derselben Geschichte existieren.

---

# 155. TIMELINE TREE

Visualisiere:

```text
Original Save
     │
     ├── Timeline A
     │
     └── Timeline B
```

---

# 156. MODEL COST / LIMIT UI

Falls API verwendet wird:

Technische Informationen gehören in Einstellungen.

Nicht Story Mode.

Beispielsweise:

```text
Requests
Tokens
Estimated API Usage
```

---

# 157. PRIVACY

API Keys niemals:

- in Story-Daten,
- Export-Dateien,
- Logs

speichern.

---

# 158. SECRET STORAGE

Secrets getrennt vom Simulation State speichern.

---

# 159. PROVIDER CONNECTIONS

Settings Screen:

```text
AI PROVIDERS

OpenAI
Connected

Anthropic
Connected

Gemini
Not connected

External Relay
Available
```

---

# 160. MODEL PROFILES

Spieler kann Profile erstellen.

Beispiel:

```text
Narrative
High-quality model

Fast
Cheaper/faster model

Continuity
Reasoning model
```

---

# 161. AUTOMATIC FALLBACK

Optional:

```text
Primary: Claude
Fallback: OpenAI
Second Fallback: Gemini
```

Nur aktivieren, wenn Nutzer dies möchte.

---

# 162. SAME TURN PROTECTION

Wenn Primary bereits eine erfolgreiche Antwort geliefert hat:

Fallback darf nicht ebenfalls denselben Turn committen.

---

# 163. IMAGE PROVIDER UNABHÄNGIG

Story AI muss nicht Bild-AI sein.

Beispiel:

```text
Story Provider
Claude

Image Provider
Separate image model
```

---

# 164. ART STYLE CONSISTENCY

Definiere für die gesamte Welt eine feste:

> Visual Style Bible.

Beispielsweise:

```text
elegant romantic Regency illustration
soft cinematic realism
warm natural lighting
refined painterly finish
historically inspired clothing
no modern elements
consistent character identity
```

---

# 165. COPYRIGHT-SICHERE ASSET-STRATEGIE

Für eigene App-Assets bevorzugen:

- eigene Illustrationen
- generierte Originalbilder
- lizenzierte Bilder
- vom Nutzer bereitgestellte Assets

Nicht automatisch fremde Serien-Screenshots oder Werbegrafiken scrapen.

---

# 166. CHARACTER REFERENCE LOCK

Wenn Portrait akzeptiert wurde:

Button:

> Lock Appearance

Danach dient es als Referenz für zukünftige Varianten.

---

# 167. LOCATION REFERENCE LOCK

Gleiches für Orte.

---

# 168. ATMOSPHERE ENGINE

Die App darf aus State automatisch ableiten:

```text
Location
Season
Weather
Time
Mood
```

und daraus die Präsentation auswählen.

---

# 169. MOOD DARF NICHT FAKTEN ÄNDERN

Mood beeinflusst:

- Beleuchtung
- Musik
- Animation

nicht den Weltzustand.

---

# 170. START EXPERIENCE

Beim ersten Start:

Keine technische Formularwand.

Stattdessen:

> Create Your Life

als eleganter Character-Creation-Prozess.

---

# 171. CHARACTER CREATOR

Schrittweise:

```text
Who are you?
↓
Your Family
↓
Your Home
↓
Your Skills
↓
Your Ambitions
↓
Simulation Preferences
```

---

# 172. CHARACTER CREATION VISUAL

Wie Seiten eines persönlichen Dossiers.

Nicht wie RPG-Stats-Menü.

---

# 173. FARM CREATION

Zeige visuelle Auswahl:

```text
Very Small Farm
Small Farm
Modest Farm
```

mit kurzen Auswirkungen.

Standard:

> Poor but respectable tenant family.

---

# 174. SIMULATION SETTINGS

Slider oder natürliche Auswahl:

```text
Romance
Low ─────●──── High

Society
Low ─────●──── High

Farm Management
Light ───●──── Detailed

Historical Detail
Loose ───●──── Strong

Story Pace
Slow ────●──── Fast
```

---

# 175. KEINE HARTEN GAMEPLAY-BONI

Diese Regler verändern:

> Erzähl- und Simulationsgewichtung.

Nicht Erfolgschancen.

---

# 176. ONBOARDING ENDE

Danach:

kurze Kamerafahrt/Illustration des Hofes.

Titel:

```text
SPRING, 1813

YOUR FARM
OUTSIDE LONDON
```

Dann beginnt Tag 1.

---

# 177. INFORMATION DISCOVERY

Neue Charaktere werden beim ersten Treffen automatisch zum Characters-Bereich hinzugefügt.

Neue Orte:

Map.

Neue Briefe:

Correspondence.

Neue Gerüchte:

Society.

Die Welt entfaltet sich dadurch visuell.

---

# 178. NOTIFICATIONS

Keine modernen Push-Toasts wie:

> Relationship +5!

Stattdessen subtile Hinweise.

Beispiel:

```text
A new letter has arrived.
```

oder kleines Wachssiegel-Icon.

---

# 179. RELATIONSHIP CHANGES NICHT SPOILERN

Nicht:

> Eloise attraction increased.

Im normalen Modus höchstens:

> Relationship updated.

Oder gar keine Meldung.

Der Spieler soll Beziehungen erleben, nicht Statistiken lesen.

---

# 180. GM MODE

Settings:

```text
GM / DEBUG MODE
```

Optional mit Warnung:

> Contains spoilers and hidden character information.

---

# 181. GM DASHBOARD

Zeige dort:

```text
State Version
Canon Drift
NPC Locations
NPC Goals
Hidden Feelings
Memory
Pending Events
Continuity Issues
```

---

# 182. CONTINUITY HEALTH

Dashboard:

```text
Continuity
✓ Healthy

Potential issues
0
```

---

# 183. CANON DRIFT

Optional:

```text
Season 1 Canon Similarity
High / Moderate / Low / Fundamentally Diverged
```

Keine Prozentzahl nötig.

---

# 184. AUTONOMOUS WORLD ADVANCEMENT

Wenn Zeit vergeht:

World Simulation Engine aktualisiert:

- NPC-Pläne
- Canon Events
- Reisen
- Briefe
- Wirtschaft
- Hof
- Kalender

---

# 185. WORLD TICK

Nicht jede Minute simulieren.

Verwende Ereignis-basierte Ticks.

Beispielsweise:

```text
Scene end
Travel
Sleep
Day skip
Week skip
```

---

# 186. BACKGROUND SIMULATION

Vor AI-Erzählung kann App berechnen:

```text
What changed since last scene?
```

Diese Änderungen werden Context des Story Models.

---

# 187. MODEL IS NARRATOR, APP IS AUTHORITY

Wenn Modell behauptet:

> Anthony befindet sich in London

aber State sagt:

> Aubrey Hall

darf die App dies erkennen.

State gewinnt.

---

# 188. RESPONSE REPAIR

Bei Widerspruch:

Option:

> Regenerate with corrected context

ohne Turn zu committen.

---

# 189. STORY QUALITY CONTROLS

Optional:

```text
More Dialogue
More Atmosphere
Faster Pace
Less Description
```

Diese verändern Stil, nicht Weltzustand.

---

# 190. RECAP

Nach längerer Pause:

Home Screen zeigt:

> Previously...

Kurze KI-generierte Zusammenfassung.

---

# 191. PREVIOUSLY SCREEN

Enthält:

- letztes wichtiges Ereignis
- aktuelle Beziehungen
- offene Verpflichtungen
- aktuelle Ziele

Keine GM-Spoiler.

---

# 192. SESSION END

Optional:

> Close Chapter

Die App erzeugt:

- kurze Zusammenfassung
- Memory Consolidation
- Snapshot
- eventuell Kapitelillustration

---

# 193. SESSION START

Beim nächsten Öffnen:

```text
Chapter IV

Three days since your last visit...
```

wenn In-World-Zeit entsprechend steht.

---

# 194. OPTIONAL PLAYER NOTES

Spieler darf private Notizen hinzufügen.

Diese sind:

> USER NOTES

Nicht automatisch Wahrheit über die Simulation.

---

# 195. BOOKMARK MOMENT

Button:

> Remember this moment

macht einen Storyabschnitt zu:

IMPORTANT Memory.

---

# 196. FAVORITE QUOTES

Dialoge können als Lieblingszitat gespeichert werden.

---

# 197. SCREENSHOT / STORY CARD

Optional aus einer Szene eine schöne:

> Story Card

mit:

- Bild
- Zitat
- Datum
- Ort

generieren.

---

# 198. PERFORMANCE

Die immersive Oberfläche darf nicht schwerfällig werden.

Prioritäten:

1. Storyreaktion
2. Text
3. Kernbilder
4. Animationen

Animationen dürfen niemals den AI-Flow blockieren.

---

# 199. LAZY LOADING

Große Bilder und Archive nur laden, wenn benötigt.

---

# 200. FINAL UX PRINCIPLE

Der Nutzer soll **nicht Daten verwalten müssen**, damit die Simulation funktioniert.

Die App erledigt:

- Save
- Memory
- State
- Canon
- Beziehungen
- Zeit
- Model Switching

automatisch.

---

# 201. DER SPIELER SIEHT EINE WELT, KEINE DATENBANK

Alle technischen Systeme existieren darunter.

Darüber sieht er:

- Menschen
- Orte
- Briefe
- Beziehungen
- Erinnerungen
- sein Zuhause
- London
- Gesellschaft

---

# 202. EMPFOHLENE PRODUKTSTRUKTUR

## PHASE 1 — CORE

Zuerst:

- Simulation Save State
- AI Provider Adapter
- Story Screen
- Player Input
- Character Portraits
- Locations
- Basic Character Sheets
- Autosave

---

# 203. PHASE 2 — WORLD

Danach:

- Map
- Estate
- World State
- Calendar
- Letters
- Timeline

---

# 204. PHASE 3 — SOCIAL

Danach:

- Relationships
- Society
- Invitations
- Whistledown
- Ball Interface
- Relationship Web

---

# 205. PHASE 4 — ADVANCED MEMORY

Danach:

- structured memories
- relevance retrieval
- Event Sourcing
- snapshots
- Canon divergence
- GM Dashboard

---

# 206. PHASE 5 — MULTI MODEL

Danach:

- OpenAI adapter
- Anthropic adapter
- Gemini adapter
- External Relay
- automatic fallback
- model profiles

---

# 207. PHASE 6 — VISUAL POLISH

Danach:

- dynamic weather
- expression portraits
- cinematic images
- location variants
- ambient animation
- audio
- page transitions

---

# 208. NICHT ALLES AUF EINMAL IMPLEMENTIEREN

Die Architektur muss von Beginn an alle Systeme ermöglichen.

Die erste Version soll aber bereits spielbar sein.

---

# 209. MVP MUSS BEREITS IMMERSIV SEIN

Das MVP benötigt mindestens:

```text
Story View
Scene Background
NPC Portraits
Dialogue Rendering
Narration Rendering
Player Input
Character Sheets
Central Save State
AI Provider Abstraction
Autosave
```

Damit soll es bereits deutlich besser wirken als ein normaler Chat.

---

# 210. LANGFRISTIGE VISION

Das Endprodukt soll sich anfühlen wie:

> Ein persönliches, niemals endendes Regency-Drama, dessen Welt persistent weiterlebt.

Der Spieler kann Jahre innerhalb derselben Timeline verbringen.

Sein:

- Zuhause
- Vermögen
- Ruf
- Beziehungen
- Kleidung
- Kontakte
- Erinnerungen
- gesellschaftlicher Status

entwickeln sich sichtbar.

---

# 211. FINALE DESIGNREGELN

## NICHT:

Chatbot mit Skin.

## SONDERN:

Living World.

---

## NICHT:

Zahlen und XP.

## SONDERN:

sichtbare soziale Entwicklung.

---

## NICHT:

unendliche Textwand.

## SONDERN:

Szenen, Menschen, Orte und Artefakte.

---

## NICHT:

KI-Gedächtnis.

## SONDERN:

App-eigener persistenter State.

---

## NICHT:

Claude-Spielstand + ChatGPT-Spielstand + Gemini-Spielstand.

## SONDERN:

eine einzige Wahrheit, von der alle Modelle lesen.

---

## NICHT:

jede Szene neu generieren.

## SONDERN:

persistente visuelle Welt plus besondere Cinematic Moments.

---

## NICHT:

Hauptfiguren als Fanservice.

## SONDERN:

eine glaubwürdige Welt, in der bekannte Figuren tatsächlich leben.

---

# 212. FINALES PRODUKTGEFÜHL

Wenn der Spieler morgens seinen Hof verlässt, soll die App ihm nicht einfach schreiben:

> „Du gehst nach London.“

Er soll sehen:

- seinen Hof im Morgenlicht,
- das Datum,
- vielleicht Nebel über den Feldern,
- den Reiseweg auf der Karte.

Wenn er einen Brief erhält:

Soll kein Chattext erscheinen.

Er soll:

> einen versiegelten Brief öffnen.

Wenn er Eloise trifft:

Soll nicht einfach:

```text
Eloise: Hallo.
```

erscheinen.

Er soll:

- ihr Portrait sehen,
- ihren Gesichtsausdruck,
- ihren Namen,
- ihre Worte,
- die kleine körperliche Reaktion,
- den Ort hinter ihr.

Wenn Wochen später daraus eine komplizierte Beziehung geworden ist:

Soll der Character Screen nicht einfach:

> Love 82

anzeigen.

Er soll sehen:

> „Vertraute Bekanntschaft. Viel gemeinsamer Humor. Deutlich gewachsene Nähe. In Gesellschaft weiterhin auffallend zurückhaltend.“

Wenn er Jahre später aus dem armen kleinen Pachtbetrieb einen bedeutenden Besitz aufgebaut hat:

Soll dies nicht nur im State stehen.

Er soll:

> sein verändertes Zuhause sehen.

Und wenn er irgendwann eine Entscheidung trifft, durch die der ursprüngliche Verlauf von Staffel 1 vollkommen auseinanderbricht:

Soll die App dies nicht verhindern.

Sie soll:

> diese neue Zeitlinie konsequent weiterleben lassen.

---

# 213. TECHNISCHER KERNSATZ

> **The database remembers.**

> **The simulation engine decides what is true.**

> **The AI model narrates.**

> **The UI turns that state into a world.**

Der Provider ist austauschbar.

Die Welt ist es nicht.

---

# 214. ABSCHLIESSENDE AUFGABE

Nutze diese Spezifikation als verbindliche Produktvision.

Wenn du die Anwendung implementierst:

1. Beginne mit einer sauberen Architektur.
2. Definiere das zentrale Simulation-State-Schema.
3. Definiere stabile Entity IDs.
4. Implementiere Event Sourcing und State-Versionierung.
5. Implementiere eine providerunabhängige AI-Schnittstelle.
6. Implementiere Story Scene Rendering.
7. Implementiere persistente Charakter- und Ortsassets.
8. Implementiere Save/Load.
9. Implementiere danach schrittweise die immersiven Weltansichten.
10. Bewahre während der gesamten Entwicklung den wichtigsten Grundsatz:

> **Der Spieler soll eine Welt erleben – nicht mit einer KI chatten.**