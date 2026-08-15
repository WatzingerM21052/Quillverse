# ADDENDUM V1.2
## AI PROVIDER, API-KEY-, BYOK- & MODEL-MANAGEMENT

Dieses Dokument ergänzt:

- **UI MASTER PROMPT V1**
- **ADDENDUM V1.1**

Es ersetzt keine der bisherigen Spezifikationen.

Ziel dieses Addendums ist die genaue Definition eines:

> **Bring Your Own Key — BYOK Systems**

Der Nutzer soll eigene API-Zugänge für verschiedene KI-Anbieter direkt innerhalb der App konfigurieren können.

---

# B1. GRUNDIDEE

Die Anwendung unterstützt mehrere KI-Provider gleichzeitig.

Zum Beispiel:

```text
Google Gemini
OpenAI
Anthropic Claude
Custom Provider
```

Der Nutzer kann für jeden Provider einen eigenen API-Key hinterlegen.

Danach kann er innerhalb der Anwendung bestimmen:

```text
Story:
Gemini

Fallback:
OpenAI

Continuity Audit:
Claude
```

oder jederzeit manuell wechseln.

---

# B2. WICHTIGSTER GRUNDSATZ

> **API-Keys werden niemals im eigentlichen Frontend gespeichert.**

Insbesondere niemals in:

```text
Git Repository
GitHub Pages Files
environment.ts
appsettings.json im WASM-Frontend
LocalStorage
SessionStorage
IndexedDB
Export ZIP
Markdown Save
simulation.json
URL
Query Parameter
Browser Logs
Analytics Events
```

---

# B3. ARCHITEKTUR

Die API-Key-Kommunikation läuft ausschließlich:

```text
Browser
   │
   │ HTTPS
   ▼
Cloudflare Worker
   │
   ├── Credential Service
   │
   ├── Encryption
   │
   └── Provider Adapter
   │
   ▼
Gemini / OpenAI / Anthropic
```

Das Frontend kommuniziert niemals direkt mit einer normalen geheimen Provider-API.

---

# B4. SETTINGS-BEREICH

Erstelle unter:

```text
Settings
└── AI & Models
```

einen eigenen Bereich:

# AI PROVIDERS

Beispiel:

```text
┌────────────────────────────────────────────┐
│ ✦ Google Gemini                           │
│                                            │
│ Status: ✓ Connected                       │
│ Model: Gemini ...                         │
│                                            │
│ [Configure]      [Test]      [Disconnect] │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ OpenAI                                     │
│                                            │
│ Status: Not connected                     │
│                                            │
│ [Connect]                                  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ Anthropic Claude                           │
│                                            │
│ Status: Not connected                     │
│                                            │
│ [Connect]                                  │
└────────────────────────────────────────────┘
```

---

# B5. PROVIDER CONNECT FLOW

Wenn Nutzer auf:

> Connect

klickt:

zeige ein Modal.

Beispiel:

```text
Connect Google Gemini

API Key
[••••••••••••••••••••••••••••]

Your key is sent securely to the backend
and is never stored in your browser.

[Cancel]

[Test & Save]
```

---

# B6. API-KEY-EINGABEFELD

Das Feld muss:

```text
type="password"
```

verwenden.

Zusätzlich:

```text
[👁 Show]
```

optional erlauben.

Beim Schließen des Fensters:

> Eingabewert verwerfen.

Nach erfolgreichem Speichern:

> Eingabefeld sofort leeren.

---

# B7. TEST BEFORE SAVE

Der Standardbutton lautet:

> **Test & Save**

Ablauf:

```text
User enters key
        ↓
Send key to Worker
        ↓
Worker performs provider-specific validation
        ↓
Minimal authentication request
        ↓
SUCCESS?
   │
   ├── NO
   │    ↓
   │  Return understandable error
   │
   └── YES
        ↓
      Encrypt Key
        ↓
      Store Credential
        ↓
      Return CONNECTED
```

Ungültige Keys dürfen standardmäßig nicht gespeichert werden.

---

# B8. FEHLERMELDUNGEN

Keine kryptischen Providerantworten direkt zeigen.

Statt:

```text
HTTP 401
INVALID_ARGUMENT
```

zeige beispielsweise:

```text
The API key could not be authenticated.

Check that:
• the key was copied completely,
• the relevant API is enabled,
• the key has not been revoked.
```

Technische Details können aufklappbar sein:

```text
Show technical details
```

---

# B9. SERVER-SIDE ENCRYPTION

