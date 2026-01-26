import "./Immobilien.css";
import NavBar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Helmet from "react-helmet";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import { Link } from "react-router-dom";
import { getImmobilien, ApiError } from "../../services/api";
import type { Immobilie, Pagination } from "../../services/api";

const Immobilien: React.FC = () => {
    const [immobilien, setImmobilien] = useState<Immobilie[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [filterPreisMin, setFilterPreisMin] = useState("");
    const [filterPreisMax, setFilterPreisMax] = useState("");
    const [filterZimmerMin, setFilterZimmerMin] = useState("");
    const [filterPLZ, setFilterPLZ] = useState("");
    const [filterVermarktungsart, setFilterVermarktungsart] = useState<"" | "KAUF" | "MIETE_PACHT">("");
    const [filterObjektart, setFilterObjektart] = useState("");
    const [filterSuche, setFilterSuche] = useState("");
    const [filterSort, setFilterSort] = useState<"" | "preis_asc" | "preis_desc" | "zimmer_asc" | "zimmer_desc" | "flaeche_asc" | "flaeche_desc" | "created_asc" | "created_desc">("preis_desc");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Immobilien laden
    const loadImmobilien = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getImmobilien({
                page,
                limit: ITEMS_PER_PAGE,
                plz: filterPLZ || undefined,
                preis_min: filterPreisMin ? Number(filterPreisMin) : undefined,
                preis_max: filterPreisMax ? Number(filterPreisMax) : undefined,
                zimmer_min: filterZimmerMin ? Number(filterZimmerMin) : undefined,
                vermarktungsart: filterVermarktungsart || undefined,
                objektart: filterObjektart || undefined,
                search: filterSuche || undefined,
                sort: filterSort || undefined,
            });

            setImmobilien(response.data);
            setPagination(response.pagination);
            setCurrentPage(page);
        } catch (err) {
            console.error("Failed to load immobilien:", err);
            if (err instanceof ApiError) {
                setError(`Fehler beim Laden: ${err.message}`);
            } else {
                setError("Fehler beim Laden der Immobilien");
            }
            setImmobilien([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        loadImmobilien(1);
    }, []);

    // Suche ausführen
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadImmobilien(1); // Bei neuer Suche zurück zu Seite 1
    };

    // Seite wechseln
    const goToPage = (page: number) => {
        if (pagination && page >= 1 && page <= pagination.totalPages) {
            loadImmobilien(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Preis ermitteln (Kauf oder Miete)
    const getPreis = (immo: Immobilie): number | null => {
        return immo.vermarktungsart === 'KAUF' ? immo.kaufpreis : immo.nettokaltmiete;
    };

    // Preis-Label ermitteln
    const getPreisLabel = (immo: Immobilie): string => {
        return immo.vermarktungsart === 'KAUF' ? 'Kaufpreis' : 'Miete';
    };

    if (loading && immobilien.length === 0) {
        return (
            <>
                <NavBar isLandingpage={false} />
                <div className="loading" style={{ padding: "4rem", textAlign: "center" }}>
                    Lade Immobilien…
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Immobilien kaufen und mieten in Wien | SIRA Group</title>
                <meta name="description" content="Entdecken Sie aktuelle Wohnungen, Häuser und Gewerbeimmobilien zum Kauf oder zur Miete in Wien und Umgebung. ✓ Professionelle Beratung ✓ Exklusive Objekte ✓ SIRA Group" />

                {/* Open Graph */}
                <meta property="og:title" content="Immobilien kaufen und mieten in Wien | SIRA Group" />
                <meta property="og:description" content="Entdecken Sie aktuelle Wohnungen, Häuser und Gewerbeimmobilien zum Kauf oder zur Miete in Wien." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sira-group.at/immobilien" />
            </Helmet>

            <NavBar isLandingpage={false} />

            {/* Suchformular */}
            <form
                onSubmit={handleSearch}
                style={{
                    maxWidth: '1200px',
                    margin: '2rem auto',
                    padding: '2rem',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
            >
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>
                    Immobiliensuche
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                }}>
                    {/* Vermarktungsart */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            Vermarktungsart
                        </label>
                        <select
                            value={filterVermarktungsart}
                            onChange={(e) => setFilterVermarktungsart(e.target.value as "" | "KAUF" | "MIETE_PACHT")}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                background: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Alle</option>
                            <option value="KAUF">Kauf</option>
                            <option value="MIETE_PACHT">Miete</option>
                        </select>
                    </div>

                    {/* Objektart */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            Objektart
                        </label>
                        <select
                            value={filterObjektart}
                            onChange={(e) => setFilterObjektart(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                background: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Alle</option>
                            <option value="wohnung">Wohnung</option>
                            <option value="haus">Haus</option>
                            <option value="grundstueck">Grundstück</option>
                            <option value="buero_praxen">Büro/Praxis</option>
                        </select>
                    </div>

                    {/* PLZ */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            PLZ
                        </label>
                        <input
                            type="text"
                            placeholder="z.B. 1010"
                            value={filterPLZ}
                            onChange={(e) => setFilterPLZ(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    {/* Zimmer */}
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            Zimmer (min)
                        </label>
                        <input
                            type="number"
                            placeholder="z.B. 3"
                            value={filterZimmerMin}
                            onChange={(e) => setFilterZimmerMin(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </div>
                </div>

                {/* Preis Range */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#555',
                        fontSize: '0.9rem',
                    }}>
                        Preis (€)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="number"
                            placeholder="von"
                            value={filterPreisMin}
                            onChange={(e) => setFilterPreisMin(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                        <input
                            type="number"
                            placeholder="bis"
                            value={filterPreisMax}
                            onChange={(e) => setFilterPreisMax(e.target.value)}
                            style={{
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </div>
                </div>

                {/* Suchbegriff & Sortierung */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            Suchbegriff
                        </label>
                        <input
                            type="text"
                            placeholder="Suche in Titel/Beschreibung"
                            value={filterSuche}
                            onChange={(e) => setFilterSuche(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: '600',
                            color: '#555',
                            fontSize: '0.9rem',
                        }}>
                            Sortierung
                        </label>
                        <select
                            value={filterSort}
                            onChange={(e) => setFilterSort(e.target.value as any)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                background: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="created_desc">Neueste zuerst</option>
                            <option value="created_asc">Älteste zuerst</option>
                            <option value="preis_asc">Preis aufsteigend</option>
                            <option value="preis_desc">Preis absteigend</option>
                            <option value="zimmer_asc">Zimmer aufsteigend</option>
                            <option value="zimmer_desc">Zimmer absteigend</option>
                            <option value="flaeche_asc">Fläche aufsteigend</option>
                            <option value="flaeche_desc">Fläche absteigend</option>
                        </select>
                    </div>
                </div>

                {/* Suchen Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: loading ? '#ccc' : 'var(--basic-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#001a4d')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--basic-blue)')}
                >
                    {loading ? "Lädt..." : "Suchen"}
                </button>
            </form>

            {/* Fehler-Anzeige */}
            {error && (
                <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                    {error}
                </div>
            )}

            {/* Ergebnis-Info */}
            {pagination && (
                <div style={{ padding: "1rem", textAlign: "center", fontSize: "0.95rem", color: "#666" }}>
                    {pagination.total} Immobilie{pagination.total !== 1 ? 'n' : ''} gefunden
                    {pagination.total > 0 && ` (Seite ${pagination.page} von ${pagination.totalPages})`}
                </div>
            )}

            {/* Pagination oben */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={!pagination.hasPreviousPage || loading}
                    >
                        «
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                            disabled={loading}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                    >
                        »
                    </button>
                </div>
            )}

            {/* Immobilienliste */}
            <div className="immobilien-list">
                {immobilien.map((immo) => {
                    const preis = getPreis(immo);
                    const preisLabel = getPreisLabel(immo);

                    return (
                        <Link
                            to={`/immobilien/${immo.id}`}
                            key={immo.id}
                            style={{ textDecoration: "none" }}
                        >
                            <div className="immobilienblock">
                                <div className="immo-bild-links one">
                                    {immo.titelbild_url && (
                                        <img
                                            src={immo.titelbild_url}
                                            alt={immo.objekttitel || 'Immobilie'}
                                            className="erstes-bild"
                                        />
                                    )}
                                </div>

                                <div className="beschreibung rechts">
                                    <h2 className="immo-titel">{immo.objekttitel || 'Ohne Titel'}</h2>
                                    <h3>
                                        {immo.plz} {immo.ort}
                                    </h3>

                                    <table className="immo-details-table">
                                        <thead>
                                            <tr>
                                                {immo.anzahl_zimmer != null && <th>Zimmer</th>}
                                                {immo.wohnflaeche != null && <th>Wohnfläche</th>}
                                                <th>{preisLabel}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {immo.anzahl_zimmer != null && (
                                                    <td>{Math.floor(immo.anzahl_zimmer)}</td>
                                                )}
                                                {immo.wohnflaeche != null && (
                                                    <td>{immo.wohnflaeche} m²</td>
                                                )}
                                                <td>
                                                    {preis && preis > 0
                                                        ? new Intl.NumberFormat('de-AT', {
                                                              style: 'currency',
                                                              currency: 'EUR',
                                                          }).format(preis)
                                                        : 'Preis auf Anfrage'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Keine Ergebnisse */}
                {immobilien.length === 0 && !loading && !error && (
                    <div style={{ padding: "3rem", textAlign: "center", fontSize: "1.1rem" }}>
                        Keine Immobilien gefunden. Bitte passen Sie Ihre Suchkriterien an.
                    </div>
                )}
            </div>

            {/* Pagination unten */}
            {pagination && pagination.totalPages > 1 && (
                <div className="pagination bottom">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={!pagination.hasPreviousPage || loading}
                    >
                        «
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                            disabled={loading}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                    >
                        »
                    </button>
                </div>
            )}

            <Kontaktformular isKontaktSeite={false} />
            <Footer />
        </>
    );
};

export default Immobilien;
