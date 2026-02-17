import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import vienna_breit from "../../assets/wien2.jpg";
import "./Finance.css";
import { useTranslation } from "react-i18next";
import finance_1 from "../../assets/finance_1.jpg";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import Helmet from "react-helmet";

const Finance: React.FC = () => {


    const { t } = useTranslation();

    const finanzleistungen = [
        t("finanzleistung1"),
        t("finanzleistung2"),
        t("finanzleistung3")
    ]

    return <>
        <Helmet>
            <title>Immobilienfinanzierung Wien – SIRA Finance</title>
            <meta name="description" content="SIRA Finance: Professionelle Immobilienfinanzierung und Beratung in Wien. Kreditvermittlung, Baufinanzierung und individuelle Finanzlösungen für Ihr Immobilienprojekt." />
            <link rel="canonical" href="https://sira-group.at/finance" />
            <meta property="og:title" content="Immobilienfinanzierung Wien – SIRA Finance" />
            <meta property="og:description" content="Professionelle Immobilienfinanzierung und Beratung in Wien. Kreditvermittlung und individuelle Finanzlösungen." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://sira-group.at/finance" />
            <meta property="og:image" content="https://sira-group.at/assets/social-preview.jpg" />
            <meta property="og:site_name" content="SIRA Group" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Immobilienfinanzierung Wien – SIRA Finance" />
            <meta name="twitter:description" content="Professionelle Immobilienfinanzierung und Beratung in Wien." />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="real-estate">
            <div className="bild-hinter-slogan">
                <img src={vienna_breit} alt="Wien Panorama – SIRA Finance Immobilienfinanzierung" style={{ width: "100%", height: "25vh", objectFit: "cover" }} />
                <h1 className="header"> {t("SIRA FINANCE")}
                </h1>
            </div>
            <div className="text-plus-bild-finance">
                <div>
                    <h2>
                        {t("financeheader")}
                    </h2>
                    <br />
                    <p>
                        {t("financetext")}
                    </p>
                </div>
                <img src={finance_1} alt="Immobilienfinanzierung und Beratung – SIRA Finance" style={{ width: "50vw", height: "46vh", objectFit: "cover" }} />
            </div>
            <div className="finanzleistungen">
                {finanzleistungen.map((leistung) => (
                    <div className="finanzleistung">
                        <h2 style={{ width: "50vw" }}>{leistung}</h2>
                    </div>
                ))}
            </div>
            <h2 className="kontaktheader">{t("kontakt")}</h2>
            <Kontaktformular isKontaktSeite={false}></Kontaktformular>
        </div>
        <Footer></Footer>
    </>
}
export default Finance