Persistente Benutzer-API-Keys werden vor Speicherung zusätzlich auf Anwendungsebene verschlüsselt.

Empfohlen:

> AES-GCM

Der Cloudflare Worker besitzt einen separaten:

```text
CREDENTIAL_MASTER_KEY
```

Dieser liegt ausschließlich als:

> Worker Secret

vor.

---

# B10. MASTER KEY

Der Master-Key darf niemals liegen in:

```text
D1
GitHub
Source Code
Frontend
Backup ZIP
Logs
```

Er existiert ausschließlich in der sicheren Backend-Konfiguration.

---

# B11. PER-CREDENTIAL ENCRYPTION

Bei jedem gespeicherten Provider-Key:

1. neuen zufälligen IV erzeugen
2. API-Key verschlüsseln
3. Ciphertext speichern
4. IV speichern
5. Encryption-Version speichern

Beispiel:

```json
{
  "provider": "gemini",
  "ciphertext": "...",
  "iv": "...",
  "encryptionVersion": 1
}
```

---

# B12. CREDENTIAL DATABASE

Beispielsweise:

```text
ai_provider_credentials
```

Felder:

```text
id
user_id
provider
encrypted_api_key
encryption_iv
encryption_version
key_hint
created_at
updated_at
last_verified_at
status
```

---

# B13. KEY HINT

Optional darf ein sehr kleiner ungefährlicher Hinweis gespeichert werden.

Beispiel:

```text
•••• 7KQ2
```

Dieser dient ausschließlich dazu, dass der Nutzer erkennt:

> „Welchen Key habe ich hier ungefähr hinterlegt?“

Der vollständige Key darf niemals zurückgegeben werden.

---

# B14. API-KEY NACH DEM SPEICHERN

Das Backend besitzt intern Zugriff auf den entschlüsselten Key nur:

> unmittelbar während eines notwendigen Provider-Aufrufs.

Danach wird er nicht zusätzlich gecacht oder geloggt.

---

# B15. FRONTEND DARF KEY NICHT WIEDER ABRUFEN

Es existiert ausdrücklich KEIN Endpoint wie:

```text
GET /api/provider/key
```

der den eigentlichen Key zurückgibt.

Frontend erhält lediglich:

```json
{
  "provider": "gemini",
  "connected": true,
  "keyHint": "••••7KQ2"
}
```

---

# B16. PROVIDER STATUS

Mögliche Zustände:

```text
Not configured
Connected
Needs verification
Invalid key
Revoked
Quota exceeded
Temporarily unavailable
Disabled
```

---

# B17. PROVIDER DETAIL PAGE

Bei Klick auf einen verbundenen Provider:

```text
Google Gemini

Status
✓ Connected

API Credential
••••••••7KQ2

Last verified
Today

Default Model
[ dropdown ]

Story Model
[ dropdown ]

[Run Connection Test]

[Replace API Key]

[Remove API Key]
```

---

# B18. KEY REPLACE

Bei:

> Replace API Key

muss erneut ein Key eingegeben werden.

Der alte Key wird erst ersetzt, wenn der neue Key erfolgreich validiert wurde.

---

# B19. KEY DELETE

Bei:

> Disconnect / Remove Key

wird der gespeicherte Credential-Datensatz gelöscht.

Danach darf dieser Provider nicht mehr automatisch aufgerufen werden.

---

# B20. SESSION-ONLY KEY

Optional zusätzlich anbieten:

> **Use for this session only**

Dann gilt:

- Key wird nicht dauerhaft in D1 gespeichert.
- Die Anwendung verwendet ihn nur für die aktuelle Sitzung.
- Nach Ablauf der Sitzung muss er erneut eingegeben werden.

Diese Option ist besonders für temporäre Tests nützlich.

---

# B21. OWNER KEY VS. USER KEY

Unterstütze optional zwei Ebenen:

## APP OWNER KEY

Ein Key, den der Betreiber direkt als Worker Secret konfiguriert.

Beispiel:

```text
GEMINI_API_KEY
```

Dieser steht der gesamten privaten Installation zur Verfügung.

---

## USER BYOK

Ein Key, den der jeweilige Benutzer über Settings hinterlegt.

---

# B22. PRIORITÄT

Empfohlene Reihenfolge:

```text
User-specific API Key
        ↓
App Owner API Key
        ↓
Next configured provider
        ↓
Manual Relay
```

---

# B23. PERSÖNLICHE EINBENUTZER-INSTALLATION

