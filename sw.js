if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let c={};const o=e=>i(e,a),l={module:{uri:a},exports:c,require:o};s[a]=Promise.all(n.map((e=>l[e]||o(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Rectangle 3.png",revision:"1ab2938b0827d68157ee6ae889cd38a7"},{url:"/Vector.png",revision:"0f041c10f66976684a00a8b644417299"},{url:"/_next/app-build-manifest.json",revision:"35a834e078995276d04924f9bd0d8199"},{url:"/_next/static/RTnlt7eiY8pok6fslQoi0/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/RTnlt7eiY8pok6fslQoi0/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/124.41d415fff49de479.js",revision:"41d415fff49de479"},{url:"/_next/static/chunks/164f4fb6-3ef67cb3da6585de.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/1756-5d0c6e42a3ab8e4d.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/1838.de9db9911f85992b.js",revision:"de9db9911f85992b"},{url:"/_next/static/chunks/2286-0d9b7d8bab1bfc38.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/2287-aaba2bd7d7be3b12.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/281-5676a61c025b6edb.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/3107-c5a0434cbfb89dee.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/330-752c82b052bbd195.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/4199-65ef094dd6567ee1.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/41ade5dc-8ce4c754f3112904.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/4292-cb18af984e903df2.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/6065-e5d252c58fca8ea4.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/6085-10e9a5afd45200a4.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/7023-a9ba723374128d83.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/7138-c657d5e3e8cc0e95.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/7742-96760e508c0a28c0.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/795d4814-1e00ca602082cc48.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/8433-841b734826af804e.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/8472-ac695b284eaf4dad.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/8677-03e867694d1ada1a.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/8e1d74a4-2b05541e1a7f7fcd.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/9133-7902ae79b45b9e95.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/9574-092e5b4bd549fc64.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/9768-50f0fce6bb92bd63.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/ad2866b8-b2aba5370a0d21e8.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/_not-found/page-1c21aba8982bc45a.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/addPurchase/page-100e8281d62a55ed.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/addSale/page-4b0334f0d4dad661.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/addSupLedger/page-45e9702e9162ec29.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/amountRecieves/page-24b093dbc0352634.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/bankCheque/page-80513acbed55884c.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/bankDetails/page-3e088bb380a6a1c1.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/buyer/page-9be54fb9c9e9f0e8.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/buyer_ledger/page-24fbc688ab501337.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/customer/page-ae024b192dc7bf6a.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/dashboard/page-a7381378cd5e6c59.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/expenseDetails/page-76836b08254a10e6.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/expenses/page-8aa1d94bb7885554.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/inflow/page-22e59b3408a5928c.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/layout-88420766c7d4aea5.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/outflow/page-b2260fbfda11b3fb.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/packing/page-470ad8f8eba79a5f.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/page-8ac5470e17f29858.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/paymentReciept/page-ecb18ad4dc76378d.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/paymentRecieves/page-50a4126b65803cb5.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/payments/page-181c8bd4e2996591.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/product/page-f49d7430a25d314d.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/purchase/page-5b3d1d73026ffa0b.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/sale/page-0ddb9e7455481373.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/stock/page-70aa8568703755c9.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/supplier/page-e502b35c5a7a3118.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/app/supplier_ledger/page-3114e5da585f3f86.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/bc98253f.9338023680b8fe36.js",revision:"9338023680b8fe36"},{url:"/_next/static/chunks/fd9d1056-f23e1e99e6ce2586.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/main-4b06027671d861f6.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/main-app-f4feccc73b2bf4d5.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-9b4054001f9b81a7.js",revision:"RTnlt7eiY8pok6fslQoi0"},{url:"/_next/static/css/2d6ae65a08c87313.css",revision:"2d6ae65a08c87313"},{url:"/_next/static/css/31788abee32f64cc.css",revision:"31788abee32f64cc"},{url:"/_next/static/css/5d3ca3aa01cd06d1.css",revision:"5d3ca3aa01cd06d1"},{url:"/_next/static/css/60caf1582d3acc3c.css",revision:"60caf1582d3acc3c"},{url:"/_next/static/css/75663abcb853e886.css",revision:"75663abcb853e886"},{url:"/_next/static/css/8faad4a968d5f9f8.css",revision:"8faad4a968d5f9f8"},{url:"/_next/static/css/cb75e4b334ae732a.css",revision:"cb75e4b334ae732a"},{url:"/_next/static/css/e1f5aa80926b2511.css",revision:"e1f5aa80926b2511"},{url:"/_next/static/css/f1dbcecc467f5990.css",revision:"f1dbcecc467f5990"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/amount.png",revision:"5009276c123ef580b950a8f670e5f1e5"},{url:"/delete.png",revision:"b2026a8a9a4e95747ba7c7c176659d06"},{url:"/edit.jpg",revision:"ee30a6819f7142127fef7c3396588710"},{url:"/editt.png",revision:"34303c7572d2f33c185a4089fbc5338c"},{url:"/epxense.png",revision:"4522352f22ee8e37d752a0025754e582"},{url:"/fonts/Poppins-Medium.ttf",revision:"bf59c687bc6d3a70204d3944082c5cc0"},{url:"/fonts/Poppins-Regular.ttf",revision:"093ee89be9ede30383f39a899c485a82"},{url:"/loginImage.png",revision:"eed944e0ee1e82d3005c8afb48643a01"},{url:"/logo.png",revision:"5cfd5308bf3d54054d2633612a5ccc05"},{url:"/logo512.jpeg",revision:"94681e184e4cc63d0b4be810ff1db7cd"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opening.png",revision:"b4c3820b541d114e4591af8430686753"},{url:"/total.png",revision:"72c8dc05fa198ba28553cebd670ce21d"},{url:"/userPic.png",revision:"9ef7c5da18f016bdbbd25bf7716b20aa"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
