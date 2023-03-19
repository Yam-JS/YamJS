let T = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").forEach(function(e, n) {
  T[e] = n;
});
function E(e) {
  let n = [], i = 0, t = 0;
  for (let o = 0; o < e.length; o += 1) {
    let c = T[e[o]];
    if (c === void 0)
      throw new Error("Invalid character (" + e[o] + ")");
    const s = c & 32;
    if (c &= 31, t += c << i, s)
      i += 5;
    else {
      const a = t & 1;
      t >>>= 1, a ? n.push(t === 0 ? -2147483648 : -t) : n.push(t), t = i = 0;
    }
  }
  return n;
}
function S(e) {
  const i = e.mappings.split(";").map((t) => t.split(",")).map((t) => t.map((o) => E(o)));
  return {
    sources: e.sources,
    mappings: i,
    startOffset: 0
  };
}
function w(e) {
  const n = JSON.parse(e);
  return S(n);
}
const v = /* @__PURE__ */ new Map();
function C(e, n, i) {
  const t = w(n);
  return t ? (t.startOffset = i, v.set(e, t), !0) : !1;
}
function F({
  mappings: e,
  sources: n
}, i) {
  let t = 0, o = 0, c = 0;
  for (let s = 0; s < e.length; s++)
    if (e[s].forEach((l) => {
      t += l[2] ?? 0, o += l[1] ?? 0;
    }), s + 1 === i)
      return c = t + 1, {
        file: n[o],
        line: c
      };
  throw new Error(`source map failed for line ${i}`);
}
function z(e, n) {
  const i = v.get(`${e}`);
  if (i) {
    if (n -= i.startOffset, n <= 0)
      return {
        file: e,
        line: n
      };
    const t = F(i, n);
    return t.file.startsWith("webpack://test/") && (t.file = t.file.replace("webpack://test/", "")), t.file.startsWith("../") && (t.file = t.file.replace("../", "./")), t;
  } else
    return {
      file: e,
      line: n
    };
}
const h = Java.type("org.bukkit.Bukkit"), N = Java.type("net.kyori.adventure.text.minimessage.MiniMessage"), k = "      ", R = ["yamjs.Interop.catchError", "com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke", "jdk.proxy1.$Proxy75.run"], Y = ["webpack/runtime/make"], j = ["catchAndLogUnhandledErrors"], A = (e) => {
  const n = [];
  n.push(e.name);
  for (let i = 0; i < e.stack.length; i++) {
    const t = e.stack[i];
    if (t.javaFrame) {
      if (R.includes(`${t.source}.${t.methodName}`))
        continue;
      n.push(`${k}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);
      continue;
    }
    const o = z(t.source, t.line);
    if (Y.some((s) => o.file.includes(s)) || j.includes(t.methodName) || o.line === 0)
      continue;
    let c = t.methodName || "<anonymous>";
    t.methodName === ":=>" && (c = "<anonymous>"), n.push(`${k}at ${c} (${o.file}:${o.line}) [${t.source}:${t.line}]`);
  }
  return n.join(`
`);
}, d = (e, n) => {
  var t, o, c;
  let i;
  try {
    const s = ((c = (o = (t = e == null ? void 0 : e.getClass) == null ? void 0 : t.call(e)) == null ? void 0 : o.getName) == null ? void 0 : c.call(o)) ?? void 0;
    s != null && s.includes("yamjs.JsError") ? i = e : i = __interop.catchError(() => {
      throw e;
    });
    const a = A(i);
    n && h.getConsoleSender().sendMessage(n), h.getConsoleSender().sendMessage(N.miniMessage().deserialize(`<red>${a}</red>`));
  } catch (s) {
    console.log("ERROR: There was an error logging an error. Please report to YamJS. ", s.name), console.log(s.message, s.stack), console.log("Original error: ", e == null ? void 0 : e.name), console.log(e == null ? void 0 : e.message, e == null ? void 0 : e.stack);
  }
}, J = (e, n) => {
  try {
    return e();
  } catch (i) {
    d(i, n);
  }
}, L = (e, n) => (...i) => {
  try {
    return e(...i);
  } catch (t) {
    d(t, n);
  }
}, O = () => {
  const e = {};
  let n = !1, i = 0;
  const t = async () => {
    Yam.reload();
  }, o = async () => {
    var s;
    const c = {
      ...e
    };
    for (const a in c) {
      console.log(`Closing ${e[a].name}`);
      const l = e[a];
      try {
        await ((s = l.fn) == null ? void 0 : s.call(l));
      } catch (r) {
        console.error(r);
      }
      delete e[a];
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
    register: (c, s) => {
      const a = i++;
      return e[a] = {
        name: c,
        fn: s
      }, {
        unregister: () => delete e[a]
      };
    },
    initialize: () => {
      Yam.instance.setOnCloseFn(async () => {
        await o();
      });
    }
  };
}, y = O();
let f;
const _ = (...e) => {
  f === void 0 && (f = Yam.getConfig().verbose), f && console.log(...e);
}, x = Symbol("TickContext"), H = () => {
  const e = u[x];
  if (e.isActive) {
    for (const n of e.tickFns)
      n(e.tick);
    e.tick % 20 === 0 && _("Tick", e.tick), e.tick += 1;
  }
}, P = () => {
  const e = {
    tick: 0,
    task: void 0,
    isActive: !1,
    tickFns: []
  }, n = () => {
    e.isActive = !0, Yam.instance.setTickFn(H);
  }, i = async () => {
    e.isActive = !1;
  };
  return {
    [x]: e,
    start: n,
    stop: i,
    getTick: () => e.tick,
    registerTickFn: (t) => {
      e.tickFns.push(t);
    }
  };
}, u = P(), U = (e) => e, B = (e) => e, V = () => {
  const e = {
    nextId: 0
  }, n = /* @__PURE__ */ new Map(), i = (s) => {
    n.delete(s);
  }, t = (s, a, l) => {
    const r = B((l == null ? void 0 : l.nextId) ?? e.nextId++), $ = U(u.getTick() + Math.max(a, 1));
    return n.set(r, {
      baseTick: a,
      tick: $,
      fn: s,
      reset: (l == null ? void 0 : l.reset) || !1,
      id: r
    }), r;
  }, o = (s) => {
    n.delete(s.id), s.fn(), s.reset && t(s.fn, s.baseTick, {
      reset: s.reset,
      nextId: s.id
    });
  }, c = (s) => {
    for (const [, a] of n)
      s >= a.tick && o(a);
  };
  return {
    add: t,
    run: c,
    remove: i,
    initialize: () => {
      u.registerTickFn((s) => c(s));
    }
  };
}, m = V(), M = (e, n, i) => {
  const t = n / 50;
  return m.add(L(e, "Unhandled timer"), t, i);
}, b = (e, n) => M(e, n), W = (e, n) => M(e, n, {
  reset: !0
}), q = (e) => b(e, 0), p = (e) => m.remove(e), D = () => {
  globalThis.setTimeout = b, globalThis.setInterval = W, globalThis.setImmediate = q, globalThis.clearTimeout = p, globalThis.clearInterval = p;
};
let g = !1;
const I = () => {
  console.log("Initializing YamJS...", g), !g && (u.start(), m.initialize(), D(), y.initialize(), Yam.instance.setLoggerFn((e) => d(e)), g = !0);
};
Yam.getConfig().initialize && I();
const G = {
  initialize: I,
  reload: y.reload,
  logError: d,
  catchAndLogUnhandledError: J,
  cacheSourceMap: C
};
export {
  G as default,
  I as initialize
};
