import { useTranslation } from "react-i18next";
import "./Datenschutz.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Helmet from "react-helmet";


const Datenschutz: React.FC = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const lang = params.get("lang");
        if (lang && lang !== i18n.language) {
            i18n.changeLanguage(lang);
        }
    }, [location, i18n]);

    return <>
        <Helmet>
            <title>Datenschutz | SIRA Group</title>
            <meta
                name="description"
                content="Datenschutzinformationen"
            />
        </Helmet>
        <div className="datenschutz-container">

            {(t("datenschutzcontent.sections", { returnObjects: true }) as {
                heading: string;
                paragraphs: string[];
            }[]).map((section, index) => (
                <section key={index} className="datenschutz-section">
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((absatz, idx) => (
                        <p key={idx}>{absatz}</p>
                    ))}
                </section>
            ))}
        </div>
    </>
}

export default Datenschutz;
