"use strict";const r=require("http"),e={hasInitialized:!1,isReloading:!1},t=()=>{if(!e.hasInitialized){e.hasInitialized=!0;return}if(e.isReloading)return;const s={hostname:"localhost",port:8e3,path:"/reload",method:"GET"};try{e.isReloading=!0;const o=r.request(s,n=>{n.on("data",a=>{e.isReloading=!1,console.log("Reload successful")})});o.on("error",n=>(console.log("Failed to connect..."),setTimeout(t,1e3))),setTimeout(()=>{o.end()},1e3);return}catch(o){console.log(o),console.log("Failed to connect..."),setTimeout(t,1e3);return}};exports.reload=t;
//# sourceMappingURL=reload-41695ad2.js.map
