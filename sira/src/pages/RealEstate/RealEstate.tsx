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


type Bewertung = {
    text: string,
    name: string
}

const RealEstate: React.FC = () => {


    const { t } = useTranslation();
    let bewertungen: Bewertung[] = Object.values(t("bewertungen", { returnObjects: true }));
    bewertungen = shuffle(bewertungen);
    //const [immobilien, setImmobilien] = useState<any[]>([]);

    const [index, setIndex] = useState(0);
    const blockRef = useRef<HTMLDivElement | null>(null);
    //const [paused, setPaused] = useState(false);

    const estateleistungen = [
        t("verkauf"),
        t("vermietung"),
        t("bewertung")
    ]


    /*
    useEffect(() => {
        fetch("/api/justimmo")
            .then(res => res.json())
            .then(data => setImmobilien(data))
            .catch(err => console.error(err));
    }, []);
    */



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
                    <img src={vienna_breit} style={{ width: "100%", height: "25vh", objectFit: "cover" }} />
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
                        {estateleistungen.map((leistung) => (
                            <div className="estateleistung">
                                <h2>
                                    {leistung}
                                </h2>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            {/*
            <h2 className="immobilien-ue">{t("immobilien-ue")}</h2>
            <div className="immobilien">
                {immobilien.map((immobilie, index) => (
                    <div className="immobilienblock" key={index}>
                        <div className="immobilien-bild-wrapper">
                            <img
                                src={immobilie.erstes_bild}
                                alt={`Team member ${index + 1}`}
                                className="immobilien-bild eins"
                            />
                            <img
                                src={immobilie.zweites_bild}
                                alt={`Team member ${index + 1} closeup`}
                                className="immobilien-bild zwei"
                            />
                            <div className="immo-overlay">
                                <h3>{immobilie.plz}</h3>
                                <h4>{immobilie.ort}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            */}
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