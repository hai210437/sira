# SIRA Website - Immobilien Portal

## 🚀 Quick Start

### Frontend starten

```bash
cd frontend
npm install   # Dependencies installieren (nur einmal nötig)
npm run dev   # Development-Server starten → http://localhost:5173
```

Das war's! Das Backend wird **nicht mehr gebraucht**, da wir jetzt direkt die SIRA API nutzen.

## 📦 Production Build

```bash
cd frontend
npm run build   # Erstellt dist/ Ordner
npm run preview # Build lokal testen
```

## 🔧 API-Konfiguration

Die Credentials sind in `frontend/.env` gespeichert:

```env
VITE_API_BASE_URL=https://ftp.sira-group.at/api
VITE_API_USERNAME=admin
VITE_API_PASSWORD=Sira#1010
```

## 📁 Projekt-Struktur

```
sira/
├── frontend/              # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Immobilien/        # Listing (Filter + Pagination)
│   │   │   ├── Immo-Details/      # Detailansicht
│   │   │   └── RealEstate/        # Showcase (5 neueste)
│   │   ├── services/
│   │   │   └── api.ts             # Zentrale API mit Basic Auth
│   │   └── components/
│   ├── .env                       # API Credentials
│   └── package.json
├── backend/               # ⚠️ VERALTET - nicht mehr benutzen!
└── README.md             # Diese Datei
```

## ✨ Features der neuen API

✅ **Server-seitige Pagination** - Nur 10-20 Immobilien pro Request
✅ **8+ Filter** - Vermarktungsart, Objektart, Zimmer, PLZ, Preis, Suche
✅ **8 Sortierungen** - Preis, Zimmer, Fläche, Datum (auf/absteigend)
✅ **Direkter Detail-Zugriff** - `/api/immobilien/:id` statt alle laden
✅ **Mehr Daten** - Energieausweis, Kontaktdaten, alle Bilder, Ausstattung
✅ **TypeScript** - Vollständige Typen für alle API-Responses

## 🌐 API-Endpunkte

| Endpoint | Beschreibung |
|----------|--------------|
| `GET /api/immobilien` | Liste mit Filter & Pagination |
| `GET /api/immobilien/:id` | Einzelne Immobilie mit Details |
| `GET /api/immobilien/stats` | Statistiken |
| `GET /api/immobilien/map` | Karten-optimierte Daten |

Details siehe: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)

## 🔄 Migration (Alt → Neu)

**Alt:**
`Frontend → Express Backend (Port 67) → JustImmo API`

**Neu:**
`Frontend → SIRA API (https://ftp.sira-group.at/api)` ✅

Das alte Backend wird **nicht mehr benötigt**!

## 🛠️ Tech Stack

- **React 18** + TypeScript + Vite
- **React Router v7** - Navigation
- **i18next** - Mehrsprachigkeit (DE/EN)
- **GSAP** - Animationen
- **EmailJS** - Kontaktformular
- **Google Maps API** - Karten

## 🐛 Troubleshooting

### CORS-Fehler
Die API muss diese Origins erlauben:
- `http://localhost:5173` (Development)
- `https://ftp.sira-group.at`
- `https://www.sira-group.at`

### 401 Unauthorized
Prüfe `frontend/.env`:
- Username: `admin`
- Password: `Sira#1010`

### Build-Fehler
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📤 Deployment

```bash
cd frontend
npm run build   # Erstellt dist/ Ordner
# Dann dist/ auf Server hochladen (Netlify, Vercel, nginx, etc.)
```
