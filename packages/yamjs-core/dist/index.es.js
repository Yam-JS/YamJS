const x = Java.type("org.bukkit.Bukkit"), p = x.getPluginManager(), y = p.getPlugin(Yam.getConfig().pluginName), C = x.getServer(), g = Java.type("java.lang.Runtime"), l = Java.type("java.lang.System"), z = (e) => Object.keys(e).reduce((t, o) => {
  var s;
  const a = e[o];
  return t[o] = (s = a == null ? void 0 : a.toString) == null ? void 0 : s.call(a), t;
}, {}), N = () => {
  const e = Java.type("java.lang.Long"), n = Java.type("org.bukkit.Bukkit"), t = n.getPluginManager().getPlugin("YamJS").getDataFolder().getParentFile().getParentFile(), o = n.getPluginManager().getPlugins().map((s) => s.getName());
  return {
    yamJS: {
      coreVersion: "0.0.1",
      pluginVersion: "0.0.1",
      legacyVersion: "0.0.1",
      instance: z(Yam.instance)
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
function R(e) {
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
function O(e) {
  const i = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((o) => R(o)));
  return {
    sources: e.sources,
    mappings: i,
    startOffset: 0
  };
}
function V(e) {
  const n = JSON.parse(e);
  return O(n);
}
const E = /* @__PURE__ */ new Map();
function A(e, n, i) {
  const t = V(n);
  return t ? (t.startOffset = i, E.set(e, t), !0) : !1;
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
function B(e, n) {
  const i = E.get(`${e}`);
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
const v = Java.type("org.bukkit.Bukkit"), U = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), M = "      ", _ = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], D = ["webpack/runtime/make"], W = ["catchAndLogUnhandledErrors"], G = (e) => {
  const n = [];
  n.push(e.name);
  for (let i = 0; i < e.stack.length; i++) {
    const t = e.stack[i];
    if (t.javaFrame) {
      if (_.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${M}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const o = B(t.source, t.line);
    if (D.some((s) => o.file.includes(s)) || W.includes(t.methodName) || o.line === 0)
      continue;
    let a = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (a = "<anonymous>"), n.push(`${M}at ${a} (${o.file}:${o.line}) [${t.source}:${t.line}]`);
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
    const r = G(i);
    n && v.getConsoleSender().sendMessage(n), v.getConsoleSender().sendMessage(U.miniMessage().deserialize(`<red>${r}</red>`));
  } catch (s) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", s.name), console.log(s.message, s.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, $ = (e, n) => {
  try {
    return e();
  } catch (i) {
    f(i, n);
  }
}, X = (e, n) => (...i) => {
  try {
    return e(...i);
  } catch (t) {
    f(t, n);
  }
}, q = Java.type("org.bukkit.event.EventPriority"), K = Java.type("org.bukkit.event.Listener"), I = () => new (Java.extend(K, {}))(), J = I(), Q = (e, n, i = "HIGHEST", t = J) => {
  const o = {
    priority: "priority" in n ? n.priority : i,
    script: "script" in n ? n.script : n
  }, a = e.class.toString();
  p.registerEvent(
    // @ts-expect-error [java-ts-bind missing class prototype]
    e.class,
    t,
    q.valueOf(o.priority),
    // @ts-expect-error [EventExecutor]
    (s, r) => {
      r instanceof e && $(() => {
        o.script(r);
      }, `An error occured while attempting to handle the "${a}" event!`);
    },
    y
  );
}, Z = () => {
  const e = {};
  let n = !1, i = 0;
  const t = async () => {
    Yam.reload();
  }, o = async () => {
    var s;
    const a = {
      ...e
    };
    for (const r in a) {
      console.log(`Closing ${e[r].name}`);
      const c = e[r];
      try {
        await ((s = c.fn) == null ? void 0 : s.call(c));
      } catch (u) {
        console.error(u);
      }
      delete e[r];
    }
  };
  return {
    isReloading: () => n,
    reload: async () => {
      if (console.log("Reloading"), n) {
        console.log("Force reloading"), t();
        return;
      }
      n = !0, await o(), t();
    },
    register: (a, s) => {
      const r = i++;
      return e[r] = {
        name: a,
        fn: s
      }, {
        unregister: () => delete e[r]
      };
    },
    initialize: () => {
      Yam.instance.setOnCloseFn(async () => {
        await o();
      });
    }
  };
}, m = Z();
let k;
const ee = (...e) => {
  k === void 0 && (k = Yam.getConfig().verbose), k && console.log(...e);
}, j = Symbol("TickContext"), te = () => {
  const e = d[j];
  if (e.isActive) {
    for (const n of e.tickFns)
      n(e.tick);
    e.tick % 20 === 0 && ee("Tick", e.tick), e.tick += 1;
  }
}, ne = () => {
  const e = {
    tick: 0,
    task: void 0,
    isActive: !1,
    tickFns: []
  }, n = () => {
    e.isActive = !0, Yam.instance.setTickFn(te);
  }, i = async () => {
    e.isActive = !1;
  };
  return {
    [j]: e,
    start: n,
    stop: i,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, d = ne(), se = (e) => e, ie = (e) => e, oe = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), i = (s) => {
    n.delete(s);
  }, t = (s, r, c) => {
    const u = ie((c == null ? void 0 : c.nextId) ?? e.nextId++), Y = se(d.getTick() + Math.max(r, 1));
    return n.set(u, {
      baseTick: r,
      tick: Y,
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
      d.registerTickFn((s) => a(s));
    }
  };
}, h = oe(), F = (e, n, i) => {
  const t = n / 50;
  return h.add(X(e, "Unhandled timer"), t, i);
}, w = (e, n) => F(e, n), ae = (e, n) => F(e, n, {
  reset: !0
}), re = (e) => w(e, 0), b = (e) => h.remove(e), ce = () => {
  globalThis.setTimeout = w, globalThis.setInterval = ae, globalThis.setImmediate = re, globalThis.clearTimeout = b, globalThis.clearInterval = b;
}, S = Java.type("org.bukkit.event.HandlerList");
let T = !1;
const L = () => {
  T || (d.start(), h.initialize(), ce(), m.initialize(), Yam.instance.setLoggerFn((e) => f(e)), Yam.getMeta() === "yamjs" ? m.register("Event Listeners", () => {
    S.unregisterAll(y);
  }) : m.register("Context Event Listeners", () => {
    S.unregisterAll(J);
  }), T = !0);
};
Yam.getConfig().initialize && L();
const le = Symbol("internal"), ue = {
  initialize: L,
  reload: m.reload,
  logError: f,
  catchAndLogUnhandledError: $,
  cacheSourceMap: A,
  getDebugInfo: N,
  registerEvent: Q,
  createEventListener: I,
  manager: p,
  plugin: y,
  server: C,
  /**
   * This is used internally by YamJS to store internal data.
   * This is not recommended for use by plugins.
   *
   * Use at your own risk.
   *
   * @internal
   */
  [le]: {
    reloadHandler: m
  }
};
export {
  ue as default,
  L as initialize,
  le as internal
};
