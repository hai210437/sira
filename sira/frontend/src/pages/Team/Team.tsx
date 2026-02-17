import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./Team.css";
import simon_normal from "../../assets/simon_normal.jpg";
import simon_closeup from "../../assets/simon_closeup.jpg";
import silvio_normal from "../../assets/silvio_normal.jpg";
import silvio_closeup from "../../assets/silvio_closeup.jpg";
import thomas_normal from "../../assets/thomas_normal.jpg";
import thomas_closeup from "../../assets/thomas_closeup.jpg";
import david_normal from "../../assets/david_normal.jpeg";
import david_closeup from "../../assets/david_closeup.jpeg";
import julian_normal from "../../assets/julian_normal.jpeg";
import julian_closeup from "../../assets/julian_closeup.jpeg";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import Helmet from "react-helmet";

const Team: React.FC = () => {
    const { t } = useTranslation();

    const teamPictures = [
        { normal: simon_normal, closeup: simon_closeup, name: "Simon Jaros", position: "Geschäftsführer | CEO", email: "jaros.s@sira-group.at", tel: "+43 660 2332003" },
        { normal: silvio_normal, closeup: silvio_closeup, name: "Silvio Widowitz", position: "Geschäftsführung | COO", email: "widowitz@sira-group.at", tel: "+43 660 4479989" },
        { normal: thomas_normal, closeup: thomas_closeup, name:"Thomas Lechner", position:"Immobilienberater", email:"lechner@sira-group.at", tel:"+43 664 88736321"},
        { normal: david_normal, closeup: david_closeup, name:"David Jaros", position:"Immobilienberater", email:"jaros.d@sira-group.at", tel:"+43 660 2332001"},
        { normal: julian_normal, closeup: julian_closeup, name:"Julian Glas", position:"Immobilienberater", email:"glas@sira-group.at", tel:"+43 699 13559820"},

    ];

    return <>
        <Helmet>
            <title>Unser Team – Immobilienexperten Wien | SIRA Group</title>
            <meta name="description" content="Lernen Sie das SIRA Group Team kennen: Erfahrene Immobilienexperten in Wien. Geschäftsführer Simon Jaros, Silvio Widowitz und unser Beraterteam stehen Ihnen zur Seite." />
            <link rel="canonical" href="https://sira-group.at/team" />
            <meta property="og:title" content="Unser Team – Immobilienexperten Wien | SIRA Group" />
            <meta property="og:description" content="Lernen Sie das SIRA Group Team kennen: Erfahrene Immobilienexperten in Wien." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://sira-group.at/team" />
            <meta property="og:image" content="https://sira-group.at/assets/social-preview.jpg" />
            <meta property="og:site_name" content="SIRA Group" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Unser Team – Immobilienexperten Wien | SIRA Group" />
            <meta name="twitter:description" content="Erfahrene Immobilienexperten in Wien stehen Ihnen zur Seite." />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="team">
            <div className="teamtext">
                <h1 style={{ fontSize: '1.8rem' }}>
                    {t("teamheader")}
                </h1>
                <br />
                <p>
                    {t("teamtext1")}
                </p>
                <br />
                <p>
                    {t("teamtext2")}
                </p>
            </div>
        </div>
        <div className="team-headshots">
            {teamPictures.map((member, index) => (
                <div className="memberblock" key={index}>
                    <div className="member-image-wrapper">
                        <img
                            src={member.normal}
                            alt={`${member.name} – ${member.position} bei SIRA Group`}
                            className="member-image normal"
                        />
                        <img
                            src={member.closeup}
                            alt={`${member.name} – Porträt`}
                            className="member-image closeup"
                        />
                        <div className="info-overlay">
                            <h3>{member.name}</h3>
                            <h4>{member.position}</h4>
                            <a href={`mailto:${member.email}`} style={{ color: 'white', textDecoration: 'none' }}>
                                {member.email}
                            </a>
                            <p>{member.tel}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <h2 className="kontaktheader">{t("kontakt")}</h2>
        <Kontaktformular isKontaktSeite={false}></Kontaktformular>
        <Footer></Footer>
    </>
}
export default Team