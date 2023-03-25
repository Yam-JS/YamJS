const S = Java.type("org.bukkit.Bukkit"), T = S.getPluginManager(), x = T.getPlugin(Yam.getConfig().pluginName), ae = S.getServer(), g = Java.type("java.lang.Runtime"), l = Java.type("java.lang.System"), Y = (e) => Object.keys(e).reduce((t, o) => {
  var s;
  const a = e[o];
  return t[o] = (s = a == null ? void 0 : a.toString) == null ? void 0 : s.call(a), t;
}, {}), re = () => {
  const e = Java.type("java.lang.Long"), n = Java.type("org.bukkit.Bukkit"), t = n.getPluginManager().getPlugin("YamJS").getDataFolder().getParentFile().getParentFile(), o = n.getPluginManager().getPlugins().map((s) => s.getName());
  return {
    yamJS: {
      coreVersion: "0.0.1",
      pluginVersion: "0.0.1",
      legacyVersion: "0.0.1",
      instance: Y(Yam.instance)
    },
    server: {
      players: `${n.getOnlinePlayers().size()} / ${n.getMaxPlayers()}`,
      plugins: o,
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
        free: t == null ? void 0 : t.getFreeSpace(),
        total: t == null ? void 0 : t.getTotalSpace(),
        usable: t == null ? void 0 : t.getUsableSpace()
      }
    }
    // TODO: Context count
    // TODO: Event registered count
    // TODO: Command registered count
    // TODO: Server started at
    // TODO: Plugins loaded at
  };
};
let P = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").forEach(function(e, n) {
  P[e] = n;
});
function N(e) {
  let n = [], i = 0, t = 0;
  for (let o = 0; o < e.length; o += 1) {
    let a = P[e[o]];
    if (a === void 0)
      throw new Error("Invalid character (" + e[o] + ")");
    const s = a & 32;
    if (a &= 31, t += a << i, s)
      i += 5;
    else {
      const r = t & 1;
      t >>>= 1, r ? n.push(t === 0 ? -2147483648 : -t) : n.push(t), t = i = 0;
    }
  }
  return n;
}
function C(e) {
  const i = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((o) => N(o)));
  return {
    sources: e.sources,
    mappings: i,
    startOffset: 0
  };
}
function z(e) {
  const n = JSON.parse(e);
  return C(n);
}
const $ = /* @__PURE__ */ new Map();
function ce(e, n, i) {
  const t = z(n);
  return t ? (t.startOffset = i, $.set(e, t), !0) : !1;
}
function H({
  mappings: e,
  sources: n
}, i) {
  let t = 0, o = 0, a = 0;
  for (let s = 0; s < e.length; s++)
    if (e[s].forEach((c) => {
      t += c[2] ?? 0, o += c[1] ?? 0;
    }), s + 1 === i)
      return a = t + 1, {
        file: n[o],
        line: a
      };
  throw new Error(`source map failed for line ${i}`);
}
function O(e, n) {
  const i = $.get(`${e}`);
  if (i) {
    if (n -= i.startOffset, n <= 0)
      return {
        file: e,
        line: n
      };
    const t = H(i, n);
    return t.file.startsWith("webpack://test/") && (t.file = t.file.replace("webpack://test/", "")), t.file.startsWith("../") && (t.file = t.file.replace("../", "./")), t;
  } else
    return {
      file: e,
      line: n
    };
}
const h = Java.type("org.bukkit.Bukkit"), V = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), v = "      ", _ = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], A = ["webpack/runtime/make"], B = ["catchAndLogUnhandledErrors"], D = (e) => {
  const n = [];
  n.push(e.name);
  for (let i = 0; i < e.stack.length; i++) {
    const t = e.stack[i];
    if (t.javaFrame) {
      if (_.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${v}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const o = O(t.source, t.line);
    if (A.some((s) => o.file.includes(s)) || B.includes(t.methodName) || o.line === 0)
      continue;
    let a = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (a = "<anonymous>"), n.push(`${v}at ${a} (${o.file}:${o.line}) [${t.source}:${t.line}]`);
  }
  return n.join(`
`);
}, p = (e, n) => {
  var t, o, a;
  let i;
  try {
    const s = ((a = (o = (t = e == null ? void 0 : e.getClass) == null ? void 0 : t.call(e)) == null ? void 0 : o.getName) == null ? void 0 : a.call(o)) ?? void 0;
    s != null && s.includes("yamjs.JsError") ? i = e : i = __interop.catchError(() => {
      throw e;
    });
    const r = D(i);
    n && h.getConsoleSender().sendMessage(n), h.getConsoleSender().sendMessage(V.miniMessage().deserialize(`<red>${r}</red>`));
  } catch (s) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", s.name), console.log(s.message, s.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, R = (e, n) => {
  try {
    return e();
  } catch (i) {
    p(i, n);
  }
}, U = (e, n) => (...i) => {
  try {
    return e(...i);
  } catch (t) {
    p(t, n);
  }
}, W = Java.type("org.bukkit.event.EventPriority"), G = Java.type("org.bukkit.event.Listener"), X = () => new (Java.extend(G, {}))(), I = X(), le = (e, n, i = "HIGHEST", t = I) => {
  const o = {
    priority: "priority" in n ? n.priority : i,
    script: "script" in n ? n.script : n
  }, a = e.class.toString();
  T.registerEvent(
    // @ts-expect-error [java-ts-bind missing class prototype]
    e.class,
    t,
    W.valueOf(o.priority),
    // @ts-expect-error [EventExecutor]
    (s, r) => {
      r instanceof e && R(() => {
        o.script(r);
      }, `An error occured while attempting to handle the "${a}" event!`);
    },
    x
  );
};
let d;
const k = (...e) => {
  d === void 0 && (d = Yam.getConfig().verbose), d && console.log(...e);
}, J = Symbol("TickContext"), q = () => {
  const e = m[J];
  if (e.isActive) {
    for (const n of e.tickFns)
      n(e.tick);
    e.tick % 20 === 0 && k("Tick", e.tick), e.tick += 1;
  }
}, K = () => {
  const e = {
    tick: 0,
    task: void 0,
    isActive: !1,
    tickFns: []
  }, n = () => {
    e.isActive = !0, Yam.instance.setTickFn(q);
  }, i = async () => {
    e.isActive = !1;
  };
  return {
    [J]: e,
    start: n,
    stop: i,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, m = K(), Q = (e) => e, Z = (e) => e, ee = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), i = (s) => {
    n.delete(s);
  }, t = (s, r, c) => {
    const u = Z((c == null ? void 0 : c.nextId) ?? e.nextId++), w = Q(m.getTick() + Math.max(r, 1));
    return n.set(u, {
      baseTick: r,
      tick: w,
      fn: s,
      reset: (c == null ? void 0 : c.reset) || !1,
      id: u
    }), u;
  }, o = (s) => {
    n.delete(s.id), s.fn(), s.reset && t(s.fn, s.baseTick, {
      reset: s.reset,
      nextId: s.id
    });
  }, a = (s) => {
    for (const [, r] of n)
      s >= r.tick && o(r);
  };
  return {
    add: t,
    run: a,
    remove: i,
    initialize: () => {
      m.registerTickFn((s) => a(s));
    }
  };
}, y = ee(), L = (e, n, i) => {
  const t = n / 50;
  return y.add(U(e, "Unhandled timer"), t, i);
}, F = (e, n) => L(e, n), te = (e, n) => L(e, n, {
  reset: !0
}), ne = (e) => F(e, 0), b = (e) => y.remove(e), se = () => {
  globalThis.setTimeout = F, globalThis.setInterval = te, globalThis.setImmediate = ne, globalThis.clearTimeout = b, globalThis.clearInterval = b;
}, j = Symbol("lifecycle"), ie = () => {
  const e = /* @__PURE__ */ new Map();
  let n = 0;
  const i = async (t) => {
    const o = e.get(t);
    for (let a = 1; a <= 5; a++) {
      const s = [...o.values()].filter((r) => r.priority === a);
      for (const {
        hook: r,
        name: c
      } of s) {
        c && console.log(`${t === "onEnable" ? "Enabling" : "Disabling"} ${c}`);
        try {
          await (r == null ? void 0 : r());
        } catch (u) {
          console.error(u);
        }
      }
    }
    e.delete(t);
  };
  return Yam.instance.setOnCloseFn(async () => {
    await i("onDisable");
  }), {
    [j]: {
      executeHooks: i
    },
    reload: async () => {
      k("Reloading YamJS"), await i("onDisable"), Yam.reload(), k("Finished reloading YamJS");
    },
    register: (t, o) => {
      const a = n++, s = e.get(t) ?? /* @__PURE__ */ new Map();
      return s.set(a, {
        priority: 3,
        ...o
      }), e.set(t, s), () => delete s[a];
    }
  };
}, f = ie(), M = Java.type("org.bukkit.event.HandlerList");
let E = !1;
const oe = () => {
  E || (m.start(), y.initialize(), se(), Yam.instance.setLoggerFn((e) => p(e)), Yam.getMeta() === "yamjs" ? f.register("onDisable", {
    name: "Event Listeners",
    hook: () => {
      M.unregisterAll(x);
    },
    priority: 5
  }) : f.register("onDisable", {
    name: "Context Event Listeners",
    hook: () => {
      M.unregisterAll(I);
    },
    priority: 5
  }), f[j].executeHooks("onEnable"), E = !0);
};
Yam.getConfig().initialize && oe();
export {
  T as bukkitManager,
  x as bukkitPlugin,
  ae as bukkitServer,
  ce as cacheSourceMap,
  R as catchAndLogUnhandledError,
  X as createEventListener,
  re as getDebugInfo,
  oe as initialize,
  f as lifecycle,
  p as logError,
  le as registerEvent
};
