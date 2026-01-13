import { Link } from "react-router-dom";
import logo from "../../assets/logo_rechteckig-removebg-preview.png";
import "./Footer.css"
import { useTranslation } from "react-i18next";


const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const navbaritems = [
        { name: "REAL ESTATE", path: "/real-estate" },
        { name: "FINANCE", path: "/finance" },
        { name: "SERVICES", path: "/services" },
        { name: "TEAM", path: "/team" },
        { name: t("kontakt").toUpperCase(), path: "/kontakt" }
    ]

    return <>
        <div className="footer-blue">
            <img src={logo} className="logo-links-unten"></img>
            <div className="menu-items-footer">
                {navbaritems.map((item, index) => {
                  // prüfen, ob aktiv
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`menu-link`}
                        >
                            <span>
                                {item.name}
                                {index < navbaritems.length - 1 && (
                                    <span className="menu-separator">|</span>
                                )}
                            </span>
                        </Link>
                    );
                })}
            </div>
            <p className="footer-information">
                SIRA Holding GmbH <br />
                Kärntnerstraße 21-23/2/10<br />
                1010 Wien<br />
                <br />
                +43660 2332003<br />
                office@sira-group.at<br />
            </p>
        </div>
        <div className="data-info">
            <Link to={`/datenschutz?lang=${currentLang}`} style={{ textDecoration: "none", color: "var(--basic-blue)" }} target="_blank">
                <span>{t("datenschutz")}</span>
            </Link>
            <Link to={`/impressum?lang=${currentLang}`} style={{ textDecoration: "none", color: "var(--basic-blue)" }} target="_blank">
                <span>{t("impressum")}</span>
            </Link>
            <Link to={`/datenschutz?lang=${currentLang}`} style={{ textDecoration: "none", color: "var(--basic-blue)" }} target="_blank">
                <span>{t("cookies")}</span>
            </Link>
        </div>

    </>
}

export default Footer;