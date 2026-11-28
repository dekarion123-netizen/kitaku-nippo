const CACHE = "kitaku-nippo-v42";
const SHELL = ["./", "./index.html", "./aza.js", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.hostname.endsWith("supabase.co") || u.hostname.includes("nominatim") || u.hostname.includes("heartrails") || u.hostname.endsWith("gsi.go.jp") || u.hostname.endsWith("open-meteo.com") || u.hostname.endsWith("script.google.com") || u.hostname.endsWith("script.googleusercontent.com")) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));
      return r;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
