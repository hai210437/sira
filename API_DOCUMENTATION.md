# SIRA Immobilien API Dokumentation

## Basis URL

**Lokal:** `http://localhost:3000/api`
**Produktion:** `https://ftp.sira-group.at/api` (über Nginx Reverse Proxy)

## Authentifizierung

Die API verwendet **HTTP Basic Authentication**. Alle API-Endpunkte (außer `/health`) erfordern Authentifizierung.

**Credentials:**
- **Username:** `admin`
- **Password:** `Sira#1010`

### Beispiele

#### Browser
Rufe die URL auf - der Browser zeigt automatisch einen Login-Dialog:
```
https://ftp.sira-group.at/api/immobilien
```

#### cURL
```bash
curl -u admin:'Sira#1010' https://ftp.sira-group.at/api/immobilien

# Oder mit Header:
curl -H "Authorization: Basic YWRtaW46U2lyYSMxMDEw" https://ftp.sira-group.at/api/immobilien
```

#### JavaScript / Axios
```javascript
import axios from 'axios';

const username = 'admin';
const password = 'Sira#1010';
const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

const client = axios.create({
  baseURL: 'https://ftp.sira-group.at/api',
  headers: {
    'Authorization': basicAuth
  }
});

// Verwendung
const response = await client.get('/immobilien');
```

#### JavaScript / Fetch
```javascript
const username = 'admin';
const password = 'Sira#1010';
const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

fetch('https://ftp.sira-group.at/api/immobilien', {
  headers: {
    'Authorization': basicAuth
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Python / Requests
```python
import requests
from requests.auth import HTTPBasicAuth

url = 'https://ftp.sira-group.at/api/immobilien'
auth = HTTPBasicAuth('admin', 'Sira#1010')

response = requests.get(url, auth=auth)
data = response.json()
```

#### PHP
```php
<?php
$username = 'admin';
$password = 'Sira#1010';
$url = 'https://ftp.sira-group.at/api/immobilien';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);
?>
```

#### C# / .NET
```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

var client = new HttpClient();
var credentials = Convert.ToBase64String(
    Encoding.ASCII.GetBytes("admin:Sira#1010")
);
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Basic", credentials);

var response = await client.GetAsync(
    "https://ftp.sira-group.at/api/immobilien"
);
var data = await response.Content.ReadAsStringAsync();
```

#### Java
```java
import java.net.http.*;
import java.util.Base64;

String username = "admin";
String password = "Sira#1010";
String auth = username + ":" + password;
String encodedAuth = Base64.getEncoder()
    .encodeToString(auth.getBytes());

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://ftp.sira-group.at/api/immobilien"))
    .header("Authorization", "Basic " + encodedAuth)
    .build();

HttpResponse<String> response = client.send(
    request,
    HttpResponse.BodyHandlers.ofString()
);
```

#### Postman
1. Request erstellen: `GET https://ftp.sira-group.at/api/immobilien`
2. Tab **"Authorization"** → Type: **"Basic Auth"**
3. Username: `admin`
4. Password: `Sira#1010`

---

## Endpunkte

### 1. Liste aller Immobilien

Gibt eine paginierte Liste von Immobilien mit Filtern zurück.

**Endpoint:** `GET /api/immobilien`

**Query Parameter:**

| Parameter | Typ | Beschreibung | Standard | Beispiel |
|-----------|-----|--------------|----------|----------|
| `page` | Integer | Seitennummer | 1 | `page=2` |
| `limit` | Integer | Anzahl pro Seite (max 100) | 20 | `limit=50` |
| `plz` | String | PLZ-Filter | - | `plz=1010` |
| `preis_min` | Float | Mindestpreis (Kauf oder Miete) | - | `preis_min=200000` |
| `preis_max` | Float | Höchstpreis (Kauf oder Miete) | - | `preis_max=500000` |
| `zimmer_min` | Float | Mindestzimmeranzahl | - | `zimmer_min=3` |
| `objektart` | String | Objekttyp (z.B. "wohnung", "haus") | - | `objektart=wohnung` |
| `vermarktungsart` | String | "KAUF" oder "MIETE_PACHT" | - | `vermarktungsart=KAUF` |
| `search` | String | Volltextsuche (Titel, Beschreibung) | - | `search=balkon` |
| `sort` | String | Sortierung (siehe unten) | `created_desc` | `sort=preis_asc` |

