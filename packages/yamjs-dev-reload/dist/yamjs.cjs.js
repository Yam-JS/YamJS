"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const n=require("@yam-js/core"),c=()=>{const a=Java.type("com.sun.net.httpserver.HttpServer"),d=Java.type("java.net.InetSocketAddress");class i{constructor(){this.handle=this.handle.bind(this)}handle(e){if(e.getRequestMethod()==="GET"){const o="Done";e.sendResponseHeaders(200,o.length);const r=e.getResponseBody();r.write(o.split("").map(l=>l.charCodeAt(0))),r.close(),n.lifecycle.reload()}else e.sendResponseHeaders(405,-1)}}const t=a.create(new d(8e3),0);t.createContext("/reload",new i),t.start(),n.lifecycle.register("onDisable",{hook:()=>new Promise(s=>{t.stop(0),setTimeout(()=>{s()},10)}),name:"yamjs-dev-reload"})};exports.initializeDevReload=c;
//# sourceMappingURL=yamjs.cjs.js.map
