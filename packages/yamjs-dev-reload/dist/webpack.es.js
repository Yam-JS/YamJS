import d from "webpack";
import f from "path";
import { r as u } from "./reload-6eeeabf2.mjs";
import "http";
const m = () => process.stdout.isTTY;
function c() {
  m() && process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}
const l = "Syntax error:";
function p(r) {
  return r.indexOf(l) !== -1;
}
function a(r) {
  let o = [];
  return typeof r == "string" ? o = r.split(`
`) : "message" in r ? o = r.message.split(`
`) : Array.isArray(r) && r.forEach((n) => {
    "message" in n && (o = n.message.split(`
`));
  }), o = o.filter((n) => !/Module [A-z ]+\(from/.test(n)), o = o.map((n) => {
    const t = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(n);
    if (!t)
      return n;
    const [, e, i, s] = t;
    return `${l} ${s} (${e}:${i})`;
  }), r = o.join(`
`), r = r.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, `${l} $3 ($1:$2)
`), r = r.replace(/^.*export '(.+?)' was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$2'."), r = r.replace(/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$2' does not contain a default export (imported as '$1')."), r = r.replace(/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$3' (imported as '$2')."), o = r.split(`
`), o.length > 2 && o[1].trim() === "" && o.splice(1, 1), o[0] = o[0].replace(/^(.*) \d+:\d+-\d+$/, "$1"), o[1] && o[1].indexOf("Module not found: ") === 0 && (o = [o[0], o[1].replace("Error: ", "").replace("Module not found: Cannot find file:", "Cannot find file:")]), r = o.join(`
`), r = r.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, ""), r = r.replace(/^\s*at\s<anonymous>(\n|$)/gm, ""), o = r.split(`
`), o = o.filter((n, t, e) => t === 0 || n.trim() !== "" || n.trim() !== e[t - 1].trim()), r = o.join(`
`), r.trim();
}
function $(r) {
  const o = r.errors.map(a), n = r.warnings.map(a), t = {
    errors: o,
    warnings: n
  };
  return t.errors.some(p) && (t.errors = t.errors.filter(p)), t;
}
const x = process.stdout.isTTY;
async function y(r) {
  const n = require(f.join(r, "webpack.config.js"))({
    dev: !0
  });
  let t;
  try {
    t = d(n, (e, i) => {
    });
  } catch (e) {
    console.log(e), process.exit(1);
  }
  return x && c(), t.hooks.invalid.tap("invalid", () => {
    c(), console.log("Compiling...");
  }), t.hooks.done.tap("done", async (e) => {
    c();
    const i = $(e.toJson({
      all: !1,
      warnings: !0,
      errors: !0
    }));
    for (const s of i.errors)
      console.log(s);
    console.log(i.errors.length ? "Failed to compile." : "Compiled successfully."), u();
  }), t.watch({}, (e) => {
    e ?? console.log(e);
  });
}
y(f.resolve(process.cwd()));
//# sourceMappingURL=webpack.es.js.map
