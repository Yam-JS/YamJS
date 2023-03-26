import a from "path";
import { watch as c } from "chokidar";
import { r as e } from "./reload-6eeeabf2.mjs";
import "http";
const n = (r = "src", s = ["js", "ts"]) => {
  c(`${r}/**/*.+(${s.join("|")})`, {}).on("change", async () => {
    e();
  });
}, [, , i, o] = process.argv, t = a.resolve(process.cwd(), i);
console.log(`Watching for changes in ${t}...`);
n(t, o ? o.split(",") : void 0);
//# sourceMappingURL=watcher.es.js.map
