import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./Services.css";
import vienna_breit from "../../assets/wien2.jpg";
import { useTranslation } from "react-i18next";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import standfest_partner from "../../assets/standfest_partner.png";
import er_partner from "../../assets/er_partner.png";
import immogrand_partner from "../../assets/immogrand_partner.png";
import Helmet from "react-helmet";


const Services: React.FC = () => {
    const { t } = useTranslation();
    const services = [
        t("service1"),
        t("service2"),
        t("service3"),
        t("service4"),
        t("service5")
    ]
    const partner = [
        standfest_partner,
        er_partner,
        immogrand_partner,

    ]

    return <>
        <Helmet>
            <title>Services | SIRA Group</title>
            <meta
                name="description"
                content="Unsere Services und Partner"
            />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="services">
            <div className="bild-hinter-slogan">
                <img src={vienna_breit} style={{ width: "100%", height: "25vh", objectFit: "cover" }} rel="preload"/>
                <h1 className="header"> {t("SERVICES")}
                </h1>
            </div>
            <div className="text-plus-bild-services">
                <div className="textlinksservice">
                    <div>
                        <h2>
                            {t("serviceheader1")}
                        </h2>
                        <br />
                        <p>
                            {t("servicetext1")}
                        </p>
                        <br />
                        <p>
                            {t("servicetext2")}
                        </p>
                    </div>
                </div>
                <div className="serviceblock">
                    {services.map((service) => (
                        <div className="service">
                            <h2>{service}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="partnerheader">
                {t("partnerheader")}
            </h2>
            <div className="partners">
                {partner.map((partner) => (
                    <img src={partner} rel="preload"></img>
                ))}
            </div>
            <h2 className="kontaktheader">{t("kontakt")}</h2>
            <Kontaktformular isKontaktSeite={false}></Kontaktformular>
        </div>
        <Footer></Footer>
    </>
}
export default Services