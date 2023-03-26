import { lifecycle as n } from "@yam-js/core";
const h = () => {
  const a = Java.type("com.sun.net.httpserver.HttpServer"), d = Java.type("java.net.InetSocketAddress");
  class i {
    constructor() {
      this.handle = this.handle.bind(this);
    }
    handle(e) {
      if (e.getRequestMethod() === "GET") {
        const o = "Done";
        e.sendResponseHeaders(200, o.length);
        const r = e.getResponseBody();
        r.write(o.split("").map((l) => l.charCodeAt(0))), r.close(), n.reload();
      } else
        e.sendResponseHeaders(405, -1);
    }
  }
  const t = a.create(new d(8e3), 0);
  t.createContext("/reload", new i()), t.start(), n.register("onDisable", {
    hook: () => new Promise((s) => {
      t.stop(0), setTimeout(() => {
        s();
      }, 10);
    }),
    name: "yamjs-dev-reload"
  });
};
export {
  h as initializeDevReload
};
//# sourceMappingURL=yamjs.es.js.map
