// SIRA API Service mit Basic Authentication

// API Konfiguration
// Development: /api (über Vite Proxy in vite.config.ts)
// Production: https://ftp.sira-group.at/api (über Docker Environment Variables)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const API_USERNAME = import.meta.env.VITE_API_USERNAME || 'admin';
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;

// Sicherheitscheck: In Production MUSS das Passwort aus Environment kommen
if (!API_PASSWORD && import.meta.env.PROD) {
  throw new Error('VITE_API_PASSWORD muss in Production gesetzt sein!');
}

// Fallback für lokale Entwicklung (nur wenn nicht in Production)
const API_PASSWORD_FINAL = API_PASSWORD || (import.meta.env.DEV ? 'Sira#1010' : '');

// Basic Auth Header generieren
const getAuthHeader = (): string => {
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD_FINAL}`);
  return `Basic ${credentials}`;
};

// TypeScript Interfaces für API Responses
export interface Immobilie {
  id: number;
  objektnr_intern: string | null;
  objektnr_extern: string | null;
  openimmo_obid: string | null;
  nutzungsart: string | null;
  vermarktungsart: 'KAUF' | 'MIETE_PACHT' | null;
  objektart_typ: string | null;
  plz: string | null;
  ort: string | null;
  strasse: string | null;
  hausnummer: string | null;
  lat: number | null;
  lng: number | null;
  wohnflaeche: number | null;
  anzahl_zimmer: number | null;
  anzahl_badezimmer: number | null;
  grundstuecksflaeche: number | null;
  kaufpreis: number | null;
  nettokaltmiete: number | null;
  nebenkosten: number | null;
  provision_text: string | null;
  objekttitel: string | null;
  objektbeschreibung: string | null;
  lage: string | null;
  ausstattung: string | null;
  baujahr: number | null;
  etage: number | null;
  stellplaetze: number | null;
  balkon: boolean | null;
  terrasse: boolean | null;
  garten: boolean | null;
  keller: boolean | null;
  fahrstuhl: boolean | null;
  barrierefrei: boolean | null;
  epass_wert: number | null;
  epass_hwbklasse: string | null;
  kontakt_name: string | null;
  kontakt_email: string | null;
  kontakt_telefon: string | null;
  kontakt_foto_url: string | null;
  status: string | null;
  verfuegbar_ab: string | null;
  verfuegbar_ab_text: string | null;
  sira_status: string | null;
  sira_notes: string | null;
  sira_priority: number | null;
  created_at: string;
  updated_at: string;
  titelbild_url: string | null;
  bilder?: Bild[];
}

export interface Bild {
  id: number;
  immobilie_id: number;
  url: string;
  titel: string | null;
  gruppe: 'TITELBILD' | 'BILD' | 'GRUNDRISS';
  reihenfolge: number;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ImmobilienListResponse {
  data: Immobilie[];
  pagination: Pagination;
}

export interface ImmobilieDetailResponse {
  data: Immobilie;
}

export interface ImmobilienStats {
  total_immobilien: number;
  anzahl_kauf: number;
  anzahl_miete: number;
  avg_kaufpreis: number;
  avg_miete: number;
  avg_wohnflaeche: number;
  min_kaufpreis: number;
  max_kaufpreis: number;
  min_miete: number;
  max_miete: number;
  objektarten: Record<string, number>;
  plz_verteilung: Record<string, number>;
}

export interface MapImmobilie {
  id: number;
  lat: number;
  lng: number;
  objekttitel: string;
  kaufpreis: number | null;
  nettokaltmiete: number | null;
  vermarktungsart: string;
  plz: string;
  ort: string;
  titelbild_url: string | null;
}

// Filter-Parameter für Immobilien-Liste
export interface ImmobilienFilter {
  page?: number;
  limit?: number;
  plz?: string;
  preis_min?: number;
  preis_max?: number;
  zimmer_min?: number;
  objektart?: string;
  vermarktungsart?: 'KAUF' | 'MIETE_PACHT';
  search?: string;
  sort?: 'preis_asc' | 'preis_desc' | 'zimmer_asc' | 'zimmer_desc' |
         'flaeche_asc' | 'flaeche_desc' | 'created_asc' | 'created_desc';
}

// API Error Handler
export class ApiError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper: Query-Parameter aus Objekt erstellen
const buildQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

  return filtered.length > 0 ? `?${filtered.join('&')}` : '';
};

// Generische Fetch-Funktion mit Auth
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Fallback auf Status-Text wenn JSON-Parsing fehlschlägt
    }

    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
};

// API Funktionen

/**
 * Holt eine paginierte Liste von Immobilien mit Filtern
 */
export const getImmobilien = async (filters: ImmobilienFilter = {}): Promise<ImmobilienListResponse> => {
  const queryString = buildQueryString(filters);
  return apiFetch<ImmobilienListResponse>(`/immobilien${queryString}`);
};

/**
 * Holt eine einzelne Immobilie mit allen Details und Bildern
 */
export const getImmobilieById = async (id: number): Promise<ImmobilieDetailResponse> => {
  return apiFetch<ImmobilieDetailResponse>(`/immobilien/${id}`);
};

/**
 * Holt Statistiken über alle Immobilien
 */
export const getImmobilienStats = async (): Promise<{ data: ImmobilienStats }> => {
  return apiFetch<{ data: ImmobilienStats }>('/immobilien/stats');
};

/**
 * Holt optimierte Daten für Karten-Marker
 */
export const getMapImmobilien = async (filters: Partial<ImmobilienFilter> = {}): Promise<{ data: MapImmobilie[] }> => {
  const queryString = buildQueryString(filters);
  return apiFetch<{ data: MapImmobilie[] }>(`/immobilien/map${queryString}`);
};

/**
 * Health Check
 */
export const healthCheck = async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
  return apiFetch<{ status: string; timestamp: string; uptime: number }>('/health');
};
