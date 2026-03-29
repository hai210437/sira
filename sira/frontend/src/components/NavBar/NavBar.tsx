import "./NavBar.css";
import logo from "../../assets/logo_rechteckig-removebg-preview.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import logoanimation from "../../assets/logo_rechteckig-removebg-preview.png";
import React, { useCallback, useEffect, useState, useRef } from "react";

interface NavBarProps {
    isLandingpage: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isLandingpage }) => {

    const [opacity, setOpacity] = useState(1);
    const [menuOpen, setMenuOpen] = useState(false);
    const burgerRef = useRef<HTMLButtonElement>(null);

    // Throttled scroll handler for navbar opacity
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const newOpacity = 1 - Math.min(scrollY / 400, 1) * 0.2;
                setOpacity(newOpacity);
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close menu on overlay background click (not on menu items or burger)
    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setMenuOpen(false);
        }
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);


    const navigate = useNavigate();
    const { t } = useTranslation();
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

    const handleNavClick = (path: string) => {
        setMenuOpen(false);
        navigate(path);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className={`navbar ${menuOpen ? "menu-is-open" : ""}`} style={{
                backgroundColor: `rgba(0, 3, 36, ${opacity})`,
                backdropFilter: `blur(${opacity * 10}px)`,
                transition: "background-color 0.3s ease-out",
            }}>
                <img src={logo} alt="SIRA Group Logo" className="logo-links-oben" onClick={() => navigate("/")} />

                {/* Desktop menu */}
                <div className="menu-items desktop-menu">
                    {navbaritems.map((item, index) => {
                        const isActive = location.pathname === item.path;
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

                {/* Mobile: Language + Burger */}
                <div className="mobile-controls">
                    <span className="mobile-lang" onClick={switchLanguage}>DE/EN</span>
                    <button
                        ref={burgerRef}
                        className={`burger-button ${menuOpen ? "open" : ""}`}
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Menu"
                    >
                        <span className="burger-line"></span>
                        <span className="burger-line"></span>
                        <span className="burger-line"></span>
                    </button>
                </div>
            </div>

            {/* Mobile overlay menu */}
            <div
                className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
                onClick={handleOverlayClick}
            >
                <div className="mobile-menu-content">
                    {navbaritems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.name}
                                className={`mobile-menu-item ${isActive ? "active" : ""}`}
                                onClick={() => handleNavClick(item.path)}
                            >
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="overlay-rectangle">
                <img src={logoanimation} alt="SIRA Group Logo Animation" className="logoanimation"></img>
            </div>
        </>
    );
};

export default NavBar;
