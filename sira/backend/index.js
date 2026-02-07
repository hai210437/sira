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

    // E-Mail erstellen (HTML mit modernem SIRA Design)
    const emailBody = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiko:wght@400;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Amiko', 'Segoe UI', Tahoma, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #e6e6e6 100%);
        }
        .email-wrapper {
            max-width: 650px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 3, 36, 0.15);
        }
        .header {
            background: linear-gradient(135deg, #000324 0%, #003b8a 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid #003b8a;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 400;
        }
        ${sourceUrl ? `
        .property-banner {
            background: linear-gradient(90deg, #003b8a 0%, #0055bb 100%);
            padding: 20px 30px;
            margin: 30px 0 0 0;
            border-bottom: 3px solid #000324;
        }
        .property-banner h2 {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .property-link {
            display: inline-block;
            color: #ffffff;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }
        .property-link:hover {
            background: rgba(255, 255, 255, 0.25);
        }
        ` : ''}
        .content {
            padding: 50px 30px 30px 30px;
        }
        .intro-text {
            color: #000324;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .contact-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border: 2px solid #e6e6e6;
            border-left: 6px solid #003b8a;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .contact-row {
            display: flex;
            margin: 16px 0;
            align-items: baseline;
        }
        .contact-label {
            font-weight: 700;
            color: #000324;
            min-width: 120px;
            font-size: 15px;
        }
        .contact-value {
            color: #333333;
            font-size: 15px;
            flex: 1;
            line-height: 1.5;
        }
        .contact-value a {
            color: #003b8a;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }
        .contact-value a:hover {
            border-bottom-color: #003b8a;
        }
        .message-section {
            background: #ffffff;
            border: 2px solid #e6e6e6;
            padding: 25px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .message-heading {
            font-weight: 700;
            color: #000324;
            margin: 0 0 15px 0;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 10px;
            border-bottom: 2px solid #003b8a;
        }
        .message-text {
            color: #333333;
            line-height: 1.8;
            font-size: 15px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .cta-box {
            background: linear-gradient(135deg, #000324 0%, #003b8a 100%);
            padding: 20px;
            margin: 30px 0;
            border-radius: 8px;
            text-align: center;
        }
        .cta-box p {
            margin: 0;
            color: #ffffff;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background: #f8f9fa;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e6e6e6;
        }
        .footer p {
            margin: 5px 0;
            color: #666666;
            font-size: 13px;
            line-height: 1.5;
        }
        .footer a {
            color: #003b8a;
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <h1>SIRA Anfrage</h1>
            <p>Neue Kontaktanfrage von sira-group.at</p>
        </div>

        ${sourceUrl ? `
        <div class="property-banner">
            <h2>Anfrage bezüglich Immobilie:</h2>
            <a href="${sourceUrl}" class="property-link" target="_blank">${sourceUrl}</a>
        </div>
        ` : ''}

        <div class="content">
            <div class="intro-text">
                <strong>Sie haben eine neue Anfrage über das Kontaktformular erhalten.</strong>
            </div>

            <div class="contact-card">
                <div class="contact-row">
                    <div class="contact-label">Name:</div>
                    <div class="contact-value"><strong>${vorname} ${nachname}</strong></div>
                </div>
                <div class="contact-row">
                    <div class="contact-label">E-Mail:</div>
                    <div class="contact-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="contact-row">
                    <div class="contact-label">Telefon:</div>
                    <div class="contact-value">${telefonnr || "Nicht angegeben"}</div>
                </div>
                <div class="contact-row">
                    <div class="contact-label">Datum:</div>
                    <div class="contact-value">${date || new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            <div class="message-section">
                <h3 class="message-heading">Nachricht</h3>
                <div class="message-text">${nachricht}</div>
            </div>

            <div class="cta-box">
                <p><strong>Schnell antworten:</strong> Sie können direkt auf diese E-Mail antworten, um ${vorname} zu kontaktieren.</p>
            </div>
        </div>

        <div class="footer">
            <p>SIRA Real Estate GmbH | <a href="https://www.sira-group.at" target="_blank">www.sira-group.at</a></p>
            <p>Diese E-Mail wurde automatisch vom SIRA Kontaktformular generiert.</p>
        </div>
    </div>
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