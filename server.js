const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const VISITS_FILE = path.join(__dirname, "neptlyfy_visits.txt");

function ensureFile() {
  if (!fs.existsSync(VISITS_FILE)) fs.writeFileSync(VISITS_FILE, "0");
}

function readCount() {
  ensureFile();
  let raw = fs.readFileSync(VISITS_FILE, "utf8").trim();
  let n = parseInt(raw);
  return isNaN(n) ? 0 : n;
}

function writeCount(n) {
  fs.writeFileSync(VISITS_FILE, String(n));
}

app.use(express.static(__dirname));

app.get("/api/visits", (req, res) => {
  let count = readCount();
  count++;
  writeCount(count);
  res.json({ count });
});

app.listen(PORT, () => console.log(`Neptlyfy en http://localhost:${PORT}`));
