import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const src = `${__dirname}/../public/data/courses.cms.json`;
const dst = `${__dirname}/../public/data/courses.json`; // tu archivo real

const raw = readFileSync(src, "utf-8");
const obj = JSON.parse(raw || "{}");
const items = Array.isArray(obj) ? obj : (obj.items ?? []);
if (!existsSync(dirname(dst))) mkdirSync(dirname(dst), { recursive: true });
writeFileSync(dst, JSON.stringify(items, null, 2));
console.log(`✅ Generado ${dst} con ${items.length} cursos`);
