import express from "express";
import dotenv from "dotenv";
import { XMLParser } from "fast-xml-parser";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;

app.get("/api/justimmo", async (req, res) => {
  const baseUrl = "https://api.justimmo.at/rest/v1/objekt/list";
  const user = process.env.JUSTIMMO_USER;
  const pass = process.env.JUSTIMMO_PASSWORD;
  const auth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  console.log("Hole JustImmo Objekte...");

  const LIMIT = 100;
  let offset = 0;
  const allObjects = [];

  const parser = new XMLParser();

  try {
    while (true) {
      const url = `${baseUrl}?limit=${LIMIT}&offset=${offset}`;
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
      allObjects.push(...list);

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

app.use(express.static("public"));
app.get(/.*/, (_, res) => res.sendFile("index.html", { root: "public" }));

app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));