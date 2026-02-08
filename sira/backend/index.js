import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

const app = express();
app.use(cors());
app.use(express.json()); // Body parser für POST requests
dotenv.config();
const PORT = process.env.PORT || 67;

app.get("/justimmo", async (req, res) => {
  const baseUrl = "https://api.justimmo.at/rest/v1/objekt/list";
  const user = process.env.JUSTIMMO_USER;
  const pass = process.env.JUSTIMMO_PASSWORD;
  let lang = req.query.lang || 'de';
  let preisvon = req.query.preisvon || '0';
  let preisbis = req.query.preisbis || '9999999';
  let qmvon = req.query.qmvon || '0';
  let qmbis = req.query.qmbis || '9999';
  let plz = req.query.plz || '';
  if (lang !== 'de' && lang !== 'en') {
    lang = 'en'; // Fallback auf Deutsch, wenn Sprache nicht unterstützt wird
  }

  const auth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

  console.log("Hole JustImmo Objekte..."); 

  const LIMIT = 100;
  let offset = 0;
  const allObjects = [];

  const parser = new XMLParser();

  
  try {
    while (true) {
      const params = `picturesize=uhd&limit=${LIMIT}&offset=${offset}&orderby=preis&ordertype=desc&filter[preis_von]=${preisvon}&filter[preis_bis]=${preisbis}&filter[wohnflaeche_von]=${qmvon}&filter[wohnflaeche_bis]=${qmbis}&filter[plz]=${plz}`;
      const url = `${baseUrl}?${params}`;
      console.log(url);
      const response = await fetch(url, {
        headers: {
          "Authorization": auth,
          "Accept": "application/xml",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const xmlText = await response.text();
      const parsed = parser.parse(xmlText);
      const immos = parsed?.justimmo?.immobilie;

      if (!immos) {
        console.log("Keine Immobilien mehr gefunden.");
        break;
      }

      // Wenn nur ein einzelnes Objekt zurückkommt, in Array verwandeln
      const list = Array.isArray(immos) ? immos : [immos];

      const filtered = list.filter(obj => {
        const preis = parseFloat(obj.preis || 0);
        const minPreis = parseFloat(preisvon);
        
        // Nur Objekte >= minPreis behalten
        if (preis < minPreis) {
          console.log(`⚠️ Objekt ${obj.id} aussortiert (Preis: ${preis} < ${minPreis})`);
          return false;
        }
        return true;
      });
      
      allObjects.push(...filtered);

      console.log(`Offset ${offset}: ${list.length} Objekte erhalten.`);

      // Wenn weniger als LIMIT geliefert wurde → fertig
      if (list.length < LIMIT) break;

      offset += LIMIT;
    }

    console.log(`✅ Fertig! Insgesamt ${allObjects.length} Objekte geladen.`);
    res.json(allObjects);
  } catch (err) {
    console.error("Fehler bei JustImmo:", err);
    res.status(500).json({ error: err.message });
  }
});


// ===== Microsoft Graph API - Contact Form Endpoint =====
app.post("/api/contact", async (req, res) => {
  try {
    const { vorname, nachname, email, telefonnr, nachricht, date, sourceUrl } = req.body;

    // Validierung
    if (!vorname || !nachname || !email || !nachricht) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    console.log("📧 Verarbeite Kontaktformular:", { vorname, nachname, email, sourceUrl });

    // Microsoft Graph Client Setup mit Client Credentials Flow
    const tenantId = process.env.MICROSOFT_TENANT_ID;
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const senderEmail = process.env.MICROSOFT_SENDER_EMAIL || "anfragen@sira-group.at";
    const recipientEmail = process.env.MICROSOFT_RECIPIENT_EMAIL || "office@sira-group.at";

    if (!tenantId || !clientId || !clientSecret) {
      throw new Error("Microsoft 365 Credentials fehlen in Environment Variables");
    }

    // Access Token holen
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token-Fehler: ${error}`);
    }

    const { access_token } = await tokenResponse.json();

    // Graph Client initialisieren
    const client = Client.init({
      authProvider: (done) => {
        done(null, access_token);
      },
    });

    // E-Mail erstellen (Outlook-kompatibles table-basiertes Layout)
    const emailBody = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; max-width: 600px;">

                    <tr>
                        <td style="background-color: #000324; padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
                                SIRA ANFRAGE
                            </h1>
                            <p style="margin: 10px 0 0 0; font-size: 15px; color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
                                Neue Kontaktanfrage von sira-group.at
                            </p>
                        </td>
                    </tr>

                    ${sourceUrl ? `
                    <tr>
                        <td style="background-color: #000324; padding: 25px 30px; border-bottom: 4px solid #000324;">
                            <p style="margin: 0 0 10px 0; font-size: 13px; color: #ffffff; font-family: Arial, Helvetica, sans-serif; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                                Anfrage bezüglich Immobilie:
                            </p>
                            <a href="${sourceUrl}" style="display: inline-block; color: #ffffff; text-decoration: none; font-size: 14px; font-family: Arial, Helvetica, sans-serif; padding: 10px 18px; background-color: rgba(255, 255, 255, 0.2); border: 2px solid #ffffff;">
                                ${sourceUrl}
                            </a>
                        </td>
                    </tr>
                    ` : ''}

                    <tr>
                        <td style="padding: 40px 30px;">

                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #000324; font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
                                <strong>Sie haben eine neue Anfrage über das Kontaktformular erhalten.</strong>
                            </p>

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 2px solid #000324; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="120" style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #000324; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">
                                                    Name:
                                                </td>
                                                <td style="padding: 8px 0; font-size: 15px; color: #333333; font-family: Arial, Helvetica, sans-serif;">
                                                    <strong>${vorname} ${nachname}</strong>
                                                </td>
                                            </tr>
                                        </table>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="120" style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #000324; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">
                                                    E-Mail:
                                                </td>
                                                <td style="padding: 8px 0; font-size: 15px; color: #333333; font-family: Arial, Helvetica, sans-serif;">
                                                    <a href="mailto:${email}" style="color: #000324; text-decoration: none; font-weight: bold;">${email}</a>
                                                </td>
                                            </tr>
                                        </table>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="120" style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #000324; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">
                                                    Telefon:
                                                </td>
                                                <td style="padding: 8px 0; font-size: 15px; color: #333333; font-family: Arial, Helvetica, sans-serif;">
                                                    ${telefonnr || "Nicht angegeben"}
                                                </td>
                                            </tr>
                                        </table>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="120" style="padding: 8px 0; font-size: 15px; font-weight: bold; color: #000324; font-family: Arial, Helvetica, sans-serif; vertical-align: top;">
                                                    Datum:
                                                </td>
                                                <td style="padding: 8px 0; font-size: 15px; color: #333333; font-family: Arial, Helvetica, sans-serif;">
                                                    ${date || new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 2px solid #e6e6e6; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #000324; font-family: Arial, Helvetica, sans-serif; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 10px; border-bottom: 3px solid #000324;">
                                            NACHRICHT
                                        </p>
                                        <p style="margin: 0; font-size: 15px; color: #333333; font-family: Arial, Helvetica, sans-serif; line-height: 1.8; white-space: pre-wrap;">${nachricht}</p>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000324; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="margin: 0; font-size: 14px; color: #ffffff; font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
                                            <strong>💬 Schnell antworten:</strong> Einfach direkt auf diese E-Mail antworten, um ${vorname} zu kontaktieren.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #ffffff; padding: 25px 30px; text-align: center; border-top: 3px solid #000324;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #000324; font-family: Arial, Helvetica, sans-serif; font-weight: bold;">
                                SIRA Real Estate GmbH
                            </p>
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666666; font-family: Arial, Helvetica, sans-serif;">
                                <a href="https://www.sira-group.at" target="_blank" style="color: #000324; text-decoration: none; font-weight: bold;">www.sira-group.at</a>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, Helvetica, sans-serif;">
                                Diese E-Mail wurde automatisch vom SIRA Kontaktformular generiert.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const message = {
      message: {
        subject: `Neue Kontaktanfrage von ${vorname} ${nachname}`,
        body: {
          contentType: "HTML",
          content: emailBody,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipientEmail,
            },
          },
        ],
        replyTo: [
          {
            emailAddress: {
              address: email,
              name: `${vorname} ${nachname}`,
            },
          },
        ],
      },
    };

    // E-Mail senden über Microsoft Graph API
    await client.api(`/users/${senderEmail}/sendMail`).post(message);

    console.log(`✅ E-Mail erfolgreich gesendet von ${senderEmail} an ${recipientEmail}`);
    res.json({ success: true, message: "Nachricht erfolgreich gesendet!" });
  } catch (err) {
    console.error("❌ Fehler beim Senden:", err);
    res.status(500).json({
      error: "Fehler beim Senden der Nachricht",
      details: err.message
    });
  }
});

app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));