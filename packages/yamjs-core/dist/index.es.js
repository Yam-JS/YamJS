const E = Java.type("org.bukkit.Bukkit"), T = E.getPluginManager(), x = T.getPlugin(Yam.getConfig().pluginName), ae = E.getServer(), g = Java.type("java.lang.Runtime"), l = Java.type("java.lang.System"), j = (e) => Object.keys(e).reduce((t, o) => {
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
      instance: j(Yam.instance)
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
function F(e) {
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
function Y(e) {
  const i = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((o) => F(o)));
  return {
    sources: e.sources,
    mappings: i,
    startOffset: 0
  };
}
function N(e) {
  const n = JSON.parse(e);
  return Y(n);
}
const S = /* @__PURE__ */ new Map();
function ce(e, n, i) {
  const t = N(n);
  return t ? (t.startOffset = i, S.set(e, t), !0) : !1;
}
function C({
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
function z(e, n) {
  const i = S.get(`${e}`);
  if (i) {
    if (n -= i.startOffset, n <= 0)
      return {
        file: e,
        line: n
      };
    const t = C(i, n);
    return t.file.startsWith("webpack://test/") && (t.file = t.file.replace("webpack://test/", "")), t.file.startsWith("../") && (t.file = t.file.replace("../", "./")), t;
  } else
    return {
      file: e,
      line: n
    };
}
const p = Java.type("org.bukkit.Bukkit"), O = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), y = "      ", V = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], _ = ["webpack/runtime/make"], A = ["catchAndLogUnhandledErrors"], H = (e) => {
  const n = [];
  n.push(e.name);
  for (let i = 0; i < e.stack.length; i++) {
    const t = e.stack[i];
    if (t.javaFrame) {
      if (V.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${y}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const o = z(t.source, t.line);
    if (_.some((s) => o.file.includes(s)) || A.includes(t.methodName) || o.line === 0)
      continue;
    let a = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (a = "<anonymous>"), n.push(`${y}at ${a} (${o.file}:${o.line}) [${t.source}:${t.line}]`);
  }
  return n.join(`
`);
}, f = (e, n) => {
  var t, o, a;
  let i;
  try {
    const s = ((a = (o = (t = e == null ? void 0 : e.getClass) == null ? void 0 : t.call(e)) == null ? void 0 : o.getName) == null ? void 0 : a.call(o)) ?? void 0;
    s != null && s.includes("yamjs.JsError") ? i = e : i = __interop.catchError(() => {
      throw e;
    });
    const r = H(i);
    n && p.getConsoleSender().sendMessage(n), p.getConsoleSender().sendMessage(O.miniMessage().deserialize(`<red>${r}</red>`));
  } catch (s) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", s.name), console.log(s.message, s.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, B = (e, n) => {
  try {
    return e();
  } catch (i) {
    f(i, n);
  }
}, U = (e, n) => (...i) => {
  try {
    return e(...i);
  } catch (t) {
    f(t, n);
  }
}, D = Java.type("org.bukkit.event.EventPriority"), R = Java.type("org.bukkit.event.Listener"), W = () => new (Java.extend(R, {}))(), I = W(), le = (e, n, i = "HIGHEST", t = I) => {
  const o = {
    priority: "priority" in n ? n.priority : i,
    script: "script" in n ? n.script : n
  }, a = e.class.toString();
  T.registerEvent(
    // @ts-expect-error [java-ts-bind missing class prototype]
    e.class,
    t,
    D.valueOf(o.priority),
    // @ts-expect-error [EventExecutor]
    (s, r) => {
      r instanceof e && B(() => {
        o.script(r);
      }, `An error occured while attempting to handle the "${a}" event!`);
    },
    x
  );
};
let d;
const G = (...e) => {
  d === void 0 && (d = Yam.getConfig().verbose), d && console.log(...e);
}, $ = Symbol("TickContext"), X = () => {
  const e = m[$];
  if (e.isActive) {
    for (const n of e.tickFns)
      n(e.tick);
    e.tick % 20 === 0 && G("Tick", e.tick), e.tick += 1;
  }
}, q = () => {
  const e = {
    tick: 0,
    task: void 0,
    isActive: !1,
    tickFns: []
  }, n = () => {
    e.isActive = !0, Yam.instance.setTickFn(X);
  }, i = async () => {
    e.isActive = !1;
  };
  return {
    [$]: e,
    start: n,
    stop: i,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, m = q(), K = (e) => e, Q = (e) => e, Z = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), i = (s) => {
    n.delete(s);
  }, t = (s, r, c) => {
    const u = Q((c == null ? void 0 : c.nextId) ?? e.nextId++), J = K(m.getTick() + Math.max(r, 1));
    return n.set(u, {
      baseTick: r,
      tick: J,
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
}, k = Z(), L = (e, n, i) => {
  const t = n / 50;
  return k.add(U(e, "Unhandled timer"), t, i);
}, w = (e, n) => L(e, n), ee = (e, n) => L(e, n, {
  reset: !0
}), te = (e) => w(e, 0), h = (e) => k.remove(e), ne = () => {
  globalThis.setTimeout = w, globalThis.setInterval = ee, globalThis.setImmediate = te, globalThis.clearTimeout = h, globalThis.clearInterval = h;
}, se = Symbol("lifecycle"), ie = () => {
  const e = /* @__PURE__ */ new Map();
  let n = 0;
  const i = async (t) => {
    const o = new Map({
      ...e.get(t)
    });
    for (let a = 1; a <= 5; a++) {
      const s = [...o.values()].filter((r) => r.priority === a);
      for (const {
        hook: r,
        name: c
      } of s) {
        c && console.log(`Executing ${c}`);
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
    [se]: {
      executeHooks: i
    },
    reload: async () => {
      await i("onDisable"), Yam.reload();
    },
    register: (t, o) => {
      const a = n++, s = e.get(t) ?? /* @__PURE__ */ new Map();
      return s.set(a, o), e.set(t, s), () => delete s[a];
    }
  };
}, v = ie(), M = Java.type("org.bukkit.event.HandlerList");
let b = !1;
const oe = () => {
  b || (m.start(), k.initialize(), ne(), Yam.instance.setLoggerFn((e) => f(e)), Yam.getMeta() === "yamjs" ? v.register("onDisable", {
    name: "Event Listeners",
    hook: () => {
      M.unregisterAll(x);
    },
    priority: 5
  }) : v.register("onDisable", {
    name: "Context Event Listeners",
    hook: () => {
      M.unregisterAll(I);
    },
    priority: 5
  }), b = !0);
};
Yam.getConfig().initialize && oe();
export {
  T as bukkitManager,
  x as bukkitPlugin,
  ae as bukkitServer,
  ce as cacheSourceMap,
  B as catchAndLogUnhandledError,
  W as createEventListener,
  re as getDebugInfo,
  oe as initialize,
  v as lifecycle,
  f as logError,
  le as registerEvent
};
