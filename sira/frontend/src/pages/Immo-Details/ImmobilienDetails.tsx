import "./ImmobilienDetails.css";
import NavBar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import Helmet from "react-helmet";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import { useParams } from "react-router-dom";
import { getImmobilieById, ApiError } from "../../services/api";
import type { Immobilie } from "../../services/api";

const ImmobilienDetails: React.FC = () => {
    const [immobilie, setImmobilie] = useState<Immobilie | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const { id: immoid } = useParams();

    useEffect(() => {
        const loadImmobilie = async () => {
            if (!immoid) {
                setError("Keine Immobilien-ID angegeben");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getImmobilieById(Number(immoid));
                setImmobilie(response.data);
            } catch (err) {
                console.error("Failed to load immobilie:", err);
                if (err instanceof ApiError) {
                    setError(err.status === 404
                        ? "Immobilie nicht gefunden"
                        : `Fehler beim Laden: ${err.message}`);
                } else {
                    setError("Fehler beim Laden der Immobilie");
                }
                setImmobilie(null);
            } finally {
                setLoading(false);
            }
        };

        loadImmobilie();
    }, [immoid]);

    if (loading) {
        return (
            <>
                <NavBar isLandingpage={false} />
                <div className="loading" style={{ padding: "4rem", textAlign: "center", fontFamily: "Amiko" }}>
                    Lade Immobilie …
                </div>
            </>
        );
    }

    if (error || !immobilie) {
        return (
            <>
                <NavBar isLandingpage={false} />
                <div style={{
                    maxWidth: '600px',
                    margin: '4rem auto',
                    padding: '2rem',
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#856404', marginBottom: '1rem', fontFamily: 'Amiko' }}>Fehler</h2>
                    <p style={{ color: '#856404', margin: 0, fontFamily: 'Amiko' }}>
                        {error || "Immobilie nicht gefunden"}
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    // Preis ermitteln (je nach Vermarktungsart)
    const preis = immobilie.vermarktungsart === 'KAUF'
        ? immobilie.kaufpreis
        : immobilie.nettokaltmiete;
    const preisLabel = immobilie.vermarktungsart === 'KAUF'
        ? 'Kaufpreis'
        : 'Miete';

    // Bilder sortieren nach Reihenfolge (ohne Grundrisse)
    const bilder = immobilie.bilder
        ? [...immobilie.bilder]
            .filter(b => b.gruppe !== 'GRUNDRISS')
            .sort((a, b) => a.reihenfolge - b.reihenfolge)
        : [];

    // Grundrisse separat
    const grundrisse = immobilie.bilder
        ? immobilie.bilder.filter(b => b.gruppe === 'GRUNDRISS')
        : [];

    // Navigationsfunktionen für Bildergalerie
    const nextImage = () => {
        if (bilder.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % bilder.length);
        }
    };

    const prevImage = () => {
        if (bilder.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + bilder.length) % bilder.length);
        }
    };

    // Strukturierte Daten für SEO (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": immobilie.objekttitel || 'Immobilie',
        "description": immobilie.objektbeschreibung?.replace(/<[^>]*>/g, '').substring(0, 200) || '',
        "url": `https://sira-group.at/immobilien/${immobilie.id}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": immobilie.ort || '',
            "postalCode": immobilie.plz || '',
            "addressCountry": "AT"
        },
        "floorSize": {
            "@type": "QuantitativeValue",
            "value": immobilie.wohnflaeche,
            "unitCode": "MTK"
        },
        "numberOfRooms": immobilie.anzahl_zimmer ? Math.floor(immobilie.anzahl_zimmer) : undefined,
        "image": immobilie.titelbild_url || '',
        "offers": {
            "@type": "Offer",
            "price": preis && preis > 0 ? preis : undefined,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        }
    };

    const metaDescription = `${immobilie.objektart_typ || 'Immobilie'} in ${immobilie.plz} ${immobilie.ort}${immobilie.wohnflaeche ? ` - ${immobilie.wohnflaeche} m²` : ''}${immobilie.anzahl_zimmer ? `, ${Math.floor(immobilie.anzahl_zimmer)} Zimmer` : ''}${preis && preis > 0 ? ` ab € ${preis.toLocaleString('de-AT')}` : ''}`;

    return (
        <>
            <Helmet>
                <title>{immobilie.objekttitel || 'Immobilie'} | SIRA Group</title>
                <meta name="description" content={metaDescription} />

                {/* Open Graph Tags für Social Media */}
                <meta property="og:title" content={`${immobilie.objekttitel || 'Immobilie'} | SIRA Group`} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://sira-group.at/immobilien/${immobilie.id}`} />
                {immobilie.titelbild_url && <meta property="og:image" content={immobilie.titelbild_url} />}

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${immobilie.objekttitel || 'Immobilie'} | SIRA Group`} />
                <meta name="twitter:description" content={metaDescription} />
                {immobilie.titelbild_url && <meta name="twitter:image" content={immobilie.titelbild_url} />}

                {/* JSON-LD Strukturierte Daten */}
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <NavBar isLandingpage={false} />

            {/* Titel */}
            <h1 className="immo-titel-detail">{immobilie.objekttitel}</h1>

            {/* Bildergalerie mit Pfeilen */}
            {bilder.length > 0 && (
                <div style={{ position: 'relative', maxWidth: '90%', margin: '0 auto 2rem', background: '#f5f5f5', borderRadius: '8px' }}>
                    <img
                        src={bilder[currentImageIndex].url}
                        alt={bilder[currentImageIndex].titel || `Bild ${currentImageIndex + 1}`}
                        className="erstes-bild-detail"
                        style={{ width: '100%', height: '500px', objectFit: 'contain', borderRadius: '8px' }}
                    />

                    {bilder.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                style={{
                                    position: 'absolute',
                                    left: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '2rem',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextImage}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '2rem',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                ›
                            </button>
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                            }}>
                                {currentImageIndex + 1} / {bilder.length}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Alle Details in einer einzigen Box */}
            <div style={{
                maxWidth: '90%',
                margin: '2rem auto',
                padding: '2.5rem',
                background: '#ffffff',
                border: '2px solid var(--basic-blue)',
                borderRadius: '8px',
                fontFamily: 'Amiko',
            }}>
                {/* Objektbeschreibung */}
                {immobilie.objektbeschreibung && (() => {
                    const cutoffText = "Der Vermittler ist als Doppelmakler tätig.";
                    const cutoffIndex = immobilie.objektbeschreibung.indexOf(cutoffText);
                    const beschreibung = cutoffIndex !== -1
                        ? immobilie.objektbeschreibung.substring(0, cutoffIndex + cutoffText.length)
                        : immobilie.objektbeschreibung;
                    return (
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div dangerouslySetInnerHTML={{ __html: beschreibung }} />
                        </div>
                    );
                })()}

                {/* Ausstattung */}
                {immobilie.ausstattung && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3>Ausstattung</h3>
                        <div dangerouslySetInnerHTML={{ __html: immobilie.ausstattung }} />
                    </div>
                )}

                {/* Eckdaten */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem', fontFamily: 'Amiko' }}>Eckdaten</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                            <strong>{preisLabel}:</strong> {preis && preis > 0
                                ? `€ ${preis.toLocaleString('de-AT', { minimumFractionDigits: 2 })}`
                                : 'Preis auf Anfrage'}
                        </li>
                        {immobilie.nebenkosten && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Nebenkosten:</strong> € {immobilie.nebenkosten.toLocaleString('de-AT', { minimumFractionDigits: 2 })}
                            </li>
                        )}
                        {immobilie.wohnflaeche && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Wohnfläche:</strong> {immobilie.wohnflaeche} m²
                            </li>
                        )}
                        {immobilie.anzahl_zimmer && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Zimmer:</strong> {Math.floor(immobilie.anzahl_zimmer)}
                            </li>
                        )}
                        {immobilie.anzahl_badezimmer && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Badezimmer:</strong> {immobilie.anzahl_badezimmer}
                            </li>
                        )}
                        {immobilie.grundstuecksflaeche && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Grundstücksfläche:</strong> {immobilie.grundstuecksflaeche} m²
                            </li>
                        )}
                        {immobilie.baujahr && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Baujahr:</strong> {immobilie.baujahr}
                            </li>
                        )}
                        {immobilie.etage !== null && (
                            <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                <strong>Etage:</strong> {immobilie.etage}
                            </li>
                        )}
                        {immobilie.stellplaetze && (
                            <li style={{ padding: '0.5rem 0' }}>
                                <strong>Stellplätze:</strong> {immobilie.stellplaetze}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Energieausweis */}
                {(immobilie.epass_wert || immobilie.epass_hwbklasse) && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontFamily: 'Amiko' }}>Energieausweis</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {immobilie.epass_hwbklasse && (
                                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #dee2e6' }}>
                                    <strong>Klasse:</strong> {immobilie.epass_hwbklasse}
                                </li>
                            )}
                            {immobilie.epass_wert && (
                                <li style={{ padding: '0.5rem 0' }}>
                                    <strong>HWB-Wert:</strong> {immobilie.epass_wert} kWh/(m²a)
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Ihr Ansprechpartner */}
                {immobilie.kontakt_name && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontFamily: 'Amiko' }}>Ihr Ansprechpartner</h3>
                        {immobilie.kontakt_foto_url && (
                            <img
                                src={immobilie.kontakt_foto_url}
                                alt={immobilie.kontakt_name}
                                style={{
                                    width: '200px',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                }}
                            />
                        )}
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ padding: '0.3rem 0' }}>
                                <strong>{immobilie.kontakt_name}</strong>
                            </li>
                            {immobilie.kontakt_telefon && (
                                <li style={{ padding: '0.3rem 0' }}>Tel: {immobilie.kontakt_telefon}</li>
                            )}
                            {immobilie.kontakt_email && (
                                <li style={{ padding: '0.3rem 0' }}>
                                    <a href={`mailto:${immobilie.kontakt_email}`} style={{ color: 'var(--basic-blue)' }}>
                                        {immobilie.kontakt_email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Grundrisse */}
                {grundrisse.length > 0 && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontFamily: 'Amiko' }}>Grundrisse</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {grundrisse.map((grundriss) => (
                                <img
                                    key={grundriss.id}
                                    src={grundriss.url}
                                    alt={grundriss.titel || 'Grundriss'}
                                    onClick={() => setLightboxImage(grundriss.url)}
                                    style={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'opacity 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Infrastruktur / Entfernungen */}
                <div style={{ marginBottom: 0 }}>
                    <h3 style={{ marginTop: 0, marginBottom: '1rem', fontFamily: 'Amiko' }}>Infrastruktur / Entfernungen</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '1rem',
                    }}>
                        <div>
                            <h4 style={{ marginTop: 0, fontFamily: 'Amiko' }}>Gesundheit</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Arzt &lt;3.500m</li>
                                <li>Apotheke &lt;2.000m</li>
                                <li>Klinik &lt;4.000m</li>
                                <li>Krankenhaus &lt;5.000m</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ marginTop: 0, fontFamily: 'Amiko' }}>Kinder & Schulen</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Schule &lt;1.500m</li>
                                <li>Kindergarten &lt;500m</li>
                                <li>Universität &lt;5.500m</li>
                                <li>Höhere Schule &lt;7.000m</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ marginTop: 0, fontFamily: 'Amiko' }}>Nahversorgung</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Supermarkt &lt;500m</li>
                                <li>Bäckerei &lt;3.000m</li>
                                <li>Einkaufszentrum &lt;2.500m</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ marginTop: 0, fontFamily: 'Amiko' }}>Sonstige</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Geldautomat &lt;1.000m</li>
                                <li>Bank &lt;1.000m</li>
                                <li>Post &lt;2.000m</li>
                                <li>Polizei &lt;2.500m</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ marginTop: 0, fontFamily: 'Amiko' }}>Verkehr</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>Bus &lt;500m</li>
                                <li>U-Bahn &lt;4.000m</li>
                                <li>Straßenbahn &lt;4.500m</li>
                                <li>Bahnhof &lt;1.000m</li>
                                <li>Autobahnanschluss &lt;1.500m</li>
                            </ul>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: 0 }}>
                        Angaben Entfernung Luftlinie / Quelle: OpenStreetMap
                    </p>
                </div>
            </div>

            {/* Lightbox für Grundrisse */}
            {lightboxImage && (
                <div
                    onClick={() => setLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        cursor: 'pointer',
                    }}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            fontSize: '2rem',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            color: '#000',
                            fontWeight: 'bold',
                        }}
                    >
                        ×
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Grundriss vergrößert"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                        }}
                    />
                </div>
            )}

            <Kontaktformular isKontaktSeite={false} />
            <Footer />
        </>
    );
};

export default ImmobilienDetails;
