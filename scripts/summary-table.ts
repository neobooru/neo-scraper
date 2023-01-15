import NeoScraper from "../src/NeoScraper.js";
import FallbackEngine from "../src/engines/Fallback.js";

const engines = [...new NeoScraper().engines, new FallbackEngine()];
const txt = ["| Engine | Sites | Features | Notes |", "|---|---|---|---|---|"];

for (const engine of engines) {
  txt.push(
    `| ${engine.name} | ${engine.supportedHosts.join(", ")} | ${engine.features.join(", ")} | ${engine.notes.join(
      " "
    )} |`
  );
}

console.log(txt.join("\n"));
