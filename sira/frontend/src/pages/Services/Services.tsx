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
            <title>Immobilien-Services & Partner Wien – SIRA Group</title>
            <meta name="description" content="SIRA Services: Umfassende Immobilien-Dienstleistungen und starke Partnerschaften in Wien. Professionelle Betreuung Ihrer Immobilie durch erfahrene Experten." />
            <link rel="canonical" href="https://sira-group.at/services" />
            <meta property="og:title" content="Immobilien-Services & Partner Wien – SIRA Group" />
            <meta property="og:description" content="Umfassende Immobilien-Dienstleistungen und starke Partnerschaften in Wien." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://sira-group.at/services" />
            <meta property="og:image" content="https://sira-group.at/assets/social-preview.jpg" />
            <meta property="og:site_name" content="SIRA Group" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Immobilien-Services & Partner Wien – SIRA Group" />
            <meta name="twitter:description" content="Umfassende Immobilien-Dienstleistungen und starke Partnerschaften in Wien." />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="services">
            <div className="bild-hinter-slogan">
                <img src={vienna_breit} alt="Wien Panorama – SIRA Immobilien-Services" style={{ width: "100%", height: "25vh", objectFit: "cover" }} />
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
                    <img src={partner} alt="SIRA Group Partner" />
                ))}
            </div>
            <h2 className="kontaktheader">{t("kontakt")}</h2>
            <Kontaktformular isKontaktSeite={false}></Kontaktformular>
        </div>
        <Footer></Footer>
    </>
}
export default Services