import { useTranslation } from "react-i18next";
import "./Kontaktformular.css";
import { useRef, useState } from "react";
import StandortKarte from "../map/Map";

interface KontaktformularProps {
    isKontaktSeite: boolean;
}

const Kontaktformular: React.FC<KontaktformularProps> = ({ isKontaktSeite }) => {
    const { t } = useTranslation();
    const today = new Date();
    const form = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(form.current!);
            const data = {
                vorname: formData.get("vorname"),
                nachname: formData.get("nachname"),
                email: formData.get("email"),
                telefonnr: formData.get("telefonnr"),
                nachricht: formData.get("nachricht"),
                date: formData.get("date"),
            };

            // Backend API aufrufen (wird über Docker Networking automatisch geroutet)
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Fehler beim Senden");
            }

            const result = await response.json();
            alert(result.message || "Nachricht erfolgreich gesendet!");
            form.current?.reset();
        } catch (error) {
            console.error("Fehler:", error);
            alert("Fehler beim Senden: " + (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>

            <div className="kontaktformular">
                <form className="formular-links" ref={form} onSubmit={sendEmail}>

                    <div className="row">
                        <input type="text" name="vorname" placeholder={t("vorname")} maxLength={30} required />
                        <input type="text" name="nachname" placeholder={t("nachname")} required />
                    </div>

                    <div className="row">
                        <input type="email" name="email" placeholder="E-Mail" maxLength={30} required />
                        <input type="text" name="telefonnr" placeholder={t("telefon")} maxLength={30} />
                        <input type="hidden" name="date" value={today.toLocaleDateString()} />
                    </div>

                    <div className="row fullwidth">
                        <textarea name="nachricht" placeholder={t("nachricht")} required />
                    </div>
                    <div className="row fullwidth">
                        <button className="sendbutton" disabled={isSubmitting}>
                            {isSubmitting ? "Wird gesendet..." : t("senden")}
                        </button>
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
