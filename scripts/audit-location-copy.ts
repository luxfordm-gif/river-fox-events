/**
 * Audit script — dump every per-page copy field for all 21 location pages
 * into a long-format CSV. One row per (page, field). Use the resulting CSV
 * to spot duplicate phrasing, postcode-farming, banned vocabulary, etc.
 *
 * Parses the .tsx source files via the TypeScript compiler API so we don't
 * have to load Vite/React just to grab the strings. JSX nodes are flattened
 * to plain text by walking children and joining their text content; <p>
 * elements get a paragraph break, <em>/<strong> are unwrapped.
 *
 * Run:
 *   npx tsx scripts/audit-location-copy.ts
 *   (or: node --loader tsx scripts/audit-location-copy.ts)
 *
 * Outputs: location-copy-audit.csv at repo root.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOCATIONS_DIR = path.join(ROOT, "src/data/locations");

// --- JSX/expression flattening --------------------------------------------

function jsxText(node: ts.Node): string {
  if (ts.isJsxText(node)) {
    // Decode entities + collapse whitespace
    return node.text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ");
  }

  if (ts.isJsxExpression(node)) {
    if (!node.expression) return "";
    return flattenExpr(node.expression);
  }

  if (ts.isJsxElement(node)) {
    const tag = node.openingElement.tagName.getText();
    const inner = node.children.map(jsxText).join("");
    if (tag === "p") return "\n\n" + inner.trim() + "\n\n";
    if (tag === "br") return "\n";
    return inner;
  }

  if (ts.isJsxSelfClosingElement(node)) {
    const tag = node.tagName.getText();
    if (tag === "br") return "\n";
    return "";
  }

  if (ts.isJsxFragment(node)) {
    return node.children.map(jsxText).join("");
  }

  return "";
}

function flattenExpr(expr: ts.Expression): string {
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.text;
  }
  if (ts.isTemplateExpression(expr)) {
    let out = expr.head.text;
    for (const span of expr.templateSpans) {
      out += flattenExpr(span.expression);
      out += span.literal.text;
    }
    return out;
  }
  if (ts.isJsxElement(expr) || ts.isJsxFragment(expr) || ts.isJsxSelfClosingElement(expr)) {
    return jsxText(expr);
  }
  if (ts.isParenthesizedExpression(expr)) {
    return flattenExpr(expr.expression);
  }
  // Identifier reference (e.g. {cityName}) — render as a placeholder so we
  // can see it in the CSV without resolving the binding.
  if (ts.isIdentifier(expr)) {
    return `{${expr.text}}`;
  }
  // Fallback: raw source text
  return expr.getText();
}

function tidy(s: string): string {
  return s
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// --- Property extraction --------------------------------------------------

type Fields = Map<string, string>;

function extractMakeLocationCall(source: ts.SourceFile): ts.ObjectLiteralExpression | null {
  let result: ts.ObjectLiteralExpression | null = null;
  function visit(n: ts.Node) {
    if (
      ts.isCallExpression(n) &&
      ts.isIdentifier(n.expression) &&
      n.expression.text === "makeLocation" &&
      n.arguments.length > 0 &&
      ts.isObjectLiteralExpression(n.arguments[0])
    ) {
      result = n.arguments[0];
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(source);
  return result;
}

function getProp(obj: ts.ObjectLiteralExpression, name: string): ts.Expression | null {
  for (const prop of obj.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ((ts.isIdentifier(prop.name) && prop.name.text === name) ||
        (ts.isStringLiteral(prop.name) && prop.name.text === name))
    ) {
      return prop.initializer;
    }
  }
  return null;
}

function extractFields(obj: ts.ObjectLiteralExpression): {
  fields: Fields;
  faqs: Array<{ q: string; a: string; source: string }>;
  proseExists: boolean;
} {
  const fields: Fields = new Map();
  const stringFields = [
    "slug",
    "cityName",
    "region",
    "uniqueSeoTitle",
    "uniqueSeoDescription",
    "uniquePresenceAnswer",
    "uniqueLeadTimeAnswer",
  ];
  for (const f of stringFields) {
    const expr = getProp(obj, f);
    if (expr) fields.set(f, tidy(flattenExpr(expr)));
  }

  const jsxFields = ["uniqueHeroSub", "uniqueHeroLine", "uniqueWhatWeDoBody", "uniqueOccasionsBody", "uniqueWhatWeDoLead", "uniqueOccasionsLead"];
  for (const f of jsxFields) {
    const expr = getProp(obj, f);
    if (expr) fields.set(f, tidy(flattenExpr(expr)));
  }

  // localProse: { eyebrow, heading, body }
  let proseExists = false;
  const proseExpr = getProp(obj, "uniqueLocalProse");
  if (proseExpr && ts.isObjectLiteralExpression(proseExpr)) {
    proseExists = true;
    const eyebrow = getProp(proseExpr, "eyebrow");
    if (eyebrow) fields.set("uniqueLocalProseEyebrow", tidy(flattenExpr(eyebrow)));
    const heading = getProp(proseExpr, "heading");
    if (heading) fields.set("uniqueLocalProseHeading", tidy(flattenExpr(heading)));
    const body = getProp(proseExpr, "body");
    if (body) fields.set("uniqueLocalProseBody", tidy(flattenExpr(body)));
  }

  // uniqueExtraFaqs: [{ q, a }, ...]
  const faqs: Array<{ q: string; a: string; source: string }> = [];
  const single = getProp(obj, "uniqueExtraFaq");
  if (single && ts.isObjectLiteralExpression(single)) {
    const q = getProp(single, "q");
    const a = getProp(single, "a");
    if (q && a) faqs.push({ q: tidy(flattenExpr(q)), a: tidy(flattenExpr(a)), source: "uniqueExtraFaq" });
  }
  const multi = getProp(obj, "uniqueExtraFaqs");
  if (multi && ts.isArrayLiteralExpression(multi)) {
    multi.elements.forEach((el, i) => {
      if (ts.isObjectLiteralExpression(el)) {
        const q = getProp(el, "q");
        const a = getProp(el, "a");
        if (q && a)
          faqs.push({
            q: tidy(flattenExpr(q)),
            a: tidy(flattenExpr(a)),
            source: `uniqueExtraFaqs[${i}]`,
          });
      }
    });
  }

  return { fields, faqs, proseExists };
}

// --- CSV emission ---------------------------------------------------------

function csvCell(s: string | number | undefined | null): string {
  if (s == null) return "";
  const str = String(s);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function wordCount(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

// --- Main -----------------------------------------------------------------

async function main() {
  const files = (await fs.readdir(LOCATIONS_DIR))
    .filter((f) => f.endsWith(".tsx"))
    .filter((f) => !["_makeLocation.tsx", "index.tsx"].includes(f))
    .sort();

  type Row = { page: string; field: string; chars: number; words: number; current_copy: string };
  const rows: Row[] = [];

  for (const file of files) {
    const slug = file.replace(/\.tsx$/, "");
    const src = await fs.readFile(path.join(LOCATIONS_DIR, file), "utf8");
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

    const obj = extractMakeLocationCall(sourceFile);
    if (!obj) {
      console.warn(`No makeLocation() call found in ${file}`);
      continue;
    }

    const { fields, faqs } = extractFields(obj);

    const push = (field: string, copy: string) => {
      rows.push({ page: slug, field, chars: copy.length, words: wordCount(copy), current_copy: copy });
    };

    // Emit in a deterministic order for easy CSV scanning
    const order = [
      "uniqueSeoTitle",
      "uniqueSeoDescription",
      "uniqueHeroLine",
      "uniqueHeroSub",
      "uniqueWhatWeDoLead",
      "uniqueWhatWeDoBody",
      "uniqueOccasionsLead",
      "uniqueOccasionsBody",
      "uniqueLocalProseEyebrow",
      "uniqueLocalProseHeading",
      "uniqueLocalProseBody",
      "uniquePresenceAnswer",
      "uniqueLeadTimeAnswer",
    ];
    for (const k of order) {
      if (fields.has(k)) push(k, fields.get(k)!);
    }
    faqs.forEach((f, i) => {
      push(`extraFaq${i + 1}Q`, f.q);
      push(`extraFaq${i + 1}A`, f.a);
    });
  }

  const header = ["page", "field", "chars", "words", "current_copy", "new_copy", "notes"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [r.page, r.field, r.chars, r.words, r.current_copy, "", ""].map(csvCell).join(",")
    );
  }

  const out = path.join(ROOT, "location-copy-audit.csv");
  await fs.writeFile(out, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${rows.length} rows for ${files.length} pages to ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
