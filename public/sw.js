if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>i(e,c),b={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>b[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-c2c0676f"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Rectangle 3.png",revision:"1ab2938b0827d68157ee6ae889cd38a7"},{url:"/Vector.png",revision:"0f041c10f66976684a00a8b644417299"},{url:"/_next/static/chunks/124.719c25bb6921d60b.js",revision:"719c25bb6921d60b"},{url:"/_next/static/chunks/13b76428-5a68792917164904.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/164f4fb6-14155c77c574bb95.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/17-24c45c0ecafc3e23.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/1838.de9db9911f85992b.js",revision:"de9db9911f85992b"},{url:"/_next/static/chunks/2286-cce2a5519de7a545.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/2403-0447c43e54667132.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/281-15daa500b931095c.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/3058-6adce5b2b107d2b5.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/3107-f196dc83431534a7.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/4199-7866a3895075d673.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/41ade5dc-8ce4c754f3112904.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/4253-1e6fba8aaa684b61.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/4579-8cffb7469159aeb1.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/5793-5a846f69941b60b6.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/5979-e6bf99c4d406b611.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/6211-f202f0334a6a71c1.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/7138-b95d913a2190a989.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/761-151e3e0d246d7144.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/7631-902b1b486c3e279e.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/795d4814-1e00ca602082cc48.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/8142-c96b35e5ebac15c0.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/8433-73a0fb816866b921.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/8472-ac695b284eaf4dad.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/8677-c4b09998d39dc743.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/8e1d74a4-466afff7d49db9d1.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9120-d5a2c50d36171b7a.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9133-b9af82cd8fe6af9c.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9321-2f13a06a843b98e0.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9325-43f4aff4b41b1559.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/942-d77a2a3708e1920b.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9574-70e5eff68ad058ca.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/9758-89db95f56c5f915d.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/ad2866b8.0a10d661ca31722a.js",revision:"0a10d661ca31722a"},{url:"/_next/static/chunks/app/Buyer/page-1058d7adc19ec0aa.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/_not-found/page-6729d09e78a580d6.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/addPurchase/page-85e7fc1397efe567.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/addSale/page-343b1a1ba8f94891.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/addSupLedger/page-68a123af13ec428d.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/amountRecieves/page-bb45eef414d54ed9.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/bankCheque/page-d3486f5ec563f083.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/bankDetails/page-da085ec98e09dabe.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/bankLedger/page-1a5d9888c0e89020.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/banks/page-b1bf3af300555a6e.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/buyer_ledger/page-502f8a5d541a7ef9.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/companyLedger/page-1271c288f74f1fec.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/customer/page-f5ee0b35d38ffa5e.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/dashboard/page-064da05a28ead42b.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/expenseDetails/page-0d17f95c3e86b194.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/expenses/page-6290f4ff118f4af9.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/inflow/page-e1889adbb5ff68f4.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/investor/page-9048960100796036.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/investor_ledger/page-65951286ae187fbf.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/invoice/page-aac4a0c4e14ea123.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/layout-52776d20881b7e82.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/outflow/page-9c9cd62300952513.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/packing/page-e881a0ed7b0ba84d.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/page-47291ddca7b581d7.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/paymentReciept/page-b8770f7e813500bd.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/paymentRecieves/page-c401881366a4bbee.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/payments/page-378ac3d6e709dfb3.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/product/page-4d22e4c9e143d979.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/purchase/page-90e8a726ba8cd3d9.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/purchase_details/page-749cfba08c9a9f4a.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/sale/page-7b076ba63636785e.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/stock/page-4f2a2e728c67573c.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/supplier/page-15bb2b559531de37.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/supplier_invoice/page-ea3c2a7c42e8e985.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/supplier_ledger/page-c81abb2b3cf36280.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/app/trialBalance/page-5ce173ba6b662b58.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/bc98253f.9338023680b8fe36.js",revision:"9338023680b8fe36"},{url:"/_next/static/chunks/e8686b1f-b49dfa2696362ac1.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/fd9d1056-b22f0dd492faefe8.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/main-app-e969fc0c82aca939.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/main-d153da850f332a3f.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-7852061f16ec154a.js",revision:"x3_322_i8LX7bqwEAzhV9"},{url:"/_next/static/css/0a235c57a67c1a20.css",revision:"0a235c57a67c1a20"},{url:"/_next/static/css/0a838cd8d8f77a47.css",revision:"0a838cd8d8f77a47"},{url:"/_next/static/css/0cb3d8f21cc118be.css",revision:"0cb3d8f21cc118be"},{url:"/_next/static/css/268dcfa6aaa80fbf.css",revision:"268dcfa6aaa80fbf"},{url:"/_next/static/css/5ffffc0f4926d238.css",revision:"5ffffc0f4926d238"},{url:"/_next/static/css/889b551bb761aed4.css",revision:"889b551bb761aed4"},{url:"/_next/static/css/89c6e634ec8a7fa0.css",revision:"89c6e634ec8a7fa0"},{url:"/_next/static/css/b5822151b8f5ac39.css",revision:"b5822151b8f5ac39"},{url:"/_next/static/css/be1f1885fd3dfd26.css",revision:"be1f1885fd3dfd26"},{url:"/_next/static/css/cc0be05224915bbe.css",revision:"cc0be05224915bbe"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/logo.2a1e135e.png",revision:"cbafd06457d54cdeb8be8e1444b62a69"},{url:"/_next/static/x3_322_i8LX7bqwEAzhV9/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/x3_322_i8LX7bqwEAzhV9/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/amount.png",revision:"0340fb19b17d0ccc790162898a147664"},{url:"/bank.png",revision:"36a74bb59d1768cd035587c2cb3872ae"},{url:"/delete.png",revision:"b2026a8a9a4e95747ba7c7c176659d06"},{url:"/edit.jpg",revision:"ee30a6819f7142127fef7c3396588710"},{url:"/editt.png",revision:"34303c7572d2f33c185a4089fbc5338c"},{url:"/epxense.png",revision:"4522352f22ee8e37d752a0025754e582"},{url:"/fonts/Poppins-Medium.ttf",revision:"bf59c687bc6d3a70204d3944082c5cc0"},{url:"/fonts/Poppins-Regular.ttf",revision:"093ee89be9ede30383f39a899c485a82"},{url:"/loginImage.png",revision:"eed944e0ee1e82d3005c8afb48643a01"},{url:"/logo.png",revision:"cbafd06457d54cdeb8be8e1444b62a69"},{url:"/logo512.jpeg",revision:"94681e184e4cc63d0b4be810ff1db7cd"},{url:"/manifest.json",revision:"09e3920c5bbd9675d232997c6cb8c6e7"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/opening.png",revision:"b4c3820b541d114e4591af8430686753"},{url:"/searchGlass.svg",revision:"7c9e12982f7b4a2df3339f1088fb6e05"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"},{url:"/total.png",revision:"72c8dc05fa198ba28553cebd670ce21d"},{url:"/userPic.png",revision:"9ef7c5da18f016bdbbd25bf7716b20aa"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
