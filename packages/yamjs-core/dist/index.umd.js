(function(r,g){typeof exports=="object"&&typeof module<"u"?g(exports):typeof define=="function"&&define.amd?define(["exports"],g):(r=typeof globalThis<"u"?globalThis:r||self,g(r["yamjs-core"]={}))})(this,function(r){"use strict";const g=Java.type("org.bukkit.Bukkit"),y=g.getPluginManager(),h=y.getPlugin(Yam.getConfig().pluginName),z=g.getServer(),m=Java.type("java.lang.Runtime"),u=Java.type("java.lang.System"),H=e=>Object.keys(e).reduce((t,o)=>{var i;const a=e[o];return t[o]=(i=a==null?void 0:a.toString)==null?void 0:i.call(a),t},{}),O=()=>{const e=Java.type("java.lang.Long"),n=Java.type("org.bukkit.Bukkit"),t=n.getPluginManager().getPlugin("YamJS").getDataFolder().getParentFile().getParentFile(),o=n.getPluginManager().getPlugins().map(i=>i.getName());return{yamJS:{coreVersion:"0.0.1",pluginVersion:"0.0.1",legacyVersion:"0.0.1",instance:H(Yam.instance)},server:{players:`${n.getOnlinePlayers().size()} / ${n.getMaxPlayers()}`,plugins:o,minecraftVersion:n.getVersion(),bukkitVersion:n.getBukkitVersion(),onlineMode:n.getOnlineMode()},java:{version:u.getProperty("java.version"),vendor:u.getProperty("java.vendor"),vendorUrl:u.getProperty("java.vendor.url"),home:u.getProperty("java.home"),command:u.getProperty("sun.java.command"),timezone:u.getProperty("user.timezone")},system:{os:{name:u.getProperty("os.name"),version:u.getProperty("os.version"),arch:u.getProperty("os.arch")},cpu:{cores:m.getRuntime().availableProcessors()},memory:{free:m.getRuntime().freeMemory(),max:m.getRuntime().maxMemory()==e.MAX_VALUE?"unlimited":m.getRuntime().maxMemory(),total:m.getRuntime().totalMemory()},storage:{free:t==null?void 0:t.getFreeSpace(),total:t==null?void 0:t.getTotalSpace(),usable:t==null?void 0:t.getUsableSpace()}}}};let E={};"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").forEach(function(e,n){E[e]=n});function A(e){let n=[],s=0,t=0;for(let o=0;o<e.length;o+=1){let a=E[e[o]];if(a===void 0)throw new Error("Invalid character ("+e[o]+")");const i=a&32;if(a&=31,t+=a<<s,i)s+=5;else{const c=t&1;t>>>=1,c?n.push(t===0?-2147483648:-t):n.push(t),t=s=0}}return n}function V(e){const s=e.mappings.split(";").map(t=>t.split(",")).map(t=>t.map(o=>A(o)));return{sources:e.sources,mappings:s,startOffset:0}}function _(e){const n=JSON.parse(e);return V(n)}const T=new Map;function D(e,n,s){const t=_(n);return t?(t.startOffset=s,T.set(e,t),!0):!1}function U({mappings:e,sources:n},s){let t=0,o=0,a=0;for(let i=0;i<e.length;i++)if(e[i].forEach(l=>{t+=l[2]??0,o+=l[1]??0}),i+1===s)return a=t+1,{file:n[o],line:a};throw new Error(`source map failed for line ${s}`)}function B(e,n){const s=T.get(`${e}`);if(s){if(n-=s.startOffset,n<=0)return{file:e,line:n};const t=U(s,n);return t.file.startsWith("webpack://test/")&&(t.file=t.file.replace("webpack://test/","")),t.file.startsWith("../")&&(t.file=t.file.replace("../","./")),t}else return{file:e,line:n}}const S=Java.type("org.bukkit.Bukkit"),R=Java.type("net.kyori.adventure.text.minimessage.MiniMessage"),P="      ",W=["yamjs.Interop.catchError","com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke","jdk.proxy1.$Proxy75.run"],G=["webpack/runtime/make"],X=["catchAndLogUnhandledErrors"],q=e=>{const n=[];n.push(e.name);for(let s=0;s<e.stack.length;s++){const t=e.stack[s];if(t.javaFrame){if(W.includes(`${t.source}.${t.methodName}`))continue;n.push(`${P}at ${t.source}.${t.methodName}(${t.fileName}:${t.line})`);continue}const o=B(t.source,t.line);if(G.some(i=>o.file.includes(i))||X.includes(t.methodName)||o.line===0)continue;let a=t.methodName||"<anonymous>";t.methodName===":=>"&&(a="<anonymous>"),n.push(`${P}at ${a} (${o.file}:${o.line}) [${t.source}:${t.line}]`)}return n.join(`
`)},f=(e,n)=>{var t,o,a;let s;try{const i=((a=(o=(t=e==null?void 0:e.getClass)==null?void 0:t.call(e))==null?void 0:o.getName)==null?void 0:a.call(o))??void 0;i!=null&&i.includes("yamjs.JsError")?s=e:s=__interop.catchError(()=>{throw e});const c=q(s);n&&S.getConsoleSender().sendMessage(n),S.getConsoleSender().sendMessage(R.miniMessage().deserialize(`<red>${c}</red>`))}catch(i){console.log("ERROR: There was an error logging an error. Please report to YamJS. ",i.name),console.log(i.message,i.stack),console.log("Original error: ",e==null?void 0:e.name),console.log(e==null?void 0:e.message,e==null?void 0:e.stack)}},I=(e,n)=>{try{return e()}catch(s){f(s,n)}},K=(e,n)=>(...s)=>{try{return e(...s)}catch(t){f(t,n)}},Q=Java.type("org.bukkit.event.EventPriority"),Z=Java.type("org.bukkit.event.Listener"),L=()=>new(Java.extend(Z,{})),$=L(),ee=(e,n,s="HIGHEST",t=$)=>{const o={priority:"priority"in n?n.priority:s,script:"script"in n?n.script:n},a=e.class.toString();y.registerEvent(e.class,t,Q.valueOf(o.priority),(i,c)=>{c instanceof e&&I(()=>{o.script(c)},`An error occured while attempting to handle the "${a}" event!`)},h)};let v;const b=(...e)=>{v===void 0&&(v=Yam.getConfig().verbose),v&&console.log(...e)},j=Symbol("TickContext"),te=()=>{const e=k[j];if(e.isActive){for(const n of e.tickFns)n(e.tick);e.tick%20===0&&b("Tick",e.tick),e.tick+=1}},k=(()=>{const e={tick:0,task:void 0,isActive:!1,tickFns:[]},n=()=>{e.isActive=!0,Yam.instance.setTickFn(te)},s=async()=>{e.isActive=!1};return{[j]:e,start:n,stop:s,getTick:()=>e.tick,registerTickFn:t=>{e.tickFns.push(t)}}})(),ne=e=>e,ie=e=>e,M=(()=>{const e={nextId:0},n=new Map,s=i=>{n.delete(i)},t=(i,c,l)=>{const d=ie((l==null?void 0:l.nextId)??e.nextId++),ce=ne(k.getTick()+Math.max(c,1));return n.set(d,{baseTick:c,tick:ce,fn:i,reset:(l==null?void 0:l.reset)||!1,id:d}),d},o=i=>{n.delete(i.id),i.fn(),i.reset&&t(i.fn,i.baseTick,{reset:i.reset,nextId:i.id})},a=i=>{for(const[,c]of n)i>=c.tick&&o(c)};return{add:t,run:a,remove:s,initialize:()=>{k.registerTickFn(i=>a(i))}}})(),J=(e,n,s)=>{const t=n/50;return M.add(K(e,"Unhandled timer"),t,s)},x=(e,n)=>J(e,n),se=(e,n)=>J(e,n,{reset:!0}),oe=e=>x(e,0),F=e=>M.remove(e),ae=()=>{globalThis.setTimeout=x,globalThis.setInterval=se,globalThis.setImmediate=oe,globalThis.clearTimeout=F,globalThis.clearInterval=F},w=Symbol("lifecycle"),p=(()=>{const e=new Map;let n=0;const s=async t=>{const o=e.get(t);for(let a=1;a<=5;a++){const i=[...o.values()].filter(c=>c.priority===a);for(const{hook:c,name:l}of i){l&&console.log(`${t==="onEnable"?"Enabling":"Disabling"} ${l}`);try{await(c==null?void 0:c())}catch(d){console.error(d)}}}e.delete(t)};return Yam.instance.setOnCloseFn(async()=>{await s("onDisable")}),{[w]:{executeHooks:s},reload:async()=>{b("Reloading YamJS"),await s("onDisable"),Yam.reload(),b("Finished reloading YamJS")},register:(t,o)=>{const a=n++,i=e.get(t)??new Map;return i.set(a,{priority:3,...o}),e.set(t,i),()=>delete i[a]}}})(),Y=Java.type("org.bukkit.event.HandlerList");let N=!1;const C=()=>{N||(k.start(),M.initialize(),ae(),Yam.instance.setLoggerFn(e=>f(e)),Yam.getMeta()==="yamjs"?p.register("onDisable",{name:"Event Listeners",hook:()=>{Y.unregisterAll(h)},priority:5}):p.register("onDisable",{name:"Context Event Listeners",hook:()=>{Y.unregisterAll($)},priority:5}),p[w].executeHooks("onEnable"),N=!0)};Yam.getConfig().initialize&&C(),r.bukkitManager=y,r.bukkitPlugin=h,r.bukkitServer=z,r.cacheSourceMap=D,r.catchAndLogUnhandledError=I,r.createEventListener=L,r.getDebugInfo=O,r.initialize=C,r.lifecycle=p,r.logError=f,r.registerEvent=ee,Object.defineProperty(r,Symbol.toStringTag,{value:"Module"})});
