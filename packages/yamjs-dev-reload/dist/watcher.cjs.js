"use strict";const c=require("path"),o=require("chokidar"),a=require("./reload-41695ad2.js");require("http");const n=(r="src",s=["js","ts"])=>{o.watch(`${r}/**/*.+(${s.join("|")})`,{}).on("change",async()=>{a.reload()})},[,,i,e]=process.argv,t=c.resolve(process.cwd(),i);console.log(`Watching for changes in ${t}...`);n(t,e?e.split(","):void 0);
//# sourceMappingURL=watcher.cjs.js.map