Wenn die Anwendung ausschließlich vom Entwickler selbst verwendet wird, kann alternativ ein Provider-Key direkt als:

> Cloudflare Worker Secret

eingetragen werden.

Dies ist technisch besonders einfach.

In diesem Fall braucht die UI keinen API-Key dauerhaft entgegenzunehmen.

---

# B24. TROTZDEM BYOK VORSEHEN

Die Architektur sollte dennoch BYOK unterstützen.

Dadurch kann später:

- ein anderer Key,
- ein anderer Nutzer,
- ein weiterer Provider

hinzugefügt werden, ohne die Anwendung neu zu deployen.

---

# B25. PROVIDER MODEL DISCOVERY

Nach erfolgreicher Verbindung soll der Worker – sofern der Provider dies unterstützt – ermitteln, welche kompatiblen Modelle verfügbar sind.

Die UI erhält eine normalisierte Modellliste.

Beispiel:

```json
[
  {
    "provider": "gemini",
    "id": "...",
    "displayName": "...",
    "capabilities": [
      "text",
      "structured-output"
    ]
  }
]
```

---

# B26. KEINE FEST EINPROGRAMMIERTEN MODELLNAMEN ALS EINZIGE WAHRHEIT

Modelle verändern sich.

Deshalb sollen verfügbare Modelle möglichst:

- dynamisch geladen,
- serverseitig konfigurierbar,
- beziehungsweise zentral aktualisierbar

sein.

---

# B27. MODEL CACHE

Modelllisten dürfen gecacht werden.

Beispielsweise:

```text
24 Stunden
```

oder bis der Nutzer:

> Refresh Models

drückt.

---

# B28. MODEL SELECTOR

Nach Provider-Auswahl:

```text
Model

[ Gemini ... ▼ ]
```

Optional Details:

```text
Fast
Reasoning
Long Context
Multimodal
```

Nur anzeigen, wenn diese Informationen zuverlässig bekannt sind.

---

# B29. KEINE HARDCODED FREE-KENNZEICHNUNG

Nicht dauerhaft im Source Code:

```text
Gemini Model X = FREE
```

hinterlegen.

Providerpreise und Free-Tiers können sich verändern.

---

# B30. FREE-TIER STATUS

Stattdessen beispielsweise:

```text
Pricing:
Provider controlled

Current account quota:
when available
```

oder:

```text
Free tier may be available for this provider.
```

---

# B31. PROVIDER PROFILE

Jeder verbundene Provider erhält:

```json
{
  "provider": "gemini",
  "enabled": true,
  "defaultModel": "...",
  "storyModel": "...",
  "fallbackPriority": 1
}
```

---

# B32. STORY PROVIDER

Settings:

# STORY NARRATOR

```text
Primary Provider

[ Google Gemini ▼ ]

Model

[ ... ▼ ]
```

---

# B33. FALLBACK SYSTEM

Darunter:

```text
Automatic Fallback

☑ Enabled
```

Reihenfolge per Drag & Drop:

```text
1. Gemini
2. OpenAI
3. Claude
4. Manual Relay
```

---

# B34. WANN FALLBACK AUSLÖSEN?

Zum Beispiel bei:

```text
Rate Limit
Quota Exhausted
Temporary Provider Error
Timeout
Service Unavailable
```

NICHT automatisch bei:

```text
Story gefällt mir nicht.
```

---

# B35. PROVIDERWECHSEL ÄNDERT NICHT DEN STATE

Beispiel:

```text
Turn 525

Gemini fails because quota is exhausted.
```

Dann:

```text
Fallback → OpenAI
```

OpenAI erhält exakt:

```text
stateVersion 525
```

und setzt dieselbe Simulation fort.

---

# B36. KEIN PROVIDER-SPEZIFISCHES GEDÄCHTNIS ALS WAHRHEIT

Optional vorhandene Provider-Konversationen dürfen niemals der primäre State sein.

Die App rekonstruiert für jeden Turn den notwendigen Kontext aus:

```text
D1
+
Memory System
+
Current Scene
+
Master Prompt
```

---

# B37. NEUER PROVIDER DARF NICHT „NEU ANFANGEN“

Wenn Provider gewechselt wird:

FALSCH:

```text
Claude:
Hello! Tell me about your character.
```

RICHTIG:

Claude erhält bereits:

- Charakter
- Hof
- Beziehungen
- aktuelle Szene
- Canon State
- Erinnerungen
- offene Konflikte

