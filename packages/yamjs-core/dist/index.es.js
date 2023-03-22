const g = Java.type("java.lang.Runtime"), l = Java.type("java.lang.System"), j = () => {
  const e = Java.type("java.lang.Long"), n = Java.type("org.bukkit.Bukkit"), t = n.getPluginManager().getPlugin("YamJS").getDataFolder().getParentFile().getParentFile(), a = n.getPluginManager().getPlugins().map((o) => o.getName());
  return {
    yamJS: {
      coreVersion: "0.0.1",
      pluginVersion: "0.0.1",
      legacyVersion: "0.0.1"
    },
    server: {
      players: `${n.getOnlinePlayers().size()} / ${n.getMaxPlayers()}`,
      plugins: a,
      minecraftVersion: n.getVersion(),
      bukkitVersion: n.getBukkitVersion(),
      onlineMode: n.getOnlineMode()
    },
    java: {
      version: l.getProperty("java.version"),
      vendor: l.getProperty("java.vendor"),
      vendorUrl: l.getProperty("java.vendor.url"),
      home: l.getProperty("java.home"),
      command: l.getProperty("sun.java.command"),
      timezone: l.getProperty("user.timezone")
    },
    system: {
      os: {
        name: l.getProperty("os.name"),
        version: l.getProperty("os.version"),
        arch: l.getProperty("os.arch")
      },
      cpu: {
        cores: g.getRuntime().availableProcessors()
      },
      memory: {
        free: g.getRuntime().freeMemory(),
        max: g.getRuntime().maxMemory() == e.MAX_VALUE ? "unlimited" : g.getRuntime().maxMemory(),
        total: g.getRuntime().totalMemory()
      },
      storage: {
        free: t.getFreeSpace(),
        total: t.getTotalSpace(),
        usable: t.getUsableSpace()
      }
    }
    // TODO: Context count
    // TODO: Event registered count
    // TODO: Command registered count
    // TODO: Server started at
    // TODO: Plugins loaded at
  };
};
let T = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").forEach(function(e, n) {
  T[e] = n;
});
function E(e) {
  let n = [], s = 0, t = 0;
  for (let a = 0; a < e.length; a += 1) {
    let i = T[e[a]];
    if (i === void 0)
      throw new Error("Invalid character (" + e[a] + ")");
    const o = i & 32;
    if (i &= 31, t += i << s, o)
      s += 5;
    else {
      const c = t & 1;
      t >>>= 1, c ? n.push(t === 0 ? -2147483648 : -t) : n.push(t), t = s = 0;
    }
  }
  return n;
}
function F(e) {
  const s = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((a) => E(a)));
  return {
    sources: e.sources,
    mappings: s,
    startOffset: 0
  };
}
function R(e) {
  const n = JSON.parse(e);
  return F(n);
}
const b = /* @__PURE__ */ new Map();
function J(e, n, s) {
  const t = R(n);
  return t ? (t.startOffset = s, b.set(e, t), !0) : !1;
}
function w({
  mappings: e,
  sources: n
}, s) {
  let t = 0, a = 0, i = 0;
  for (let o = 0; o < e.length; o++)
    if (e[o].forEach((r) => {
      t += r[2] ?? 0, a += r[1] ?? 0;
    }), o + 1 === s)
      return i = t + 1, {
        file: n[a],
        line: i
      };
  throw new Error(`source map failed for line ${s}`);
}
function z(e, n) {
  const s = b.get(`${e}`);
  if (s) {
    if (n -= s.startOffset, n <= 0)
      return {
        file: e,
        line: n
      };
    const t = w(s, n);
    return t.file.startsWith("webpack://test/") && (t.file = t.file.replace("webpack://test/", "")), t.file.startsWith("../") && (t.file = t.file.replace("../", "./")), t;
  } else
    return {
      file: e,
      line: n
    };
}
const y = Java.type("org.bukkit.Bukkit"), C = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), v = "      ", Y = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], L = ["webpack/runtime/make"], N = ["catchAndLogUnhandledErrors"], V = (e) => {
  const n = [];
  n.push(e.name);
  for (let s = 0; s < e.stack.length; s++) {
    const t = e.stack[s];
    if (t.javaFrame) {
      if (Y.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${v}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const a = z(t.source, t.line);
    if (L.some((o) => a.file.includes(o)) || N.includes(t.methodName) || a.line === 0)
      continue;
    let i = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (i = "<anonymous>"), n.push(`${v}at ${i} (${a.file}:${a.line}) [${t.source}:${t.line}]`);
  }
  return n.join(`
`);
}, d = (e, n) => {
  var t, a, i;
  let s;
  try {
    const o = ((i = (a = (t = e == null ? void 0 : e.getClass) == null ? void 0 : t.call(e)) == null ? void 0 : a.getName) == null ? void 0 : i.call(a)) ?? void 0;
    o != null && o.includes("yamjs.JsError") ? s = e : s = __interop.catchError(() => {
      throw e;
    });
    const c = V(s);
    n && y.getConsoleSender().sendMessage(n), y.getConsoleSender().sendMessage(C.miniMessage().deserialize(`<red>${c}</red>`));
  } catch (o) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", o.name), console.log(o.message, o.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, A = (e, n) => {
  try {
    return e();
  } catch (s) {
    d(s, n);
  }
}, O = (e, n) => (...s) => {
  try {
    return e(...s);
  } catch (t) {
    d(t, n);
  }
}, U = () => {
  const e = {};
  let n = !1, s = 0;
  const t = async () => {
    Yam.reload();
  }, a = async () => {
    var o;
    const i = {
      ...e
    };
    for (const c in i) {
      console.log(`Closing ${e[c].name}`);
      const r = e[c];
      try {
        await ((o = r.fn) == null ? void 0 : o.call(r));
      } catch (u) {
        console.error(u);
      }
      delete e[c];
    }
  };
  return {
    isReloading: () => n,
    reload: async () => {
      if (console.log("Reloading"), n) {
        console.log("Force reloading"), t();
        return;
      }
      n = !0, await a(), t();
    },
    register: (i, o) => {
      const c = s++;
      return e[c] = {
        name: i,
        fn: o
      }, {
        unregister: () => delete e[c]
      };
    },
    initialize: () => {
      Yam.instance.setOnCloseFn(async () => {
        await a();
      });
    }
  };
}, h = U();
let f;
const _ = (...e) => {
  f === void 0 && (f = Yam.getConfig().verbose), f && console.log(...e);
}, x = Symbol("TickContext"), B = () => {
  const e = m[x];
  if (e.isActive) {
    for (const n of e.tickFns)
      n(e.tick);
    e.tick % 20 === 0 && _("Tick", e.tick), e.tick += 1;
  }
}, H = () => {
  const e = {
    tick: 0,
    task: void 0,
    isActive: !1,
    tickFns: []
  }, n = () => {
    e.isActive = !0, Yam.instance.setTickFn(B);
  }, s = async () => {
    e.isActive = !1;
  };
  return {
    [x]: e,
    start: n,
    stop: s,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, m = H(), D = (e) => e, W = (e) => e, X = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), s = (o) => {
    n.delete(o);
  }, t = (o, c, r) => {
    const u = W((r == null ? void 0 : r.nextId) ?? e.nextId++), I = D(m.getTick() + Math.max(c, 1));
    return n.set(u, {
      baseTick: c,
      tick: I,
      fn: o,
      reset: (r == null ? void 0 : r.reset) || !1,
      id: u
    }), u;
  }, a = (o) => {
    n.delete(o.id), o.fn(), o.reset && t(o.fn, o.baseTick, {
      reset: o.reset,
      nextId: o.id
    });
  }, i = (o) => {
    for (const [, c] of n)
      o >= c.tick && a(c);
  };
  return {
    add: t,
    run: i,
    remove: s,
    initialize: () => {
      m.registerTickFn((o) => i(o));
    }
  };
}, k = X(), S = (e, n, s) => {
  const t = n / 50;
  return k.add(O(e, "Unhandled timer"), t, s);
}, P = (e, n) => S(e, n), q = (e, n) => S(e, n, {
  reset: !0
}), G = (e) => P(e, 0), M = (e) => k.remove(e), K = () => {
  globalThis.setTimeout = P, globalThis.setInterval = q, globalThis.setImmediate = G, globalThis.clearTimeout = M, globalThis.clearInterval = M;
};
let p = !1;
const $ = () => {
  console.log("Initializing YamJS...", p), !p && (m.start(), k.initialize(), K(), h.initialize(), Yam.instance.setLoggerFn((e) => d(e)), p = !0);
};
Yam.getConfig().initialize && $();
const Q = Symbol("internal"), Z = {
  initialize: $,
  reload: h.reload,
  logError: d,
  catchAndLogUnhandledError: A,
  cacheSourceMap: J,
  getDebugInfo: j,
  [Q]: {
    reloadHandler: h
  }
};
export {
  Z as default,
  $ as initialize,
  Q as internal
};
