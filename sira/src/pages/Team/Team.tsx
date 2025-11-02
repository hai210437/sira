import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import "./Team.css";
import simon_normal from "../../assets/simon_normal.jpg";
import simon_closeup from "../../assets/simon_closeup.jpg";
import silvio_normal from "../../assets/silvio_normal.jpg";
import silvio_closeup from "../../assets/silvio_closeup.jpg";
import elisa_normal from "../../assets/elisa_normal.jpg";
import elisa_closeup from "../../assets/elisa_closeup.jpg";
import thomas_normal from "../../assets/thomas_normal.jpg";
import thomas_closeup from "../../assets/thomas_closeup.jpg";
import Kontaktformular from "../../components/Kontaktformular/Kontaktformular";
import Helmet from "react-helmet";

const Team: React.FC = () => {
    const { t } = useTranslation();

    const teamPictures = [
        { normal: simon_normal, closeup: simon_closeup, name: "Simon Jaros", position: "Geschäftsführer | CEO", email: "jaros.s@sira-group.at", tel: "+43 660 2332003" },
        { normal: silvio_normal, closeup: silvio_closeup, name: "Silvio Widowitz", position: "Geschäftsführung | COO", email: "widowitz@sira-group.at", tel: "+43 660 4479989" },
        { normal: thomas_normal, closeup: thomas_closeup, name:"Thomas Lechner", position:"Immobilienberater", email:"lechner@sira-group.at", tel:"+43 664 88736321"},
        { normal: elisa_normal, closeup: elisa_closeup, name: "Elisa Schmidt", position: "Assistenz", email: "schmidt@sira-group.at", tel: "" },
    ];

    return <>
        <Helmet>
            <title>Team | SIRA Group</title>
            <meta 
                name="description"
                content = "Erfahren Sie mehr über die SIRA Group"
            />
        </Helmet>
        <NavBar isLandingpage={false}></NavBar>
        <div className="team">
            <div className="teamtext">
                <h2>
                    {t("teamheader")}
                </h2>
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
                            alt={`Team member ${index + 1}`}
                            className="member-image normal"
                        />
                        <img
                            src={member.closeup}
                            alt={`Team member ${index + 1} closeup`}
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