**Sortierungsoptionen:**
- `preis_asc` - Preis aufsteigend
- `preis_desc` - Preis absteigend
- `zimmer_asc` - Zimmer aufsteigend
- `zimmer_desc` - Zimmer absteigend
- `flaeche_asc` - Fläche aufsteigend
- `flaeche_desc` - Fläche absteigend
- `created_asc` - Erstellungsdatum aufsteigend
- `created_desc` - Erstellungsdatum absteigend (Standard)

**Beispiel-Request:**
```
GET /api/immobilien?page=1&limit=20&vermarktungsart=KAUF&preis_max=500000&zimmer_min=3&sort=preis_asc
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "objektnr_intern": "IMM-001",
      "objektnr_extern": "EXT-12345",
      "openimmo_obid": "OBGC20260126093710949c45e5d645b",
      "nutzungsart": "WOHNEN",
      "vermarktungsart": "KAUF",
      "objektart_typ": "wohnung",
      "plz": "1010",
      "ort": "Wien",
      "strasse": "Stephansplatz",
      "hausnummer": "1",
      "lat": 48.208493,
      "lng": 16.373163,
      "wohnflaeche": 85.50,
      "anzahl_zimmer": 3.0,
      "anzahl_badezimmer": 1,
      "grundstuecksflaeche": null,
      "kaufpreis": 450000.00,
      "nettokaltmiete": null,
      "nebenkosten": null,
      "provision_text": "3% zzgl. 20% USt",
      "objekttitel": "Wunderschöne 3-Zimmer Altbauwohnung",
      "objektbeschreibung": "<p>Traumhafte Wohnung im Herzen von Wien...</p>",
      "lage": "<p>Zentrale Lage...</p>",
      "ausstattung": "<p>Hochwertige Ausstattung...</p>",
      "baujahr": 1900,
      "etage": 3,
      "stellplaetze": 1,
      "balkon": true,
      "terrasse": false,
      "garten": false,
      "keller": true,
      "fahrstuhl": false,
      "barrierefrei": false,
      "epass_wert": 85.50,
      "epass_hwbklasse": "C",
      "kontakt_name": "Mag. Maria Musterfrau",
      "kontakt_email": "maria.musterfrau@sira-group.at",
      "kontakt_telefon": "+43 1 234567",
      "kontakt_foto_url": "https://storage.justimmo.at/.../foto.jpg",
      "status": "aktiv",
      "verfuegbar_ab": "2026-03-01",
      "verfuegbar_ab_text": null,
      "sira_status": null,
      "sira_notes": null,
      "sira_priority": 0,
      "created_at": "2026-01-26T10:15:30.000Z",
      "updated_at": "2026-01-26T10:15:30.000Z",
      "titelbild_url": "https://storage.justimmo.at/.../main.jpg"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 55,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 2. Einzelne Immobilie abrufen

Gibt vollständige Details einer Immobilie inkl. aller Bilder zurück.

**Endpoint:** `GET /api/immobilien/:id`

**Path Parameter:**
- `id` (Integer, required) - Immobilien-ID

**Beispiel-Request:**
```
GET /api/immobilien/1
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "objektnr_intern": "IMM-001",
    "objektnr_extern": "EXT-12345",
    "openimmo_obid": "OBGC20260126093710949c45e5d645b",
    "nutzungsart": "WOHNEN",
    "vermarktungsart": "KAUF",
    "objektart_typ": "wohnung",
    "plz": "1010",
    "ort": "Wien",
    "strasse": "Stephansplatz",
    "hausnummer": "1",
    "lat": 48.208493,
    "lng": 16.373163,
    "wohnflaeche": 85.50,
    "anzahl_zimmer": 3.0,
    "anzahl_badezimmer": 1,
    "kaufpreis": 450000.00,
    "nettokaltmiete": null,
    "objekttitel": "Wunderschöne 3-Zimmer Altbauwohnung",
    "objektbeschreibung": "<p>Traumhafte Wohnung...</p>",
    "lage": "<p>Zentrale Lage...</p>",
    "ausstattung": "<p>Hochwertige Ausstattung...</p>",
    "balkon": true,
    "terrasse": false,
    "kontakt_name": "Mag. Maria Musterfrau",
    "kontakt_email": "maria.musterfrau@sira-group.at",
    "kontakt_telefon": "+43 1 234567",
    "verfuegbar_ab": "2026-03-01",
    "verfuegbar_ab_text": null,
    "created_at": "2026-01-26T10:15:30.000Z",
    "updated_at": "2026-01-26T10:15:30.000Z",
    "bilder": [
      {
        "id": 1,
        "immobilie_id": 1,
        "url": "https://storage.justimmo.at/.../image1.jpg",
        "titel": "Wohnzimmer",
        "gruppe": "TITELBILD",
        "reihenfolge": 0,
        "created_at": "2026-01-26T10:15:30.000Z"
      },
      {
        "id": 2,
        "immobilie_id": 1,
        "url": "https://storage.justimmo.at/.../image2.jpg",
        "titel": "Küche",
        "gruppe": "BILD",
        "reihenfolge": 1,
        "created_at": "2026-01-26T10:15:30.000Z"
      },
      {
        "id": 3,
        "immobilie_id": 1,
        "url": "https://storage.justimmo.at/.../grundriss.jpg",
        "titel": "Grundriss",
        "gruppe": "GRUNDRISS",
        "reihenfolge": 2,
        "created_at": "2026-01-26T10:15:30.000Z"
      }
    ]
  }
}
```

---

### 3. Statistiken abrufen

Gibt aggregierte Statistiken über alle Immobilien zurück.

**Endpoint:** `GET /api/immobilien/stats`

**Beispiel-Request:**
```
GET /api/immobilien/stats
```

**Response:**
```json
{
  "data": {
    "total_immobilien": 55,
    "anzahl_kauf": 35,
    "anzahl_miete": 20,
    "avg_kaufpreis": 485000.50,
    "avg_miete": 1250.75,
    "avg_wohnflaeche": 87.30,
    "min_kaufpreis": 150000.00,
    "max_kaufpreis": 2500000.00,
    "min_miete": 450.00,
    "max_miete": 3500.00,
    "objektarten": {
      "wohnung": 42,
      "haus": 8,
      "grundstueck": 3,
      "buero_praxen": 2
    },
    "plz_verteilung": {
      "1010": 12,
      "1020": 8,
      "1030": 15,
      "1040": 10,
      "1050": 10
    }
  }
}
```

---

### 4. Karten-Daten abrufen

Gibt minimale Daten für Karten-Marker zurück (nur Immobilien mit Koordinaten).

**Endpoint:** `GET /api/immobilien/map`

**Query Parameter:**

| Parameter | Typ | Beschreibung | Beispiel |
|-----------|-----|--------------|----------|
| `plz` | String | PLZ-Filter (optional) | `plz=1010` |
| `preis_min` | Float | Mindestpreis (optional) | `preis_min=200000` |
| `preis_max` | Float | Höchstpreis (optional) | `preis_max=500000` |

**Beispiel-Request:**
```
GET /api/immobilien/map?plz=1010
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "lat": 48.208493,
      "lng": 16.373163,
      "objekttitel": "Wunderschöne 3-Zimmer Altbauwohnung",
      "kaufpreis": 450000.00,
      "nettokaltmiete": null,
      "vermarktungsart": "KAUF",
      "plz": "1010",
      "ort": "Wien",
      "titelbild_url": "https://storage.justimmo.at/.../main.jpg"
    },
    {
      "id": 2,
      "lat": 48.210033,
      "lng": 16.363449,
      "objekttitel": "Moderne 2-Zimmer Wohnung zur Miete",
      "kaufpreis": null,
      "nettokaltmiete": 1200.00,
      "vermarktungsart": "MIETE_PACHT",
      "plz": "1010",
      "ort": "Wien",
      "titelbild_url": "https://storage.justimmo.at/.../main2.jpg"
    }
  ]
}
```

---

### 5. Import-Logs abrufen

Gibt eine Liste der XML-Import-Protokolle zurück.

**Endpoint:** `GET /api/import-logs`

**Query Parameter:**

| Parameter | Typ | Beschreibung | Standard | Beispiel |
|-----------|-----|--------------|----------|----------|
| `page` | Integer | Seitennummer | 1 | `page=1` |
| `limit` | Integer | Anzahl pro Seite (max 100) | 20 | `limit=10` |

**Beispiel-Request:**
```
GET /api/import-logs?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": 5,
      "filename": "openimmo.zip/openimmo.xml",
      "status": "success",
      "properties_inserted": 5,
      "properties_updated": 50,
      "properties_errors": 0,
      "error_message": null,
      "started_at": "2026-01-26T10:15:25.000Z",
      "completed_at": "2026-01-26T10:15:35.000Z",
      "duration_seconds": 10
    },
    {
      "id": 4,
      "filename": "openimmo.xml",
      "status": "success",
      "properties_inserted": 55,
      "properties_updated": 0,
      "properties_errors": 0,
      "error_message": null,
      "started_at": "2026-01-25T08:30:15.000Z",
      "completed_at": "2026-01-25T08:30:28.000Z",
      "duration_seconds": 13
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

### 6. Letzter Import

Gibt den zuletzt durchgeführten Import zurück.

**Endpoint:** `GET /api/import-logs/latest`

**Beispiel-Request:**
```
GET /api/import-logs/latest
```

**Response:**
```json
{
  "data": {
    "id": 5,
    "filename": "openimmo.zip/openimmo.xml",
    "status": "success",
    "properties_inserted": 5,
    "properties_updated": 50,
    "properties_errors": 0,
    "error_message": null,
    "started_at": "2026-01-26T10:15:25.000Z",
    "completed_at": "2026-01-26T10:15:35.000Z",
    "duration_seconds": 10
  }
}
```

---

### 7. Import-Statistiken

Gibt aggregierte Statistiken über alle Imports zurück.

**Endpoint:** `GET /api/import-logs/stats`

**Beispiel-Request:**
```
GET /api/import-logs/stats
```

**Response:**
```json
{
  "data": {
    "total_imports": 5,
    "successful_imports": 5,
    "failed_imports": 0,
    "total_inserted": 55,
    "total_updated": 125,
    "total_errors": 0,
    "avg_duration_seconds": 12,
    "last_import_at": "2026-01-26T10:15:25.000Z"
  }
}
```

---

## Health Check

Überprüft, ob die API läuft.

**Endpoint:** `GET /health`

**Beispiel-Request:**
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T10:20:30.000Z",
  "uptime": 3600.5
}
```

---

## Fehlerbehandlung

Bei Fehlern gibt die API standardisierte Fehler-Responses zurück:

**400 Bad Request** - Ungültige Parameter
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "page",
      "message": "page must be an integer greater than or equal to 1"
    }
  ]
}
```

