if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return t[e]||(s=new Promise((async s=>{if("document"in self){const t=document.createElement("script");t.src=e,document.head.appendChild(t),t.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!t[e])throw new Error(`Module ${e} didn’t register its module`);return t[e]}))},s=(s,t)=>{Promise.all(s.map(e)).then((e=>t(1===e.length?e[0]:e)))},t={require:Promise.resolve(s)};self.define=(s,n,r)=>{t[s]||(t[s]=Promise.resolve().then((()=>{let t={};const i={uri:location.origin+s.slice(1)};return Promise.all(n.map((s=>{switch(s){case"exports":return t;case"module":return i;default:return e(s)}}))).then((e=>{const s=r(...e);return t.default||(t.default=s),t}))})))}}define("./sw.js",["./workbox-ea903bce"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/V9ZhGzkesHZH5FKt_eZCt/_buildManifest.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/V9ZhGzkesHZH5FKt_eZCt/_ssgManifest.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/commons.a94f124302cbaeafdd36.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/f6078781a05fe1bcb0902d23dbbb2662c8d200b3.fa5a80f0995ddc751d15.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/framework.4b81eedf2fcdb09bf521.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/main-9773baf900b04402c003.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/pages/_app-100f683626114f24924f.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/pages/_error-c08827e3f35db631dceb.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/pages/index-e47fd6079b3c31735866.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/polyfills-4f14e8c8ea1352d3ef0d.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/chunks/webpack-50bee04d1dc61f8adf5b.js",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/css/6e9ef204d6fd7ac61493.css",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/_next/static/css/9bcfb36fc40ce63be0d6.css",revision:"V9ZhGzkesHZH5FKt_eZCt"},{url:"/banner.jpg",revision:"72887218a3bf497a212a44b6156ff59e"},{url:"/favicon-512 .ico",revision:"b21cd7e11e041e271065f89921b0699c"},{url:"/favicon-512.png",revision:"b21cd7e11e041e271065f89921b0699c"},{url:"/favicon.ico",revision:"f18ea1ad65fe6c86a8b896cbfd03d019"},{url:"/favicon.png",revision:"f18ea1ad65fe6c86a8b896cbfd03d019"},{url:"/manifest.json",revision:"fa87637e6f20b6f89f4035d5ec1bcb20"},{url:"/vercel.svg",revision:"4b4f1876502eb6721764637fe5c41702"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:mp3|mp4)$/i,new e.StaleWhileRevalidate({cacheName:"static-media-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^\/api\/(?!auth\/callback\/).*$/i,new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET"),e.registerRoute(/^\/(?!api\/).*$/i,new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400,purgeOnQuotaError:!0})]}),"GET")}));