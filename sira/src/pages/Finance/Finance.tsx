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
            <title>Finance | SIRA Group</title>
            <meta
                name="description"
                content="Unsere Finanzleistungen"
            />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="real-estate">
            <div className="bild-hinter-slogan">
                <img src={vienna_breit} style={{ width: "100%", height: "25vh", objectFit: "cover" }} />
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
                <img src={finance_1} style={{ width: "50vw", height: "46vh", objectFit: "cover" }} />
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