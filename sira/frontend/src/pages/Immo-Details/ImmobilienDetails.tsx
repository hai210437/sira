import "./ImmobilienDetails.css";
import NavBar from "../../components/NavBar/NavBar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import { useParams } from "react-router-dom";

const ImmobilienDetails: React.FC = () => {
    const { i18n } = useTranslation();
    const [immobilien, setImmobilien] = useState<any[] | null>(null);
    const [aktuelleImmobilie, setAktuelleImmobilie] = useState<any>(null);
    const { id: immoid } = useParams();

    async function getImmobilien() {
        try {
            const lang = i18n.language || "de";
            const response = await fetch(`https://api.sira-group.at/justimmo?lang=${lang}`);
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

    // Erst NACHDEM die Immobilien geladen wurden, die richtige finden
    useEffect(() => {
        if (immobilien) {
            const gefundene = immobilien.find(immo => String(immo.id) === String(immoid));
            setAktuelleImmobilie(gefundene || null);
        }
    }, [immobilien, immoid]);

    if (immobilien === null || aktuelleImmobilie === null) {
        return (
            <>
                <NavBar isLandingpage={false} />
                <div className="loading" style={{ padding: "4rem", textAlign: "center" }}>
                    Lade Immobilie …
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Immobilien | SIRA Group</title>
                <meta name="description" content="Unser aktuelles Angebot an Immobilien" />
            </Helmet>
            <NavBar isLandingpage={false} />
            <h1 className="immo-titel-detail">{aktuelleImmobilie.titel}</h1>
            <div className={`immo-bild-detail-oben`}>
                <img src={aktuelleImmobilie.erstes_bild} className="erstes-bild-detail" />
                {aktuelleImmobilie.zweites_bild && aktuelleImmobilie.zweites_bild.trim() !== "" && (
                    <img src={aktuelleImmobilie.zweites_bild} className="zweites-bild-detail" />
                )}
            </div>
            <div className="immo-details-unten">
                <div className="info-box-links" dangerouslySetInnerHTML={{ __html: aktuelleImmobilie.objektbeschreibung }}>

                </div>
                <div className="info-box-rechts"></div>
            </div>

            <Kontaktformular isKontaktSeite={false} />
            <Footer />
        </>
    );
};

export default ImmobilienDetails;