und setzt unmittelbar fort.

---

# B38. PROVIDER-INDEPENDENT RESPONSE CONTRACT

Alle Provider müssen auf dasselbe interne Schema gebracht werden.

Zum Beispiel:

```json
{
  "schemaVersion": 1,

  "scene": {},

  "statePatch": {},

  "memories": [],

  "relationshipChanges": [],

  "canonChanges": [],

  "worldChanges": []
}
```

---

# B39. PROVIDER ADAPTER

Backend-Struktur:

```text
/providers

    /gemini
        GeminiProvider

    /openai
        OpenAIProvider

    /anthropic
        AnthropicProvider

    /custom
        CustomProvider
```

Alle implementieren dieselbe interne Schnittstelle.

---

# B40. PROVIDER INTERFACE

Konzeptionell:

```ts
interface AiProvider {
    validateCredential(): Promise<CredentialStatus>;

    listModels(): Promise<ModelInfo[]>;

    generateStory(
        request: SimulationRequest
    ): Promise<SimulationResponse>;
}
```

---

# B41. PROVIDER-SPEZIFISCHE UNTERSCHIEDE BLEIBEN IM ADAPTER

Beispielsweise unterschiedliche:

- Request-Formate
- Auth-Header
- Structured-Output-Formate
- Modellnamen
- Tokenfelder

dürfen niemals den Simulation Core beeinflussen.

---

# B42. AI ORCHESTRATOR

Zwischen Simulation und Providern sitzt:

```text
AI ORCHESTRATOR
```

Ablauf:

```text
Simulation Engine
       ↓
Context Builder
       ↓
AI Orchestrator
       ↓
Selected Provider Adapter
       ↓
Provider API
       ↓
Normalized Response
       ↓
Validator
       ↓
State Commit
```

---

# B43. PROVIDER-SPEZIFISCHE PROMPT OPTIMIZATION

Optional darf ein Provider-Adapter kleine Formatunterschiede verwenden.

Aber der:

> fachliche Inhalt

des Master-Prompts muss identisch bleiben.

---

# B44. PROMPT HASH

Optional speichere für jeden Turn:

```text
promptVersion
promptHash
```

Dadurch lässt sich später nachvollziehen:

> Unter welchen Simulationsregeln wurde diese Szene erzeugt?

---

# B45. AI CALL LOG

Speichere KEINE API-Keys.

Aber speichere technische Metadaten:

```text
provider
model
turn
timestamp
duration
success
errorType
inputTokens
outputTokens
```

wenn verfügbar.

---

# B46. USAGE DASHBOARD

Settings → AI Usage

Beispiel:

```text
THIS SIMULATION

Gemini
142 requests

OpenAI
18 requests

Claude
4 requests
```

Optional:

```text
Input tokens
Output tokens
```

---

# B47. KOSTENSCHÄTZUNG

Falls Kosten angezeigt werden:

> niemals fest darauf vertrauen.

Preislisten können sich ändern.

Deshalb:

```text
Estimated Cost
```

klar als Schätzung markieren.

Optional kann Nutzer eigene Preiswerte konfigurieren.

---

# B48. FREE-TIER COUNTERS

Wenn Provider verlässliche aktuelle Quota-Daten zurückgibt:

anzeigen.

Wenn nicht:

> keine Quota erfinden.

---

# B49. LIMIT ERREICHT

Beispiel:

```text
Gemini is currently unavailable because
the provider rejected the request due to quota.

Continue using:

[OpenAI]

[Claude]

[Manual Relay]

[Cancel]
```

---

# B50. MANUAL MODEL SWITCH

Im Story Screen darf optional ein sehr kleines Menü existieren:

```text
Narrator
Gemini ▾
```

Aber nicht prominent.

Story-Immersion hat Vorrang.

---

# B51. MODEL SWITCH CONFIRMATION

Ein Modelwechsel benötigt keine neue Simulation.

Zeige lediglich:

```text
Narrator changed to Claude.

The current world state remains unchanged.
```

---

# B52. RETRY MIT ANDEREM MODELL

Bei fehlerhafter Generierung:

```text
Retry
```

oder:

```text
Retry with...
    Gemini
    OpenAI
    Claude
```

Solange der Turn noch nicht committed wurde.

---

# B53. COMMIT-FIRST-SAFETY

Ein Turn besitzt:

```text
PENDING
```

während die KI antwortet.

Er wird erst:

```text
COMMITTED
```

wenn:

