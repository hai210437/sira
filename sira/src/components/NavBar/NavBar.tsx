import "./NavBar.css";
import logo from "../../assets/logo_rechteckig-removebg-preview.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoanimation from "../../assets/logo_rechteckig-removebg-preview.png";
import React, { useEffect, useState } from "react";

interface NavBarProps {
    isLandingpage: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isLandingpage }) => {

    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll = 400;
            const newOpacity = 1 - Math.min(scrollY / maxScroll, 1) * 0.2; // max. 0.9 Deckkraft
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const navigate = useNavigate();
    const { t } = useTranslation();
    //const t = (key: string) => key;
    const navbaritems = [
        { name: "REAL ESTATE", path: "/real-estate" },
        { name: "FINANCE", path: "/finance" },
        { name: "SERVICES", path: "/services" },
        { name: "TEAM", path: "/team" },
        { name: t("kontakt").toUpperCase(), path: "/kontakt" },
    ]

    if (isLandingpage) {
        useGSAP(() => {
            gsap.fromTo('.overlay-rectangle', {
                opacity: 5,
                backgroundColor: "#000324",
            }, {
                opacity: 0,
                duration: 1.5,
                delay: 0.5
                //ease: 'elastic'
            })

            gsap.fromTo('.logoanimation', {
                scale: 5,
                ease: 'power1.Out',
                opacity: 1

            }, {
                y: '-40vh',
                scale: 5,
                duration: 0.65,
                delay: 1,
                opacity: 0
            })
        })
    }

    function switchLanguage(): void {
        const newLang = i18n.language === "de" ? "en" : "de";
        i18n.changeLanguage(newLang);
    };


    return (
        <>
            <div className="navbar" style={{
                backgroundColor: `rgba(0, 3, 36, ${opacity})`,
                backdropFilter: `blur(${opacity * 10}px)`, // optional: weicher Übergang
                transition: "background-color 0.3s ease-out",
            }}>
                <img src={logo} className="logo-links-oben" onClick={() => navigate("/")}>
                </img>
                <div className="menu-items">
                    {navbaritems.map((item, index) => {
                        const isActive = location.pathname === item.path; // prüfen, ob aktiv
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`menu-link ${isActive ? "active" : ""}`}
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
                    <span id="de-en" onClick={switchLanguage}>DE/EN</span>
                </div>
            </div>
            <div className="overlay-rectangle">
                <img src={logoanimation} className="logoanimation"></img>
            </div>
        </>
    );
};

export default NavBar;