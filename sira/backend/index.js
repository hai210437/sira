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
    const { vorname, nachname, email, telefonnr, nachricht, date } = req.body;

    // Validierung
    if (!vorname || !nachname || !email || !nachricht) {
      return res.status(400).json({ error: "Pflichtfelder fehlen" });
    }

    console.log("📧 Verarbeite Kontaktformular:", { vorname, nachname, email });

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

    // E-Mail erstellen (HTML mit schönem Design)
    const emailBody = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .info-card {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-row {
            display: flex;
            margin: 12px 0;
            align-items: flex-start;
        }
        .info-label {
            font-weight: 600;
            color: #1e3a8a;
            min-width: 100px;
            margin-right: 10px;
        }
        .info-value {
            color: #334155;
            flex: 1;
        }
        .message-box {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 20px;
            margin: 20px 0;
            border-radius: 6px;
            line-height: 1.6;
            color: #334155;
        }
        .message-label {
            font-weight: 600;
            color: #1e3a8a;
            margin-bottom: 10px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
        }
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
        .badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Neue Kontaktanfrage</h1>
            <div class="badge">Website Kontaktformular</div>
        </div>

        <div class="content">
            <p style="color: #334155; font-size: 16px; margin-bottom: 20px;">
                Sie haben eine neue Anfrage über das Kontaktformular auf <strong>sira-group.at</strong> erhalten:
            </p>

            <div class="info-card">
                <div class="info-row">
                    <div class="info-label">Name:</div>
                    <div class="info-value"><strong>${vorname} ${nachname}</strong></div>
                </div>
                <div class="info-row">
                    <div class="info-label">E-Mail:</div>
                    <div class="info-value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
                </div>
                <div class="info-row">
                    <div class="info-label">Telefon:</div>
                    <div class="info-value">${telefonnr || "Nicht angegeben"}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Datum:</div>
                    <div class="info-value">${date || new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
            </div>

            <div class="message-box">
                <div class="message-label">Nachricht</div>
                <div style="white-space: pre-wrap;">${nachricht}</div>
            </div>

            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                <strong>Tipp:</strong> Sie können direkt auf diese E-Mail antworten, um ${vorname} zu kontaktieren.
            </p>
        </div>

        <div class="footer">
            <p style="margin: 5px 0;">
                Diese E-Mail wurde automatisch generiert.
            </p>
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