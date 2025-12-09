import "./Immobilien.css";
import NavBar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import { Link, redirect } from "react-router-dom";


const Immobilien: React.FC = () => {
    const { i18n } = useTranslation();
    const [immobilien, setImmobilien] = useState<any[] | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    async function getImmobilien() {
        try {
            const lang = i18n.language || 'de';
            const response = await fetch(`http://api:8080/justimmo?lang=${lang}`);
            if (!response.ok) throw new Error(`Response status: ${response.status}`);
            const data = await response.json();
            setImmobilien(data);
        } catch (err) {
            console.error("Failed to load immobilien:", err);
            setImmobilien([]);
        }
    }

    useEffect(() => {
        getImmobilien();
    }, []);

    if (immobilien === null) {
        return <>
            <NavBar isLandingpage={false} />
            <div className="loading" style={{ padding: "4rem", textAlign: "center" }}>Lade Immobilien…</div>
        </>
    }

    // Pagination calculations
    const totalPages = Math.ceil(immobilien.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleItems = immobilien.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (p: number) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    function goToImmoDetails(id: any) {
        redirect("/immobilien/" + id)
    }

    console.log(immobilien);

    return <>
        <Helmet>
            <title>Immobilien | SIRA Group</title>
            <meta name="description" content="Unser aktuelles Angebot an Immobilien" />
        </Helmet>

        <NavBar isLandingpage={false} />

        {/* Pagination oben */}
        {totalPages > 1 && (
            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>«</button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
            </div>
        )}

        {/* Immobilienliste */}
        <div className="immobilien-list">
            {visibleItems.map((immo, idx) => (
                <Link to={"/immobilien/" + immo.id} style={{ "textDecoration": "none" }}>
                    <div className="immobilienblock" key={idx} onClick={() => goToImmoDetails(idx)}>
                        <div className={`immo-bild-links ${immo.zweites_bild ? "has-two" : "one"}`}>
                            <img src={immo.erstes_bild} className="erstes-bild" />
                            {immo.zweites_bild && immo.zweites_bild.trim() !== "" && (
                                <img src={immo.zweites_bild} className="zweites-bild" />
                            )}
                        </div>

                        <div className="beschreibung rechts">
                            <h2 className="immo-titel">{immo.titel}</h2>
                            <h3>{immo.plz} {immo.ort}</h3>

                            <table className="immo-details-table">
                                <thead>
                                    <tr>
                                        {immo.anzahl_zimmer != null && (
                                            <th>Zimmer</th>
                                        )}
                                        {immo.nutzflaeche != null && immo.wohnflaeche == null && (
                                            <th>Nutzfläche</th>
                                        )}
                                        {immo.wohnflaeche != null && (
                                            <th>Wohnfläche</th>
                                        )}
                                        <th>Kaufpreis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {immo.anzahl_zimmer != null && (
                                            <td>{immo.anzahl_zimmer}</td>
                                        )}
                                        {immo.nutzflaeche != null && immo.wohnflaeche == null && (
                                            <td>{immo.nutzflaeche}m²</td>
                                        )}
                                        {immo.wohnflaeche != null && (
                                            <td>{immo.wohnflaeche}m²</td>
                                        )}
                                        {immo.preis > 100000 ? (
                                        <td>
                                            {new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(immo.preis)}
                                        </td>
                                        ) : (
                                            <td>Preis auf Anfrage</td>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Link>
            ))}

        </div>


        {/* Pagination unten */}
        {totalPages > 1 && (
            <div className="pagination bottom">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>«</button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}

                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
            </div>
        )}

        <Kontaktformular isKontaktSeite={false} />
        <Footer />
    </>
}

export default Immobilien;
