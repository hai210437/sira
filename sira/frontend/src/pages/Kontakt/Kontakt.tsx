import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./Kontakt.css";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import StandortKarte from "../../components/map/Map";
import Helmet from "react-helmet";

const Kontakt: React.FC = () => {
    const { t } = useTranslation();
    return <>
        <Helmet>
            <title>Kontakt – Immobilienberatung Wien | SIRA Group</title>
            <meta name="description" content="Kontaktieren Sie die SIRA Group in Wien: Kärntnerstraße 21-23, 1010 Wien. Telefon: +43 660 2332 003. Persönliche Beratung zu Immobilien, Finanzierung und Services." />
            <link rel="canonical" href="https://sira-group.at/kontakt" />
            <meta property="og:title" content="Kontakt – Immobilienberatung Wien | SIRA Group" />
            <meta property="og:description" content="Kontaktieren Sie die SIRA Group: Persönliche Beratung zu Immobilien in Wien." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://sira-group.at/kontakt" />
            <meta property="og:image" content="https://sira-group.at/assets/social-preview.jpg" />
            <meta property="og:site_name" content="SIRA Group" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Kontakt – Immobilienberatung Wien | SIRA Group" />
            <meta name="twitter:description" content="Kontaktieren Sie die SIRA Group: Persönliche Beratung zu Immobilien in Wien." />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="kontakt">
            <h1 className="kontaktheader">{t("kontaktheader")}</h1>
            <p className="kontakttext">
                {t("kontakttext")}
            </p>
            <h2 className="kontaktheader">{t("kontaktformular")}</h2>
            <div className="kontaktform">
                <Kontaktformular isKontaktSeite={true}></Kontaktformular>
            </div>
            <div className="mapmittext">
                <div>
                    <StandortKarte></StandortKarte>
                </div>
                <div className="textnebenkarte">
                    <h2>{t("unserstandort")}</h2>
                    <p>
                        Kärntnerstraße 21-23/2/10<br />
                        1010 Wien
                    </p>
                    <h2>{t("erreichbar")}</h2>
                    <p>
                        +43 660 2332 003 <br />
                        office@sira-group.at
                    </p>
                </div>
            </div>
        </div>

        <Footer></Footer>
    </>
}
export default Kontakt