**404 Not Found** - Ressource nicht gefunden
```json
{
  "error": "Immobilie nicht gefunden"
}
```

**500 Internal Server Error** - Serverfehler
```json
{
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

---

## CORS

Die API erlaubt Anfragen von folgenden Origins:
- `https://ftp.sira-group.at`
- `https://www.sira-group.at`

---

## Datentypen

### Immobilie

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | Integer | Interne ID |
| `objektnr_intern` | String | Interne Objektnummer |
| `objektnr_extern` | String | Externe Objektnummer (Justimmo) |
| `openimmo_obid` | String | Eindeutige OpenImmo ID |
| `nutzungsart` | String | "WOHNEN" oder "GEWERBE" |
| `vermarktungsart` | String | "KAUF" oder "MIETE_PACHT" |
| `objektart_typ` | String | z.B. "wohnung", "haus", "grundstueck" |
| `plz` | String | Postleitzahl |
| `ort` | String | Ort |
| `strasse` | String | Straße |
| `hausnummer` | String | Hausnummer |
| `lat` | Decimal | Breitengrad |
| `lng` | Decimal | Längengrad |
| `wohnflaeche` | Decimal | Wohnfläche in m² |
| `anzahl_zimmer` | Decimal | Anzahl Zimmer |
| `anzahl_badezimmer` | Integer | Anzahl Badezimmer |
| `grundstuecksflaeche` | Decimal | Grundstücksfläche in m² |
| `kaufpreis` | Decimal | Kaufpreis in EUR |
| `nettokaltmiete` | Decimal | Nettokaltmiete in EUR |
| `nebenkosten` | Decimal | Nebenkosten in EUR |
| `provision_text` | Text | Provisionstext |
| `objekttitel` | Text | Objekttitel |
| `objektbeschreibung` | HTML | Objektbeschreibung (HTML) |
| `lage` | HTML | Lagebeschreibung (HTML) |
| `ausstattung` | HTML | Ausstattungsbeschreibung (HTML) |
| `baujahr` | Integer | Baujahr |
| `etage` | Integer | Etage |
| `stellplaetze` | Integer | Anzahl Stellplätze |
| `balkon` | Boolean | Hat Balkon |
| `terrasse` | Boolean | Hat Terrasse |
| `garten` | Boolean | Hat Garten |
| `keller` | Boolean | Hat Keller |
| `fahrstuhl` | Boolean | Hat Fahrstuhl |
| `barrierefrei` | Boolean | Ist barrierefrei |
| `epass_wert` | Decimal | Energieausweis HWB-Wert |
| `epass_hwbklasse` | String | Energieausweis Klasse (A++ bis G) |
| `kontakt_name` | String | Kontaktperson Name |
| `kontakt_email` | String | Kontaktperson E-Mail |
| `kontakt_telefon` | String | Kontaktperson Telefon |
| `kontakt_foto_url` | String | Kontaktperson Foto URL |
| `status` | String | "aktiv" oder "inaktiv" |
| `verfuegbar_ab` | Date | Verfügbar ab (ISO 8601) |
| `verfuegbar_ab_text` | String | Verfügbarkeit als Text (z.B. "Nach Vereinbarung", "SOFORT") |
| `created_at` | Timestamp | Erstellungsdatum |
| `updated_at` | Timestamp | Letztes Update |

### Bild

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | Integer | Bild-ID |
| `immobilie_id` | Integer | Zugehörige Immobilien-ID |
| `url` | String | Externe Bild-URL (Justimmo Storage) |
| `titel` | String | Bildtitel |
| `gruppe` | String | "TITELBILD", "BILD", oder "GRUNDRISS" |
| `reihenfolge` | Integer | Sortierreihenfolge |
| `created_at` | Timestamp | Erstellungsdatum |

---

## Hinweise

- Alle Preise sind in EUR
- Alle Flächen sind in m²
- HTML-Content in `objektbeschreibung`, `lage`, `ausstattung` wird serverseitig mit DOMPurify sanitized
- Timestamps im ISO 8601 Format (UTC)
- Bilder werden von Justimmo gehostet (externe URLs)
- Die API unterstützt Gzip-Kompression

---

## Kontakt

Bei Fragen zur API: [SIRA Support](mailto:support@sira-group.at)
