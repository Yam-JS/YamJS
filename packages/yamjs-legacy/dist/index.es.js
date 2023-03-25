import { bukkitManager as U, bukkitPlugin as R, bukkitServer as z, catchAndLogUnhandledError as C } from "@yam-js/core";
const l = globalThis.Yam, D = l;
if ("Yam" in globalThis)
  Object.assign(globalThis, {
    Core: l
  });
else if ("Core" in globalThis)
  Object.assign(globalThis, {
    Yam: D
  });
else
  throw "Polyglot" in globalThis ? "YamJS was not detected (or is very outdated) in your environment!" : "Java" in globalThis ? "GraalJS was not detected in your environment!" : "Java was not detected in your environment!";
const f = {
  data: /* @__PURE__ */ new Map(),
  load: /* @__PURE__ */ new Map(),
  poly: {
    index: 0,
    list: /* @__PURE__ */ new Map()
  },
  task: {
    list: /* @__PURE__ */ new Set(),
    tick: 0
  }
}, N = Java.type("java.nio.file.Files"), A = Java.type("java.lang.String"), M = Java.type("java.nio.file.Paths"), W = Java.type("java.util.regex.Pattern"), Y = Java.type("java.util.Scanner"), _ = Java.type("java.net.URL"), q = Java.type("java.util.UUID"), b = {
  /** Provides the result to a desync request within an auxilliary file. If this method is called while not within a desync-compatible context, it will fail. */
  async provide(e) {
    try {
      const {
        data: n,
        uuid: t
      } = JSON.parse(h.meta);
      try {
        h.emit(t, JSON.stringify({
          data: await e(n),
          status: !0
        }));
      } catch (r) {
        h.emit(t, JSON.stringify({
          data: r,
          status: !1
        }));
      }
    } catch {
      throw "The current context's metadata is incompatible with the desync system!";
    }
  },
  /** Sends a desync request to another file. If said file has a valid desync provider, that provider will be triggered and a response will be sent back when ready. */
  async request(e, n = {}) {
    if (p(e).exists) {
      const r = q.randomUUID().toString(), a = h.on(r);
      h.create("file", p(e).io.getAbsolutePath(), JSON.stringify({
        data: n,
        uuid: r
      })).open();
      const s = JSON.parse(await a);
      if (s.status)
        return s.data;
      throw s.data;
    } else
      throw "That file does not exist!";
  },
  /** Runs a task off the main server thread. */
  shift(e) {
    switch (c.name) {
      case "bukkit":
        return new Promise((n, t) => {
          c.content.server.getScheduler().runTaskAsynchronously(
            c.content.plugin,
            // @ts-expect-error
            new c.content.Runnable(async () => {
              try {
                n(await e());
              } catch (r) {
                t(r);
              }
            })
          );
        });
      case "minestom":
        return new Promise(async (n, t) => {
          try {
            n(await e());
          } catch (r) {
            t(r);
          }
        });
    }
  }
};
function k(e, n) {
  const t = (r) => {
    try {
      return n(r, t);
    } catch (a) {
      throw a;
    }
  };
  return t(e);
}
function F(e) {
  switch (c.name) {
    case "bukkit": {
      c.content.plugin.register(e.namespace || c.content.plugin.getName(), e.name, e.aliases || [], e.permission || "", e.message || "", (n, t, r) => {
        C(() => {
          !e.permission || n.hasPermission(e.permission) ? e.execute && e.execute(n, ...r) : n.sendMessage(e.message || "");
        }, `An error occured while attempting to execute the "${t}" command!`);
      }, (n, t, r) => C(() => e.tabComplete && e.tabComplete(n, ...r) || [], `An error occured while attempting to tab-complete the "${t}" command!`) ?? []);
      break;
    }
    case "minestom": {
      const n = new c.content.Command(e.name);
      n.addSyntax((t, r) => {
        try {
          e.execute && e.execute(t, ...r.getInput().split(" ").slice(1));
        } catch (a) {
          console.error(`An error occured while attempting to execute the "${e.name}" command!`), console.error(a.stack || a.message || a);
        }
      }, c.content.ArgumentType.StringArray("tab-complete").setSuggestionCallback((t, r, a) => {
        for (const s of e.tabComplete(t, ...r.getInput().split(" ").slice(1)) || [])
          a.addEntry(new c.content.SuggestionEntry(s));
      })), c.content.registry.register(n);
    }
  }
}
const J = {
  /** Cancels a previously scheduled task. */
  cancel(e) {
    f.task.list.delete(e);
  },
  /** Schedules a task to run infinitely at a set interval. */
  interval(e, n = 0, ...t) {
    const r = J.timeout((...a) => {
      try {
        r.tick += Math.ceil(n < 1 ? 1 : n), e(...a);
      } catch (s) {
        console.error("future task interval error", s);
      }
    }, 0, ...t);
    return r;
  },
  /** Schedules a task to run after a set timeout. */
  timeout(e, n = 0, ...t) {
    const r = {
      tick: f.task.tick + Math.ceil(n < 0 ? 0 : n),
      args: t,
      script: (...a) => {
        try {
          e(...a);
        } catch (s) {
          console.error("future task timeout error", s);
        }
      }
    };
    return f.task.list.add(r), r;
  }
}, h = {
  /** Creates a new context and returns its instance. If `type` is file, `content` refers to a JS file path relative to the JS root folder. If `type` is script, `content` refers to a piece of JS code. */
  create(e, n, t) {
    return l[`${e}Instance`](n, t);
  },
  /** Destroys the currently running context. */
  destroy() {
    l.destroy();
  },
  emit(e, n) {
    l.emit(e, n);
  },
  meta: l.getMeta(),
  off(e, n) {
    return l.off(e, n);
  },
  on: (e, n) => n ? l.on(e, n) : new Promise((t) => {
    const r = (a) => {
      h.off(e, r), t(a);
    };
    h.on(e, r);
  }),
  swap() {
    T(l.swap);
  }
};
function L(e, ...n) {
  const t = M.get(e, ...n).normalize().toString();
  if (f.data.has(t))
    return f.data.get(t);
  {
    const r = p($, "data", `${t}.json`).json() || {};
    return f.data.set(t, r), r;
  }
}
const c = (() => {
  try {
    return {
      content: {
        manager: U,
        plugin: R,
        Runnable: Java.type("java.lang.Runnable"),
        server: z
      },
      name: "bukkit"
    };
  } catch {
    try {
      const n = Java.type("net.minestom.server.MinecraftServer"), t = n.getExtensionManager(), r = t.getExtension("Yam");
      return {
        content: {
          ArgumentType: Java.type("net.minestom.server.command.builder.arguments.ArgumentType"),
          Command: Java.type("net.minestom.server.command.builder.Command"),
          extension: r,
          manager: t,
          node: r.getEventNode(),
          registry: n.getCommandManager(),
          server: n,
          SuggestionEntry: Java.type("net.minestom.server.command.builder.suggestion.SuggestionEntry")
        },
        name: "minestom"
      };
    } catch {
      return {
        name: "unknown",
        content: {}
      };
    }
  }
})();
function j(e) {
  const n = {
    json(t) {
      if (t)
        return n.read(!0).then((r) => JSON.parse(r));
      try {
        return JSON.parse(n.read());
      } catch (r) {
        throw r;
      }
    },
    // @ts-expect-error
    read(t) {
      return t ? b.request(x, {
        link: e,
        operation: "fetch.read"
      }) : new Y(n.stream()).useDelimiter("\\A").next();
    },
    stream() {
      return new _(e).openStream();
    }
  };
  return n;
}
function p(e, ...n) {
  e = typeof e == "string" ? e : "io" in e ? e.path : e.getPath();
  const t = M.get(e, ...n).normalize().toFile(), r = {
    get children() {
      return r.type === "folder" ? [...t.listFiles()].map((a) => p(a.getPath())) : null;
    },
    directory() {
      return r.type === "none" && k(t, (a, s) => {
        const i = a.getParentFile();
        i && (i.exists() || s(i)), a.mkdir();
      }), r;
    },
    entry() {
      return r.type === "none" && r.parent.directory() && t.createNewFile(), r;
    },
    get exists() {
      return t.exists();
    },
    file(...a) {
      return p(t, ...a);
    },
    flush() {
      return k(t, (a, s) => {
        const i = a.getParentFile();
        i && i.isDirectory() && (i.listFiles()[0] || i.delete() && s(i));
      }), r;
    },
    io: t,
    json(a) {
      if (a)
        return r.read(!0).then((s) => JSON.parse(s));
      try {
        return JSON.parse(r.read());
      } catch {
        return null;
      }
    },
    get name() {
      return t.getName();
    },
    get parent() {
      return r.file("..");
    },
    get path() {
      return y.replace(t.getPath(), "(\\\\)", "/");
    },
    read(a) {
      return a ? b.request(x, {
        operation: "file.read",
        path: r.path
      }) : r.type === "file" ? new A(N.readAllBytes(t.toPath())).toString() : null;
    },
    remove() {
      return k(t, (a, s) => {
        a.isDirectory() && [...a.listFiles()].forEach(s), a.exists() && a.delete();
      }), r.flush();
    },
    get type() {
      return t.isDirectory() ? "folder" : t.exists() ? "file" : "none";
    },
    //@ts-expect-error
    write(a, s) {
      return s ? b.request(x, {
        content: a,
        operation: "file.write",
        path: r.path
      }).then(() => r) : (r.type === "file" && N.write(t.toPath(), new A(a).getBytes()), r);
    }
  };
  return r;
}
function H(e, n) {
  if (f.load.has(n))
    return f.load.get(n);
  {
    const t = p(e);
    if (t.exists) {
      const r = l.load(t.io, n);
      return f.load.set(n, r), r;
    } else
      throw new ReferenceError(`The file "${t.path}" does not exist!`);
  }
}
function T(e) {
  l.push(e);
}
const y = {
  test(e, n) {
    return e.matches(n);
  },
  replace(e, n, t) {
    return W.compile(n).matcher(e).replaceAll(t);
  }
};
function B() {
  T(l.reload || l.swap);
}
const $ = p(l.getRoot());
function P(e, n, t) {
  if (e && typeof e == "object") {
    if (t || (t = /* @__PURE__ */ new Set()), t.has(e))
      return n;
    {
      t.add(e);
      const r = typeof e[Symbol.iterator] == "function" ? [] : {};
      for (const a in e)
        r[a] = P(e[a], n, new Set(t));
      return r;
    }
  } else
    return e;
}
function Z(e) {
  return new Promise((n, t) => {
    l.sync(() => e().then(n).catch(t));
  });
}
l.hook(() => {
  for (const [e] of f.data)
    p($, "data", `${e}.json`).entry().write(JSON.stringify(P(f.data.get(e))));
});
const x = `${__dirname}/async.js`, E = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", G = Promise.resolve();
Object.assign(globalThis, {
  atob(e) {
    var n = y.replace(String(e), "[=]+$", "");
    if (n.length % 4 === 1)
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    for (var t = 0, r, a, s = 0, i = ""; a = n.charAt(s++); ~a && (r = t % 4 ? r * 64 + a : a, t++ % 4) ? i += String.fromCharCode(255 & r >> (-2 * t & 6)) : 0)
      a = E.indexOf(a);
    return i;
  },
  btoa(e) {
    for (var n = String(e), t, r, a = 0, s = E, i = ""; n.charAt(a | 0) || (s = "=", a % 1); i += s.charAt(63 & t >> 8 - a % 1 * 8)) {
      if (r = n.charCodeAt(a += 3 / 4), r > 255)
        throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      t = t << 8 | r;
    }
    return i;
  },
  queueMicrotask(e) {
    G.then(e).catch((n) => {
      J.timeout(() => {
        throw n;
      });
    });
  }
});
const K = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  chain: k,
  command: F,
  context: h,
  data: L,
  desync: b,
  env: c,
  fetch: j,
  file: p,
  load: H,
  push: T,
  regex: y,
  reload: B,
  root: $,
  session: f,
  simplify: P,
  sync: Z,
  task: J
}, Symbol.toStringTag, { value: "Module" })), O = Java.type("java.lang.Class"), Q = Java.type("java.lang.Iterable"), V = Java.type("java.util.Iterator"), X = Java.type("java.util.Spliterator");
function ee(e) {
  if (e instanceof Array)
    return [...e];
  if (e instanceof Q) {
    const n = [];
    return e.forEach((t) => {
      n.push(t);
    }), n;
  } else if (e instanceof V || e instanceof X) {
    const n = [];
    return e.forEachRemaining((t) => {
      n.push(t);
    }), n;
  } else
    return null;
}
const S = Symbol(), d = {
  /** Reformats complex error messages into layman-friendly ones. */
  error(e) {
    let n = "Error", t = `${e}`;
    if (e.stack)
      switch (n = e.stack.split(`
`)[0].split(" ")[0].slice(0, -1), t = e.message, n) {
        case "TypeError":
          try {
            if (t.startsWith("invokeMember") || t.startsWith("execute on foreign object")) {
              const r = t.split("failed due to: ")[1];
              r.startsWith("no applicable overload found") ? t = ["Invalid arguments! Expected:", ...r.split("overloads:")[1].split("]],")[0].split(")]").map((s) => `(${s.split("(").slice(1).join("(")})`)].join(`
 -> `).slice(0, -1) : r.startsWith("Arity error") ? t = `Invalid argument amount! Expected: ${r.split("-")[1].split(" ")[2]}` : r.startsWith("UnsupportedTypeException") ? t = "Invalid arguments!" : r.startsWith("Unknown identifier") ? t = `That method (${r.split(": ")[1]}) does not exist!` : r.startsWith("Message not supported") ? t = `That method (${t.slice(14).split(")")[0]}) does not exist!` : t = t.split(`
`)[0];
            }
          } catch {
            t = t.split(`
`)[0];
          }
          break;
        case "SyntaxError":
          t = t.split(" ").slice(1).join(" ").split(`
`)[0];
      }
    else
      e = `${e}`, n = e.split(" ")[0].slice(0, -1), t = e.split(" ").slice(1).join(" ");
    return `${n}: ${t}`;
  },
  /** A pretty-printer for JavaScript objects. */
  output(e, n) {
    if (n === !0) {
      if (e === S)
        return "...";
      {
        const t = toString.call(e);
        switch (t) {
          case "[object Array]":
          case "[object Object]":
          case "[object Function]":
            return t.split(" ")[1].slice(0, -1);
          case "[foreign HostObject]":
            if (e instanceof O && typeof e.getCanonicalName == "function")
              return e.getCanonicalName();
            if (typeof e.toString == "function") {
              const a = e.toString();
              if (a)
                return a;
            }
            const r = typeof e.getClass == "function" ? e.getClass() : e.class;
            return r instanceof O && typeof r.getCanonicalName == "function" ? r.getCanonicalName() : `${e}` || `${r}` || "Object";
          case "[foreign HostFunction]":
            return "Function";
          default:
            switch (typeof e) {
              case "bigint":
                return e.toString() + "n";
              case "function":
                return "Function";
              case "object":
                return e ? "Object" : "null";
              case "symbol":
                return `<${e.toString().slice(7, -1)}>`;
              case "undefined":
                return "undefined";
              default:
                return JSON.stringify(e);
            }
        }
      }
    } else
      switch (toString.call(e)) {
        case "[object Array]":
          return `[ ${[...e].map((r) => d.output(e === r ? S : r, !0)).join(", ")} ]`;
        case "[object Object]":
          return `{ ${[...Object.getOwnPropertyNames(e).map((r) => `${r}: ${d.output(e === e[r] ? S : e[r], !0)}`), ...Object.getOwnPropertySymbols(e).map((r) => `${d.output(r, !0)}: ${d.output(e === e[r] ? S : e[r], !0)}`)].join(", ")} }`;
        case "[object Function]":
          return e instanceof O && typeof e.getCanonicalName == "function" ? e.getCanonicalName() : typeof e.toString == "function" ? y.replace(e.toString(), "\\r", "") : `${e}` || "function () { [native code] }";
        case "[foreign HostFunction]":
          return "hostFunction () { [native code] }";
        default:
          const t = ee(e);
          return t ? d.output(t) : d.output(e, !0);
      }
  }
};
F({
  name: "js",
  permission: "grakkit.command.js",
  message: "§cYou do not have the required permission to run this command!",
  execute(e, ...n) {
    const t = globalThis.hasOwnProperty("self");
    t || (globalThis.self = e);
    let r;
    try {
      const a = Polyglot.eval("js", n.join(" "));
      t || delete globalThis.self, r = d.output(a);
    } catch (a) {
      t || delete globalThis.self, r = d.error(a);
    }
    switch (c.name) {
      case "bukkit":
        e.sendMessage(r);
        break;
      case "minestom":
        e.sendMessage(r);
        break;
    }
  },
  tabComplete(e, ...n) {
    let t = "", r = -1, a = globalThis, s = !0, i = !1, u = !1, v = !1, m = "";
    const g = n.join(" ");
    for (; s && ++r < g.length; ) {
      const o = g[r];
      if (v)
        o === "*" && g[r + 1] === "/" && (m ? g[r + 2] === ";" && (v = !1) : (t = g.slice(0, r + 2), v = !1));
      else if (i)
        o === "\\" ? ++r : o === i && (a = {}, i = !1);
      else if (u === !0)
        ["'", '"', "`"].includes(o) ? u = o : s = !1;
      else if (typeof u == "string")
        switch (o) {
          case "\\":
            ++r;
            break;
          case u:
            u = -1;
            break;
          default:
            m += o;
        }
      else
        switch (o) {
          case "/":
            switch (g[r + 1]) {
              case "/":
                s = !1;
                break;
              case "*":
                v = !0;
                break;
            }
            break;
          case "'":
          case '"':
          case "`":
            u === -1 ? s = !1 : i = o;
            break;
          case ")":
          case "{":
          case "}":
            u || (a = {});
            break;
          case ".":
          case "[":
            u || (o === "." || m ? (t = g.slice(0, r + 1), a === globalThis && m === "self" && !a.hasOwnProperty("self") ? a = e : a = a[m] || {}, o === "." || (u = !0), m = "") : (t = g.slice(0, r + 1), a = globalThis));
            break;
          case "]":
            u === -1 && (u = !1);
            break;
          case "\\":
            typeof u == "string" ? ++r : s = !1;
            break;
          case " ":
            m ? s = !1 : t = "";
            break;
          default:
            y.test(o, "[\\+\\-\\*\\/\\^=!&\\|\\?:\\(,;]") ? u || (t = g.slice(0, r + 1), a = globalThis, m = "") : m += o;
        }
    }
    if (s && a && !(v || i)) {
      const o = [...Object.getOwnPropertyNames(a.constructor ? a.constructor.prototype || {} : {}), ...Object.getOwnPropertyNames(a)];
      return a === globalThis && !o.includes("self") && o.push("self"), o.sort().filter((w) => w.toLowerCase().includes(m.toLowerCase())).filter((w) => u || y.test(w, "[_A-Za-z$][_0-9A-Za-z$]*")).map((w) => u ? `${t}\`${y.replace(w, "`", "\\`").split("\\").join("\\\\")}\`]` : `${t}${w}`);
    } else
      return [];
  }
});
const I = {
  manager: c.content.manager,
  plugin: c.content.plugin,
  server: c.content.server
}, te = Object.assign({}, K, I);
Object.assign(globalThis, I, {
  core: te
});
export {
  k as chain,
  F as command,
  h as context,
  L as data,
  te as default,
  b as desync,
  c as env,
  j as fetch,
  p as file,
  H as load,
  T as push,
  y as regex,
  B as reload,
  $ as root,
  f as session,
  P as simplify,
  te as stdlib,
  Z as sync,
  J as task
};
