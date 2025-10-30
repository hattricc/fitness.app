import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function fail(msg) {
    console.error("❌ cms-to-array:", msg);
    process.exit(1);
}

try {
    const src = resolve(__dirname, "../src/data/courses.cms.json");
    const dst = resolve(__dirname, "../src/data/courses.json");

    console.log("🔎 Leyendo:", src);
    if (!existsSync(src)) fail("No existe src/data/courses.cms.json");

    const raw = readFileSync(src, "utf-8").trim();
    if (!raw) fail("courses.cms.json está vacío");

    let obj;
    try {
        obj = JSON.parse(raw);
    } catch (e) {
        fail("courses.cms.json no es JSON válido: " + e.message);
    }

    const items = Array.isArray(obj) ? obj : (obj.items ?? []);
    if (!Array.isArray(items)) fail("No se encontró un array en obj.items");

    const out = JSON.stringify(items, null, 2);

    // Asegura carpeta destino
    const dir = dirname(dst);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    writeFileSync(dst, out);
    console.log(
        `✅ Generado ${dst} con ${items.length} cursos` +
        (items[0]?.id ? ` (primero: ${items[0].id})` : "")
    );
} catch (e) {
    fail(e?.message || String(e));
}
