import { useTranslation } from "react-i18next";
import "./Impressum.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Helmet from "react-helmet";


const Impressum: React.FC = () => {
    const { i18n, t } = useTranslation();

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
            <title>Impressum | SIRA Group</title>
            <meta
                name="description"
                content="Das Impressum"
            />
        </Helmet>
        <div className="impressum-container">

            {(t("impressumcontent.sections", { returnObjects: true }) as {
                heading: string;
                paragraphs: string[];
            }[]).map((section, index) => (
                <section key={index} className="impressum-section">
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((absatz, idx) => (
                        <p key={idx}>{absatz}</p>
                    ))}
                </section>
            ))}
        </div>
    </>
}

export default Impressum;
