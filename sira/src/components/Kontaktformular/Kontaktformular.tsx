import { useTranslation } from "react-i18next";
import "./Kontaktformular.css";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import StandortKarte from "../map/Map";

interface KontaktformularProps {
    isKontaktSeite: boolean;
}

const Kontaktformular: React.FC<KontaktformularProps> = ({ isKontaktSeite }) => {
    const { t } = useTranslation();
    var today = new Date();

    const form = useRef<HTMLFormElement>(null);

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_w7npolj",
                "template_5k6dm6d",
                form.current!,
                "CjGSFMXAus1AERzfr"
            )
            .then(
                () => {
                    alert("Nachricht erfolgreich gesendet!");
                    form.current?.reset();
                },
                (error) => alert("Fehler beim Senden: " + error.text)
            );
    };

    return (
        <>
            
            <div className="kontaktformular">
                <form className="formular-links" ref={form} onSubmit={sendEmail}>

                    <div className="row">
                        <input type="text" name="vorname" placeholder={t("vorname")} maxLength={30} />
                        <input type="text" name="nachname" placeholder={t("nachname")} />
                    </div>

                    <div className="row">
                        <input type="email" name="email" placeholder="E-Mail" maxLength={30} />
                        <input type="text" name="telefonnr" placeholder={t("telefon")} maxLength={30} />
                        <input type="hidden" name="date" value={today.toLocaleDateString()} />
                    </div>

                    <div className="row fullwidth">
                        <textarea name="nachricht" placeholder={t("nachricht")} />
                    </div>
                    <div className="row fullwidth">
                        <button className="sendbutton">{t("senden")}</button>
                    </div>
                </form>
                {!isKontaktSeite &&
                    <div className="formular-rechts">
                        <StandortKarte></StandortKarte>
                    </div>
                }
                {isKontaktSeite &&
                    <div className="formular-rechts"></div>
                }
            </div>
        </>
    );
};

export default Kontaktformular;
