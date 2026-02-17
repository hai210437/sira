# SEO & Kontaktformular Fixes – Changelog

**Datum:** 17.02.2026
**Branch:** `feature/sira-api-migration-seo-optimierung`

---

## 1. Individuelle Title-Tags + Meta-Descriptions (Prio 1)

Jede Seite hat jetzt einen **einzigartigen Title-Tag** und eine **aussagekräftige Meta-Description** (120-155 Zeichen).

| Seite | Neuer Title | Meta-Description |
|-------|-------------|-----------------|
| `/` (LandingPage) | SIRA Group – Ihr Partner für Immobilienlösungen in Wien | SIRA Group ist Ihr verlässlicher Immobilienpartner in Wien. Verkauf, Vermietung, Finanzierung und Beratung... |
| `/real-estate` | Immobilien kaufen & mieten in Wien – SIRA Real Estate | SIRA Real Estate: Immobilienverkauf, Vermietung und Bewertung in Wien... |
| `/finance` | Immobilienfinanzierung Wien – SIRA Finance | SIRA Finance: Professionelle Immobilienfinanzierung und Beratung in Wien... |
| `/services` | Immobilien-Services & Partner Wien – SIRA Group | Umfassende Immobilien-Dienstleistungen und starke Partnerschaften in Wien... |
| `/team` | Unser Team – Immobilienexperten Wien \| SIRA Group | Lernen Sie das SIRA Group Team kennen: Erfahrene Immobilienexperten in Wien... |
| `/kontakt` | Kontakt – Immobilienberatung Wien \| SIRA Group | Kontaktieren Sie die SIRA Group in Wien: Kärntnerstraße 21-23, 1010 Wien... |
| `/immobilien` | Immobilien kaufen und mieten in Wien und Umgebung \| SIRA Group | *(war bereits gut, leicht verbessert)* |
| `/immobilien/:id` | *(dynamisch: Objekttitel \| SIRA Group)* | *(war bereits dynamisch implementiert)* |
| `/impressum` | Impressum \| SIRA Group – Immobilien Wien | Impressum der SIRA Group GmbH. Firmensitz... |
| `/datenschutz` | Datenschutzerklärung \| SIRA Group – Immobilien Wien | Datenschutzerklärung der SIRA Group GmbH... |

**Geänderte Dateien:**
- `src/pages/LandingPage/LandingPage.tsx`
- `src/pages/RealEstate/RealEstate.tsx`
- `src/pages/Finance/Finance.tsx`
- `src/pages/Services/Services.tsx`
- `src/pages/Team/Team.tsx`
- `src/pages/Kontakt/Kontakt.tsx`
- `src/pages/Impressum/Impressum.tsx`
- `src/pages/Datenschutz/Datenschutz.tsx`
- `src/pages/Immobilien/Immobilien.tsx`

---

## 2. Open Graph + Twitter Card Tags (Prio 5)

