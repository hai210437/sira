import "./RealEstate.css";
import NavBar from "../../components/NavBar/NavBar";
import React, { useEffect, useRef, useState } from "react";
import vienna_breit from "../../assets/wien2.jpg";
import Footer from "../../components/Footer/Footer";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import shuffle from "lodash.shuffle"
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { getImmobilien } from "../../services/api";
import type { Immobilie } from "../../services/api";

type Bewertung = {
    text: string,
    name: string
}

const RealEstate: React.FC = () => {
    const navigate = useNavigate();

    const { t } = useTranslation();
    let bewertungen: Bewertung[] = Object.values(t("bewertungen", { returnObjects: true }));
    bewertungen = shuffle(bewertungen);
    const [immobilien, setImmobilien] = useState<Immobilie[]>([]);

    const [index, setIndex] = useState(0);
    const blockRef = useRef<HTMLDivElement | null>(null);
    //const [paused, setPaused] = useState(false);

    const estateleistungen = [
        t("verkauf"),
        t("vermietung"),
        t("bewertung")
    ];

    async function loadImmobilien() {
        try {
            const response = await getImmobilien({
                limit: 5,
                sort: 'preis_desc' // Die 5 teuersten Immobilien
            });
            setImmobilien(response.data);
        } catch (err) {
            console.error("Failed to load immobilien:", err);
            setImmobilien([]);
        }
    }

    useEffect(() => {
        loadImmobilien();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            if (!blockRef.current) return;

            // Slide out nach links
            gsap.to(blockRef.current, {
                x: "-100%",
                duration: 1.2,
                opacity: 0,
                onComplete: () => {
                    // Index aktualisieren
                    setIndex((prev) => (prev + 1) % bewertungen.length);

                    // sofort rechts positionieren und reinslide
                    gsap.set(blockRef.current, { x: "100%", opacity: 0 });
                    gsap.to(blockRef.current, { x: "0%", duration: 1.2, opacity: 1 });
                },
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [bewertungen.length]);

    return (
        <>
            <Helmet>
                <title>Real Estate | SIRA Group</title>
                <meta
                    name="description"
                    content="Unsere Immobilienangebote und Referenzen"
                />
            </Helmet>
            <NavBar isLandingpage={false}></NavBar>
            <div className="real-estate">
                <div className="bild-hinter-slogan">
                    <img src={vienna_breit} style={{ width: "100%", height: "25vh", objectFit: "cover" }} rel="preload" />
                    <h1 className="header"> {t("SIRA REAL ESTATE")}
                    </h1>
                </div>
                <div className="text-plus-bild-estate">
                    <div className="textlinks">
                        <div>
                            <h2>
                                {t("estateheader1")}
                            </h2>
                            <br />
                            <p>
                                {t("estatetext1")}
                            </p>
                            <br />
                            <p>
                                {t("estatetext2")}
                            </p>
                        </div>
                    </div>
                    <div className="estateleistungen">
                        {estateleistungen.map((leistung, idx) => (
                            <div className="estateleistung" key={idx}>
                                <h2>
                                    {leistung}
                                </h2>
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="bewertungen-ue"> {t("immobilien-ue")}</h2>
                <div className="immobilien-list">
                    {immobilien.map((immo) => {
                        const preis = immo.vermarktungsart === 'KAUF' ? immo.kaufpreis : immo.nettokaltmiete;
                        const preisLabel = immo.vermarktungsart === 'KAUF' ? 'Kaufpreis' : 'Miete';

                        return (
                            <Link to={`/immobilien/${immo.id}`} key={immo.id} style={{ textDecoration: "none" }}>
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
                                        <h3>{immo.plz} {immo.ort}</h3>

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
                    <button className="more-immo-button" onClick={() => navigate("/immobilien")}>
                        {t("mehr-immobilien-button")}
                    </button>
                </div>
            </div>
            <h2 className="bewertungen-ue">{t("bewertungen-ue")}</h2>
            <div className="bewertungen" style={{ overflow: "hidden" }}>
                <div className="bewertung-block"
                    ref={blockRef}
                //onMouseEnter={() => setPaused(true)}
                //onMouseLeave={() => setPaused(false)}
                >
                    <p className="bewertungstext">{bewertungen[index].text}</p>
                    <p className="bewertungsname">{bewertungen[index].name}</p>
                </div>
            </div>
            <h2 className="kontaktheader">{t("kontakt")}</h2>
            <Kontaktformular isKontaktSeite={false}></Kontaktformular>
            <Footer></Footer>
        </>
    )
}
export default RealEstate;