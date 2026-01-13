import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { XMLParser } from "fast-xml-parser";

const app = express();
app.use(cors());
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


app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));