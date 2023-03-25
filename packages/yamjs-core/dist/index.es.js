const x = Java.type("org.bukkit.Bukkit"), S = x.getPluginManager(), p = S.getPlugin(Yam.getConfig().pluginName), ae = x.getServer(), g = Java.type("java.lang.Runtime"), l = Java.type("java.lang.System"), N = (e) => Object.keys(e).reduce((t, a) => {
  var i;
  const o = e[a];
  return t[a] = (i = o == null ? void 0 : o.toString) == null ? void 0 : i.call(o), t;
}, {}), re = () => {
  const e = Java.type("java.lang.Long"), n = Java.type("org.bukkit.Bukkit"), s = p.getDataFolder().getParentFile().getParentFile(), t = n.getPluginManager().getPlugins().map((o) => o.getName());
  return {
    yamJS: {
      coreVersion: "0.0.1",
      pluginVersion: "0.0.1",
      legacyVersion: "0.0.1",
      instance: N(Yam.instance)
    },
    server: {
      players: `${n.getOnlinePlayers().size()} / ${n.getMaxPlayers()}`,
      plugins: t,
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
        free: s == null ? void 0 : s.getFreeSpace(),
        total: s == null ? void 0 : s.getTotalSpace(),
        usable: s == null ? void 0 : s.getUsableSpace()
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
function Y(e) {
  let n = [], s = 0, t = 0;
  for (let a = 0; a < e.length; a += 1) {
    let o = P[e[a]];
    if (o === void 0)
      throw new Error("Invalid character (" + e[a] + ")");
    const i = o & 32;
    if (o &= 31, t += o << s, i)
      s += 5;
    else {
      const r = t & 1;
      t >>>= 1, r ? n.push(t === 0 ? -2147483648 : -t) : n.push(t), t = s = 0;
    }
  }
  return n;
}
function C(e) {
  const s = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((a) => Y(a)));
  return {
    sources: e.sources,
    mappings: s,
    startOffset: 0
  };
}
function z(e) {
  const n = JSON.parse(e);
  return C(n);
}
const $ = /* @__PURE__ */ new Map();
function ce(e, n, s) {
  const t = z(n);
  return t ? (t.startOffset = s, $.set(e, t), !0) : !1;
}
function H({
  mappings: e,
  sources: n
}, s) {
  let t = 0, a = 0, o = 0;
  for (let i = 0; i < e.length; i++)
    if (e[i].forEach((c) => {
      t += c[2] ?? 0, a += c[1] ?? 0;
    }), i + 1 === s)
      return o = t + 1, {
        file: n[a],
        line: o
      };
  throw new Error(`source map failed for line ${s}`);
}
function O(e, n) {
  const s = $.get(`${e}`);
  if (s) {
    if (n -= s.startOffset, n <= 0)
      return {
        file: e,
        line: n
      };
    const t = H(s, n);
    return t.file.startsWith("webpack://test/") && (t.file = t.file.replace("webpack://test/", "")), t.file.startsWith("../") && (t.file = t.file.replace("../", "./")), t;
  } else
    return {
      file: e,
      line: n
    };
}
const v = Java.type("org.bukkit.Bukkit"), V = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), b = "      ", _ = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], A = ["webpack/runtime/make"], B = ["catchAndLogUnhandledErrors"], D = (e) => {
  const n = [];
  n.push(e.name);
  for (let s = 0; s < e.stack.length; s++) {
    const t = e.stack[s];
    if (t.javaFrame) {
      if (_.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${b}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const a = O(t.source, t.line);
    if (A.some((i) => a.file.includes(i)) || B.includes(t.methodName) || a.line === 0)
      continue;
    let o = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (o = "<anonymous>"), n.push(`${b}at ${o} (${a.file}:${a.line}) [${t.source}:${t.line}]`);
  }
  return n.join(`
`);
}, y = (e, n) => {
  var t, a, o;
  let s;
  try {
    const i = ((o = (a = (t = e == null ? void 0 : e.getClass) == null ? void 0 : t.call(e)) == null ? void 0 : a.getName) == null ? void 0 : o.call(a)) ?? void 0;
    i != null && i.includes("yamjs.JsError") ? s = e : s = __interop.catchError(() => {
      throw e;
    });
    const r = D(s);
    n && v.getConsoleSender().sendMessage(n), v.getConsoleSender().sendMessage(V.miniMessage().deserialize(`<red>${r}</red>`));
  } catch (i) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", i.name), console.log(i.message, i.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, R = (e, n) => {
  try {
    return e();
  } catch (s) {
    y(s, n);
  }
}, U = (e, n) => (...s) => {
  try {
    return e(...s);
  } catch (t) {
    y(t, n);
  }
}, W = Java.type("org.bukkit.event.EventPriority"), G = Java.type("org.bukkit.event.Listener"), X = () => new (Java.extend(G, {}))(), I = X(), le = (e, n, s = "HIGHEST", t = I) => {
  const a = {
    priority: "priority" in n ? n.priority : s,
    script: "script" in n ? n.script : n
  }, o = e.class.toString();
  S.registerEvent(
    // @ts-expect-error [java-ts-bind missing class prototype]
    e.class,
    t,
    W.valueOf(a.priority),
    // @ts-expect-error [EventExecutor]
    (i, r) => {
      r instanceof e && R(() => {
        a.script(r);
      }, `An error occured while attempting to handle the "${o}" event!`);
    },
    p
  );
};
let d;
const k = (...e) => {
  d === void 0 && (d = Yam.getConfig().verbose), d && console.log(...e);
}, L = Symbol("TickContext"), q = () => {
  const e = m[L];
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
  }, s = async () => {
    e.isActive = !1;
  };
  return {
    [L]: e,
    start: n,
    stop: s,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, m = K(), Q = (e) => e, Z = (e) => e, ee = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), s = (i) => {
    n.delete(i);
  }, t = (i, r, c) => {
    const u = Z((c == null ? void 0 : c.nextId) ?? e.nextId++), J = Q(m.getTick() + Math.max(r, 1));
    return n.set(u, {
      baseTick: r,
      tick: J,
      fn: i,
      reset: (c == null ? void 0 : c.reset) || !1,
      id: u
    }), u;
  }, a = (i) => {
    n.delete(i.id), i.fn(), i.reset && t(i.fn, i.baseTick, {
      reset: i.reset,
      nextId: i.id
    });
  }, o = (i) => {
    for (const [, r] of n)
      i >= r.tick && a(r);
  };
  return {
    add: t,
    run: o,
    remove: s,
    initialize: () => {
      m.registerTickFn((i) => o(i));
    }
  };
}, h = ee(), F = (e, n, s) => {
  const t = n / 50;
  return h.add(U(e, "Unhandled timer"), t, s);
}, j = (e, n) => F(e, n), te = (e, n) => F(e, n, {
  reset: !0
}), ne = (e) => j(e, 0), M = (e) => h.remove(e), se = () => {
  globalThis.setTimeout = j, globalThis.setInterval = te, globalThis.setImmediate = ne, globalThis.clearTimeout = M, globalThis.clearInterval = M;
}, w = Symbol("lifecycle"), ie = () => {
  const e = /* @__PURE__ */ new Map();
  let n = 0;
  const s = async (t) => {
    const a = e.get(t);
    for (let o = 1; o <= 5; o++) {
      const i = [...a.values()].filter((r) => r.priority === o);
      for (const {
        hook: r,
        name: c
      } of i) {
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
    await s("onDisable");
  }), {
    [w]: {
      executeHooks: s
    },
    reload: async () => {
      k("Reloading YamJS"), await s("onDisable"), Yam.reload(), k("Finished reloading YamJS");
    },
    register: (t, a) => {
      const o = n++, i = e.get(t) ?? /* @__PURE__ */ new Map();
      return i.set(o, {
        priority: 3,
        ...a
      }), e.set(t, i), () => delete i[o];
    }
  };
}, f = ie(), E = Java.type("org.bukkit.event.HandlerList");
let T = !1;
const oe = () => {
  T || (m.start(), h.initialize(), se(), Yam.instance.setLoggerFn((e) => y(e)), Yam.getMeta() === "yamjs" ? f.register("onDisable", {
    name: "Event Listeners",
    hook: () => {
      E.unregisterAll(p);
    },
    priority: 5
  }) : f.register("onDisable", {
    name: "Context Event Listeners",
    hook: () => {
      E.unregisterAll(I);
    },
    priority: 5
  }), f[w].executeHooks("onEnable"), T = !0);
};
Yam.getConfig().initialize && oe();
export {
  S as bukkitManager,
  p as bukkitPlugin,
  ae as bukkitServer,
  ce as cacheSourceMap,
  R as catchAndLogUnhandledError,
  X as createEventListener,
  re as getDebugInfo,
  oe as initialize,
  f as lifecycle,
  y as logError,
  le as registerEvent
};