- Response validiert
- State Patch validiert
- keine kritischen Konflikte gefunden

wurden.

---

# B54. RETRY DARF KEINEN DOPPELTEN TURN ERZEUGEN

Wenn eine Antwort verworfen wurde:

State bleibt unverändert.

Andere KI kann denselben Turn neu erzeugen.

---

# B55. API ERROR DARF STORY NICHT BESCHÄDIGEN

Wenn Provider ausfällt:

```text
Simulation State:
unverändert

Player Input:
als Draft erhalten
```

Dadurch kann der Spieler später erneut versuchen.

---

# B56. SECURITY — KEIN KEY IN LOGS

Backend darf nicht loggen:

```text
Authorization Header
API Key
Credential POST Body
decrypted credentials
```

---

# B57. SECURITY — KEIN KEY IN ERRORS

Fehlermeldungen dürfen nie enthalten:

```text
Your key sk-abc123...
```

Stattdessen:

```text
The configured OpenAI credential was rejected.
```

---

# B58. SECURITY — ANALYTICS

Analytics dürfen niemals erfassen:

- API-Key-Eingabefelder
- Prompt-Inhalte
- private Story-Inhalte
- Briefe
- NPC-Geheimnisse
- vollständige Save-States

sofern Nutzer dies nicht ausdrücklich möchte.

---

# B59. SECURITY — EXPORT

Beim Erstellen von:

```text
Quick Backup
Markdown Backup
Full Archive
```

werden API-Credentials grundsätzlich ausgeschlossen.

---

# B60. SECURITY — ACCOUNT DELETE

Wenn Nutzer seinen Account beziehungsweise seine App-Daten löscht:

müssen auch:

```text
ai_provider_credentials
```

gelöscht werden.

---

# B61. OPTIONAL: LOCK CREDENTIALS

Optional:

```text
Lock AI Credentials
```

Danach erfordert:

- Key ersetzen
- Key löschen

eine erneute Authentifizierung.

---

# B62. PROVIDER AUTHORIZATION

Nur der eingeloggte Besitzer darf:

```text
Connect
Replace
Delete
Test
Use
```

seine Provider-Credentials.

---

# B63. KEINE PROVIDER-CREDENTIALS ZWISCHEN USERN TEILEN

Falls mehrere Accounts existieren:

```text
User A Key
```

darf niemals für:

```text
User B
```

verwendet werden.

---

# B64. OPTIONAL APP-OWNER PROVIDER

Der Entwickler darf bewusst einen globalen Provider anbieten.

Beispiel:

```text
Built-in Gemini
```

Wenn dies später gewünscht wird.

Dann muss klar getrennt werden zwischen:

```text
App Provider
```

und:

```text
Your API Key
```

---

# B65. PROVIDER SELECTION PER SIMULATION

Eine Simulation darf eigene Provider-Präferenzen besitzen.

Beispiel:

```text
Bridgerton Simulation

Primary:
Gemini

Fallback:
Claude
```

Eine andere Simulation könnte andere Einstellungen verwenden.

Credentials selbst bleiben Benutzerkonto-bezogen.

---

# B66. PROVIDER SELECTION PER TASK

Optional:

```text
STORY
Gemini

CONTINUITY AUDIT
OpenAI

MEMORY COMPRESSION
Gemini

IMAGE PROMPT
Claude
```

Dies ist Advanced Mode.

---

# B67. SIMPLE MODE

Standardmäßig soll Nutzer nur sehen:

```text
AI Narrator

Gemini
```

Komplexe Multi-Model-Konfiguration steckt unter:

> Advanced AI Settings.

---

# B68. MANUAL RELAY BLEIBT IMMER VERFÜGBAR

Auch ohne einzigen gespeicherten API-Key muss die Simulation nutzbar bleiben.

Dann:

```text
Use External AI
```

wie in Addendum V1.1 beschrieben.

---

# B69. PROVIDER CONNECTION WIZARD

Für unerfahrene Nutzer:

```text
Connect Gemini

1. Create an API Key
2. Paste it here
3. Test connection
4. Select a model
5. Done
```

Keine unnötige technische Sprache.

---

# B70. KEINE CONSUMER-ABO-ANNAHME

Die App behandelt folgende Dinge ausdrücklich getrennt:

```text
Chat subscription
```

und:

```text
Developer API credential
```

Die App entscheidet ausschließlich anhand eines funktionierenden API-Credentials, ob ein Provider direkt benutzt werden kann.

---

