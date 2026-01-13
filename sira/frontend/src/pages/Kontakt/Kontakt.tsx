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
            <title>Kontakt | SIRA Group</title>
            <meta
                name="description"
                content="Kontaktieren Sie uns!"
            />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="kontakt">
            <h2 className="kontaktheader">{t("kontaktheader")}</h2>
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
                        office@sira.at
                    </p>
                </div>
            </div>
        </div>

        <Footer></Footer>
    </>
}
export default Kontakt