Alle Hauptseiten haben jetzt **vollständige OG-Tags** (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`) und **Twitter Card Tags** (`twitter:card`, `twitter:title`, `twitter:description`).

- Impressum und Datenschutz haben bewusst **keine** OG-Tags (nicht relevant für Social Sharing)
- Die Immobilien-Detailseite hatte bereits dynamische OG-Tags – ergänzt um `og:site_name`

**Hinweis:** Das OG-Image `https://sira-group.at/assets/social-preview.jpg` muss als Datei vorhanden sein (mind. 1200x630px empfohlen). Falls noch nicht vorhanden: erstellen und unter `public/assets/social-preview.jpg` ablegen.

---

## 3. Canonical Tags (Prio 6)

Jede Seite hat jetzt einen `<link rel="canonical">` Tag mit der vollständigen URL. Das verhindert Duplicate-Content-Probleme.

**Implementierung:** Via `react-helmet` in jeder Page-Komponente.

---

## 4. Alt-Texte für Bilder (Prio 4)

Fehlende oder generische `alt`-Attribute wurden ergänzt:

| Seite | Vorher | Nachher |
|-------|--------|---------|
| RealEstate | `alt` fehlte beim Wien-Panorama | `"Wien Panorama – SIRA Real Estate Immobilien"` |
| Finance | `alt` fehlte bei beiden Bildern | Beschreibende Alt-Texte ergänzt |
| Services | `alt` fehlte beim Wien-Panorama + Partner-Logos | Beschreibende Alt-Texte ergänzt |
| Team | `"Team member 1"` (generisch) | `"{Name} – {Position} bei SIRA Group"` (dynamisch) |

---

## 5. Heading-Hierarchie (H1) (Prio 2)

- **Team-Seite:** Der Team-Header war ein `<h2>` → jetzt `<h1>`
- **Kontakt-Seite:** Der Kontakt-Header war ein `<h2>` → jetzt `<h1>`
- Alle anderen Seiten hatten bereits korrekte H1-Tags

---

## 6. Impressum/Datenschutz: `noindex` (Best Practice)

Impressum und Datenschutz haben jetzt `<meta name="robots" content="noindex, follow" />`. Diese Seiten sollen nicht in Google erscheinen (kein SEO-Wert), aber die Links darauf sollen weiterverfolgt werden.

---

## 7. Sitemap erweitert (Prio 8 teilw.)

`public/sitemap.xml` wurde um 3 URLs erweitert:

| URL | Priorität | Änderungsfrequenz |
|-----|-----------|-------------------|
| `/immobilien` | 0.9 | daily |
| `/impressum` | 0.3 | yearly |
| `/datenschutz` | 0.3 | yearly |

**Gesamt:** 6 → 9 URLs in der Sitemap

---

## 8. Kontaktformular: Immobilientitel in der Email

### Problem
Wenn jemand über eine Immobilien-Detailseite (z.B. `/immobilien/39`) das Kontaktformular nutzt, kam in der Email nur ein Link ohne Kontext. Der Immobilientitel fehlte.

### Lösung
Das `Kontaktformular`-Komponent akzeptiert jetzt zwei neue optionale Props:

```tsx
interface KontaktformularProps {
    isKontaktSeite: boolean;
    immobilienTitel?: string;  // NEU
    immobilienUrl?: string;    // NEU
}
```

Auf der `ImmobilienDetails`-Seite werden Titel und URL übergeben:

```tsx
<Kontaktformular
    isKontaktSeite={false}
    immobilienTitel={immobilie.objekttitel}
    immobilienUrl={`https://sira-group.at/immobilien/${immobilie.id}`}
/>
```

Das Frontend schickt `immobilienTitel` als Teil des JSON-Payloads an das Backend (`/api/contact`). Das Backend (Microsoft Graph API) baut den Titel direkt in die HTML-Email ein:

- **Email-Betreff** enthält den Immobilientitel: `Neue Anfrage: RESIDIEREN ÜBER DEN WEINBERGEN... – von Max Mustermann`
- **Email-Body** zeigt den Titel fett über dem Link im blauen Header-Bereich

Beispiel bei Anfrage von `/immobilien/39`:
- Betreff: `Neue Anfrage: RESIDIEREN ÜBER DEN WEINBERGEN | Erstbezug | 4 Zimmer... – von Max Mustermann`
- Body: Titel + Link zur Immobilie im blauen Banner

Bei Anfragen ohne Immobilienbezug (z.B. von `/kontakt`) bleibt alles wie bisher.

**Geänderte Dateien:**
- `src/components/Kontaktformular/Kontaktformular.tsx` (neues Prop `immobilienTitel`, wird im JSON-Payload mitgeschickt)
- `src/pages/Immo-Details/ImmobilienDetails.tsx` (übergibt `immobilienTitel` an Kontaktformular)
- `sira/backend/index.js` (liest `immobilienTitel`, zeigt es in Email-Betreff und Body)

---

## Zusammenfassung der SEO-Bewertungsverbesserung

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| Title-Tags | Gleich auf allen Seiten | Individuell pro Seite |
| Meta-Descriptions | Fehlend/zu kurz | 120-155 Zeichen, individuell |
| Open Graph Tags | Nur auf 2 Seiten | Auf allen Hauptseiten |
| Twitter Cards | Nur auf 1 Seite | Auf allen Hauptseiten |
| Canonical Tags | Fehlend | Auf allen Seiten |
| Alt-Texte | Teilweise fehlend/generisch | Beschreibend und spezifisch |
| H1-Hierarchie | Teilweise fehlend | Jede Seite hat genau eine H1 |
| Sitemap | 6 URLs | 9 URLs |

**Erwartete SEO-Note:** 4/10 → ca. 7-8/10

---

## Offene Punkte / TODO für Markus

1. ~~Email-Template anpassen~~ – **Erledigt!** Immobilientitel wird jetzt direkt im Backend (Microsoft Graph) in Betreff und Body eingebaut
2. **Social Preview Bild** – `public/assets/social-preview.jpg` erstellen (1200x630px) falls noch nicht vorhanden
3. **Content ausbauen** – Jede Seite sollte mind. 300-500 Wörter indexierbaren Text haben (SEO Audit Prio 3)
4. **Blog/Ratgeber** – Content-Strategie für mehr indexierbare Seiten (SEO Audit Prio 7)
5. **Google Business Profile** – Lokale SEO stärken (SEO Audit Prio 8)