# B71. GEMINI BEISPIEL

Mögliche Konfiguration:

```text
Google Gemini

API:
Connected

Model:
[ selected Gemini model ]

Role:
Primary Story Narrator

Fallback Priority:
1
```

Wenn aktueller Account/API-Key für ein Modell kostenlosen Zugriff besitzt:

> kann dies genutzt werden.

Die App darf jedoch keine kostenlose Nutzung garantieren.

---

# B72. OPENAI BEISPIEL

```text
OpenAI

API:
Connected

Model:
[ selected OpenAI model ]

Role:
Fallback Story Narrator

Fallback Priority:
2
```

---

# B73. CLAUDE BEISPIEL

```text
Anthropic

API:
Connected

Model:
[ selected Claude model ]

Role:
Continuity / Story

Fallback Priority:
3
```

---

# B74. KEINE ABO-DATEN BENÖTIGT

Die App muss nicht wissen:

```text
ChatGPT Plus?
ChatGPT Pro?
Claude Pro?
Gemini Advanced?
```

Diese Informationen sind für den direkten API-Modus irrelevant.

Benötigt wird lediglich:

> ein gültiger API-Zugang.

---

# B75. DEFAULT V1 CONFIGURATION

Für eine erste funktionierende Version:

```text
Gemini API
    ↓
Primary Provider

OpenAI API
    ↓
Optional

Anthropic API
    ↓
Optional

Manual Relay
    ↓
Always available
```

---

# B76. EMPFOHLENES SETTINGS-LAYOUT

```text
SETTINGS
│
├── Simulation
│
├── Appearance
│
├── Story
│
│
├── AI & Models
│   │
│   ├── Narrator
│   │
│   ├── Providers
│   │      ├── Gemini
│   │      ├── OpenAI
│   │      └── Claude
│   │
│   ├── Fallback
│   │
│   ├── Usage
│   │
│   └── Advanced
│
├── Backup & Export
│
└── Privacy
```

---

# B77. UX-GRUNDSATZ

Das Provider-System darf technisch komplex sein.

Für den normalen Nutzer soll es sich trotzdem nur so anfühlen:

```text
1. API Key eingeben.

2. Verbindung testen.

3. Modell auswählen.

4. Spielen.
```

Alles andere übernimmt die Anwendung.

---

# B78. FINALE SECURITY-ARCHITEKTUR

```text
GitHub Pages
     │
     │ NO API KEY STORED
     │
     ▼
Cloudflare Worker
     │
     ├── Authentication
     │
     ├── Credential Service
     │
     ├── Encryption Service
     │
     ├── Provider Adapters
     │
     └── AI Orchestrator
     │
     ▼
Encrypted Credential Record
     │
     ▼
D1
```

Master Encryption Key:

```text
Cloudflare Worker Secret
```

Provider Key:

```text
Encrypted D1 Record
```

---

# B79. FINALE PROVIDER-ARCHITEKTUR

```text
                         ┌─────────────┐
                         │ SIMULATION  │
                         │    STATE    │
                         └──────┬──────┘
                                │
                                ▼
                         CONTEXT BUILDER
                                │
                                ▼
                         AI ORCHESTRATOR
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
        GEMINI              OPENAI              ANTHROPIC
        ADAPTER             ADAPTER              ADAPTER
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                                ▼
                      NORMALIZED RESPONSE
                                │
                                ▼
                          STATE VALIDATOR
                                │
                                ▼
                             D1 COMMIT
```

---

# B80. FINALE REGELN

> **Der Nutzer darf eigene API-Keys komfortabel in den Settings hinterlegen.**

> **Der Browser speichert diese Keys niemals dauerhaft.**

> **Alle eigentlichen Provider-Aufrufe laufen über Cloudflare Workers.**

> **Persistente Keys werden verschlüsselt gespeichert.**

> **Der Master Encryption Key liegt niemals in D1.**

> **Ein gespeicherter API-Key wird niemals wieder vollständig ans Frontend zurückgegeben.**

> **Keys erscheinen niemals in Backups.**

> **Jeder Provider ist austauschbar.**

> **Jeder Provider arbeitet mit derselben Simulation State Database.**

> **Ein Limit oder Ausfall eines Providers beendet niemals die Simulation.**

> **Ein Modellwechsel verändert niemals die bestehende Realität.**

> **Die App besitzt das Gedächtnis.**

> **Die KI besitzt nur den Kontext, den sie für den aktuellen Turn benötigt.**