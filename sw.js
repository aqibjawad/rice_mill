if(!self.define){let e,s={};const c=(c,t)=>(c=new URL(c+".js",t).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(t,a)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let i={};const r=e=>c(e,n),f={module:{uri:n},exports:i,require:r};s[n]=Promise.all(t.map((e=>f[e]||r(e)))).then((e=>(a(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Rectangle 3.png",revision:"1ab2938b0827d68157ee6ae889cd38a7"},{url:"/Vector.png",revision:"0f041c10f66976684a00a8b644417299"},{url:"/_next/app-build-manifest.json",revision:"cba08b3f0acf33b8845b95e86a842221"},{url:"/_next/static/J2tKLcRO2kpGQ0_8KmLqc/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/J2tKLcRO2kpGQ0_8KmLqc/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/124.41d415fff49de479.js",revision:"41d415fff49de479"},{url:"/_next/static/chunks/164f4fb6-3ef67cb3da6585de.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/1838.de9db9911f85992b.js",revision:"de9db9911f85992b"},{url:"/_next/static/chunks/281-9361447beb8a41d6.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/3037-76e8a687ed94cfbd.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/329-20a6fa7b52141252.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/3762-ae8646e210d37561.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/41ade5dc-0d1ba84dc813af6c.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/4239-bba03aecc6577845.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/5939-ab00859b820d9284.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/6065-e5d252c58fca8ea4.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/7023-794310854b84b84e.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/7138-7262b9bcf8f12af3.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/8472-ac695b284eaf4dad.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/8756-e100cf3bb4cf9682.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/8e1d74a4-b2430137fea3a6fb.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/ad2866b8-b2aba5370a0d21e8.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/Buyer/page-1156d13370bdd3c7.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/_not-found/page-cd5ed80b6d0abb30.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addCustomer/page-3331a95e81a27790.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addExpense/page-4d537c3714b311f4.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addPacking/page-98b1b733ef6db352.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addProduct/page-f109c997924f36e1.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addPurchase/page-3f5d7139581881b7.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/addSupplier/page-71831ccbfcb3b1b4.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/amountRecieves/page-798fe3d40a28248e.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/customer/page-c0f8f895ba1a6324.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/dashboard/page-54b109b2535eae29.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/inflow/page-30466e5cfc2b5e05.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/layout-e826de6bfe9bd9e3.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/outflow/page-d4b8da5278c4e375.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/packing/page-8088381a776aa844.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/page-8e9e2156e22c6f09.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/paymentReciept/page-e7fabe0fcfd6dfa6.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/payments/page-5307249f36a9af01.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/product/page-90db55439d863e54.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/purchase/page-5128f9c722fb4f70.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/stock/page-f750795eb813dab6.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/app/supplier/page-2375b873614b69fa.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/bc98253f.9338023680b8fe36.js",revision:"9338023680b8fe36"},{url:"/_next/static/chunks/fd9d1056-2f78632838e37666.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/main-2e5b8b363f2444d7.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/main-app-f4feccc73b2bf4d5.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-923d0c3275bafdb5.js",revision:"J2tKLcRO2kpGQ0_8KmLqc"},{url:"/_next/static/css/2b1d84ba40ef3fb5.css",revision:"2b1d84ba40ef3fb5"},{url:"/_next/static/css/55e68b4a1c7300c2.css",revision:"55e68b4a1c7300c2"},{url:"/_next/static/css/583fcc5cca4e5d9a.css",revision:"583fcc5cca4e5d9a"},{url:"/_next/static/css/6cbef567ae7b7efc.css",revision:"6cbef567ae7b7efc"},{url:"/_next/static/css/8faad4a968d5f9f8.css",revision:"8faad4a968d5f9f8"},{url:"/_next/static/css/e384e716d9ef1bf8.css",revision:"e384e716d9ef1bf8"},{url:"/_next/static/css/fb94e7cd6842cc93.css",revision:"fb94e7cd6842cc93"},{url:"/_next/static/css/fe4ceec840d00c7c.css",revision:"fe4ceec840d00c7c"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/delete.png",revision:"b2026a8a9a4e95747ba7c7c176659d06"},{url:"/edit.jpg",revision:"ee30a6819f7142127fef7c3396588710"},{url:"/editt.png",revision:"34303c7572d2f33c185a4089fbc5338c"},{url:"/epxense.png",revision:"4522352f22ee8e37d752a0025754e582"},{url:"/fonts/Poppins-Medium.ttf",revision:"bf59c687bc6d3a70204d3944082c5cc0"},{url:"/fonts/Poppins-Regular.ttf",revision:"093ee89be9ede30383f39a899c485a82"},{url:"/loginImage.png",revision:"eed944e0ee1e82d3005c8afb48643a01"},{url:"/logo.png",revision:"5cfd5308bf3d54054d2633612a5ccc05"},{url:"/logo512.jpeg",revision:"94681e184e4cc63d0b4be810ff1db7cd"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
