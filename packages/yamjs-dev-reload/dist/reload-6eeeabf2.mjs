import s from "http";
const e = {
  hasInitialized: !1,
  isReloading: !1
}, n = () => {
  if (!e.hasInitialized) {
    e.hasInitialized = !0;
    return;
  }
  if (e.isReloading)
    return;
  const r = {
    hostname: "localhost",
    port: 8e3,
    path: "/reload",
    method: "GET"
  };
  try {
    e.isReloading = !0;
    const o = s.request(r, (t) => {
      t.on("data", (a) => {
        e.isReloading = !1, console.log("Reload successful");
      });
    });
    o.on("error", (t) => (console.log("Failed to connect..."), setTimeout(n, 1e3))), setTimeout(() => {
      o.end();
    }, 1e3);
    return;
  } catch (o) {
    console.log(o), console.log("Failed to connect..."), setTimeout(n, 1e3);
    return;
  }
};
export {
  n as r
};
//# sourceMappingURL=reload-6eeeabf2.mjs.map
