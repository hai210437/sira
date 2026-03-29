import "./LandingPage.css";
import NavBar from "../../components/NavBar/NavBar";
import React from "react";
import vienna_breit from "../../assets/wien2.jpg";
import landing_2 from "../../assets/landing_2.jpg";
import landing_3 from "../../assets/landing_3.jpg";
import Footer from "../../components/Footer/Footer";
import real_estate_logo from "../../assets/sira_real_estate_logo.jpg";
import finance_logo from "../../assets/sira_finance_logo.jpg";
import services_logo from "../../assets/services_logo.png";
import { Helmet } from "react-helmet";
import { useScrollAnimations } from "../../hooks/useScrollAnimations";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import StandortKarte from "../../components/map/Map";

const LandingPage: React.FC = () => {

    const { t } = useTranslation();
    useScrollAnimations();

    return (
        <>
            <Helmet>
                <title>Home | SIRA Group</title>
                <meta
                    name="description"
                    content="SIRA, Ihr Partner für Immobilienlösungen."
                />
            </Helmet>
            <NavBar isLandingpage={true} ></NavBar>
            <div className="bild-hinter-slogan-landing">
                <img src={vienna_breit} alt="SIRA Group - Immobilien in Wien" style={{ width: "100%", height: "25vh", objectFit: "cover" }} rel="preload"/>
                <h1 className="slogan-landing" style={{ width: "50vw" }}> {t("slogan")}
                </h1>
            </div>
            <div className="text-plus-bild-landing">
                <div data-animate="slide-left">
                    <h2>{t("sira")}<br />
                        {t("landingheader1")}
                    </h2>
                    <br />
                    <p>
                        {t("landingtext1")}
                    </p>
                    <br />
                    <p>
                        {t("landingtext1.1")}
                    </p>
                </div>
                <img src={landing_2} alt="SIRA Group Team - Professionelle Immobilienberatung" data-animate="slide-right" rel="preload"/>
            </div>

            <div className="text-plus-bild-landing reverse-on-mobile">
                <img src={landing_3} alt="Moderne Immobilienprojekte Wien" className="landing-img-second" data-animate="slide-left" rel="preload"/>
                <div data-animate="slide-right">
                    <h2>
                        {t("landingheader2")}
                    </h2>
                    <br />
                    <p>
                        {t("landingtext2")}
                    </p>
                </div>
            </div>
            <div className="text-plus-blue-bg" data-animate="fade-in">
                <p>
                    {t("zitat1")}<br /> {t("zitat2")}<br /> {t("unterschrift")}
                </p>
            </div>
            <h2 className="leistungen-ue" data-animate="fade-up">{t("leistungen")}</h2>
            <div className="leistungen-landing" data-animate="stagger">
                <Link to="/real-estate" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="bild-hinter-leistung-landing">
                        <img src={real_estate_logo} alt="Real Estate - Immobilienverkauf und Vermietung" rel="preload"/>
                    </div>
                </Link>
                <Link to="/finance" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="bild-hinter-leistung-landing">
                        <img src={finance_logo} alt="Finance - Immobilienfinanzierung und Beratung" rel="preload"/>
                    </div>
                </Link>
                <Link to="/services" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <div className="bild-hinter-leistung-landing">
                        <img src={services_logo} alt="Services - Hausverwaltung und Immobilien-Services" rel="preload"/>
                    </div>
                </Link>
            </div>
            <div className="text-plus-map-landing">
                <div data-animate="slide-left">
                    <h2>
                        {t("standortheader")}
                    </h2>
                    <br />
                    <p>
                        {t("standorttext")}
                    </p>
                    <p id="adresse">
                        Kärntnerstraße 21-23/3/10 <br />
                        1010 Wien
                    </p>
                </div>
                <div className="landing-map" data-animate="slide-right">
                    <StandortKarte></StandortKarte>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};


export default LandingPage;
