/* TripDusk — Sunset Finder
   Client-side tool. Data: Open-Meteo (free, no API key).
   - Geocoding:  https://geocoding-api.open-meteo.com
   - Forecast:   https://api.open-meteo.com  (sunset times + cloud cover)
*/
(function () {
  "use strict";

  var input = document.getElementById("sf-city");
  var form = document.getElementById("sf-form");
  var suggest = document.getElementById("sf-suggest");
  var geoBtn = document.getElementById("sf-geo");
  var status = document.getElementById("sf-status");
  var result = document.getElementById("sf-result");
  var spots = document.getElementById("sf-spots");
  if (!input || !form) return;

  var COMPASS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  var debounce;

  function setStatus(msg, isErr) {
    status.textContent = msg || "";
    status.style.color = isErr ? "var(--coral)" : "var(--text-dim)";
  }

  /* ---- time helpers (Open-Meteo returns local wall-clock, no offset) ---- */
  function parseLocal(iso) {
    var p = iso.split("T"), d = p[0].split("-"), t = p[1].split(":");
    return new Date(Date.UTC(+d[0], +d[1] - 1, +d[2], +t[0], +t[1]));
  }
  function addMin(date, m) { return new Date(date.getTime() + m * 60000); }
  function fmtHM(date) {
    var h = date.getUTCHours(), m = date.getUTCMinutes(), ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ap;
  }
  function dayOfYear(date) {
    var start = Date.UTC(date.getUTCFullYear(), 0, 0);
    return Math.floor((date.getTime() - start) / 86400000);
  }

  /* ---- sunset direction (approx solar azimuth at sunset) ---- */
  function sunsetAzimuth(lat, doy) {
    var rad = Math.PI / 180;
    var decl = -23.44 * Math.cos(rad * (360 / 365) * (doy + 10));
    var cosA = Math.sin(decl * rad) / Math.cos(lat * rad);
    cosA = Math.max(-1, Math.min(1, cosA));
    var rise = Math.acos(cosA) / rad;   // azimuth from north at sunrise
    return (360 - rise + 360) % 360;    // sunset azimuth
  }
  function compass(az) { return COMPASS[Math.round(az / 22.5) % 16]; }

  /* ---- sunset quality from cloud cover ---- */
  function qualityScore(low, mid, high) {
    var color = (mid + high) / 2;                 // clouds that catch colour
    var s = Math.max(0, 60 - Math.abs(color - 50) * 1.2);  // peak ~50%
    s += Math.max(0, 40 - low * 0.4);             // clearer near horizon = better
    return Math.round(Math.max(0, Math.min(100, s)));
  }
  function qualityLabel(s) {
    if (s >= 78) return { t: "Spectacular", c: "#ff7a59" };
    if (s >= 62) return { t: "Great", c: "#ffba5a" };
    if (s >= 46) return { t: "Good", c: "#ffd089" };
    if (s >= 30) return { t: "Fair", c: "#c9b7d6" };
    return { t: "Low", c: "#8a7ba0" };
  }
  function qualityReason(low, mid, high) {
    if (mid + high < 15) return "Clear skies — pretty, but often a plain sunset.";
    if (low > 70) return "Lots of low cloud may block the sun near the horizon.";
    if (mid + high >= 30 && mid + high <= 130 && low < 50) return "Mid/high clouds to catch colour with a clearish horizon.";
    if (low > 40) return "Some low cloud could dim the show near the horizon.";
    return "A decent mix of cloud for colour.";
  }

  /* ---- API ---- */
  function geocode(name) {
    return fetch("https://geocoding-api.open-meteo.com/v1/search?count=5&language=en&format=json&name=" + encodeURIComponent(name))
      .then(function (r) { return r.json(); })
      .then(function (j) { return j.results || []; });
  }
  function forecast(lat, lon) {
    var u = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
      "&daily=sunset,sunrise&hourly=cloud_cover_low,cloud_cover_mid,cloud_cover_high&timezone=auto&forecast_days=4";
    return fetch(u).then(function (r) { return r.json(); });
  }

  function placeLabel(p) {
    return [p.name, p.admin1, p.country].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 2).join(", ");
  }

  /* ---- render ---- */
  function cloudAt(data, iso) {
    var hour = iso.slice(0, 13) + ":00";
    var i = data.hourly.time.indexOf(hour);
    if (i < 0) i = data.hourly.time.indexOf(iso.slice(0, 11) + "18:00");
    if (i < 0) i = 18;
    return {
      low: data.hourly.cloud_cover_low[i] || 0,
      mid: data.hourly.cloud_cover_mid[i] || 0,
      high: data.hourly.cloud_cover_high[i] || 0
    };
  }
  function dayName(iso, idx) {
    if (idx === 0) return "Today";
    if (idx === 1) return "Tomorrow";
    var d = parseLocal(iso + "T12:00");
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  }

  function render(label, lat, data) {
    var sunsetIso = data.daily.sunset[0];
    var sunset = parseLocal(sunsetIso);
    var goldenStart = addMin(sunset, -50);
    var blueEnd = addMin(sunset, 30);
    var az = sunsetAzimuth(lat, dayOfYear(sunset));
    var dir = compass(az);
    var c = cloudAt(data, sunsetIso);
    var score = qualityScore(c.low, c.mid, c.high);
    var q = qualityLabel(score);

    var outlook = data.daily.sunset.map(function (iso, i) {
      var cc = cloudAt(data, iso);
      var s = qualityScore(cc.low, cc.mid, cc.high);
      var ql = qualityLabel(s);
      return '<div class="sf-day"><span class="sf-day-name">' + dayName(iso.slice(0, 10), i) + '</span>' +
        '<span class="sf-day-time">' + fmtHM(parseLocal(iso)) + '</span>' +
        '<span class="sf-dot" style="background:' + ql.c + '" title="' + ql.t + '"></span>' +
        '<span class="sf-day-q">' + ql.t + '</span></div>';
    }).join("");

    result.innerHTML =
      '<div class="sf-place">' + label + '</div>' +
      '<div class="sf-grid">' +
        '<div class="sf-big"><div class="sf-label">Tonight’s sunset</div><div class="sf-time">' + fmtHM(sunset) + '</div></div>' +
        '<div class="sf-compass"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" class="sf-ring"/><text x="50" y="16" class="sf-card">N</text><text x="88" y="54" class="sf-card">E</text><text x="50" y="94" class="sf-card">S</text><text x="12" y="54" class="sf-card">W</text><g transform="rotate(' + az.toFixed(0) + ' 50 50)"><polygon points="50,12 45,52 55,52" class="sf-needle"/><circle cx="50" cy="50" r="4" class="sf-hub"/></g></svg><div class="sf-dir">Face <strong>' + dir + '</strong><span>' + az.toFixed(0) + '°</span></div></div>' +
      '</div>' +
      '<div class="sf-windows">' +
        '<div><span class="sf-w-label">🌞 Golden hour</span><span class="sf-w-val">' + fmtHM(goldenStart) + ' – ' + fmtHM(sunset) + '</span></div>' +
        '<div><span class="sf-w-label">🌆 Blue hour</span><span class="sf-w-val">' + fmtHM(sunset) + ' – ' + fmtHM(blueEnd) + '</span></div>' +
      '</div>' +
      '<div class="sf-quality"><div class="sf-q-badge" style="border-color:' + q.c + ';color:' + q.c + '">' + q.t + ' · ' + score + '/100</div>' +
        '<div class="sf-q-reason">' + qualityReason(c.low, c.mid, c.high) + '</div></div>' +
      '<div class="sf-outlook-title">Next few evenings</div><div class="sf-outlook">' + outlook + '</div>' +
      '<p class="sf-note">Estimated from live cloud data. Get in position ~30 min early and stay for the blue hour. ' +
        '<a href="how-to-photograph-sunset.html">Learn how to photograph it →</a></p>';

    result.hidden = false;
    setStatus("");
  }

  /* ---- best spots within the city (OpenStreetMap Overpass) ---- */
  var OVERPASS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
  var SPOT_META = {
    viewpoint: { w: 3, icon: "🔭", label: "Viewpoint" },
    peak:      { w: 3, icon: "⛰️", label: "Hilltop / peak" },
    tower:     { w: 3, icon: "🗼", label: "Observation deck" },
    pier:      { w: 2, icon: "🌉", label: "Pier" },
    beach:     { w: 2, icon: "🏖️", label: "Beach" }
  };
  function haversine(la1, lo1, la2, lo2) {
    var R = 6371, rad = Math.PI / 180;
    var dLa = (la2 - la1) * rad, dLo = (lo2 - lo1) * rad;
    var a = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function bearing(la1, lo1, la2, lo2) {
    var rad = Math.PI / 180;
    var y = Math.sin((lo2 - lo1) * rad) * Math.cos(la2 * rad);
    var x = Math.cos(la1 * rad) * Math.sin(la2 * rad) - Math.sin(la1 * rad) * Math.cos(la2 * rad) * Math.cos((lo2 - lo1) * rad);
    return (Math.atan2(y, x) / rad + 360) % 360;
  }
  function spotKind(t) {
    if (t.tourism === "viewpoint") return "viewpoint";
    if (t.natural === "peak") return "peak";
    if (t.man_made === "tower") return "tower";
    if (t.man_made === "pier") return "pier";
    if (t.natural === "beach") return "beach";
    return null;
  }
  function overpassQuery(lat, lon) {
    // Kept lean (viewpoints + hilltops) so it stays fast even in dense cities.
    return "[out:json][timeout:20];(" +
      'nwr["tourism"="viewpoint"]["name"](around:18000,' + lat + ',' + lon + ');' +
      'nwr["natural"="peak"]["name"](around:18000,' + lat + ',' + lon + ');' +
      ");out center tags 60;";
  }
  function fetchOverpass(q, i) {
    i = i || 0;
    if (i >= OVERPASS.length) return Promise.reject(new Error("all endpoints failed"));
    var ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, 15000);
    return fetch(OVERPASS[i] + "?data=" + encodeURIComponent(q), { signal: ctrl.signal })
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error("http " + r.status); return r.text(); })
      .then(function (txt) {
        var j;
        try { j = JSON.parse(txt); } catch (e) { throw new Error("non-JSON (rate limit?)"); }
        if (!j.elements) throw new Error("no elements");
        return j;
      })
      .catch(function () { clearTimeout(to); return fetchOverpass(q, i + 1); });
  }
  function loadSpots(cityLabel, lat, lon) {
    if (!spots) return;
    var city = cityLabel.split(",")[0];
    spots.hidden = false;
    spots.innerHTML = '<div class="sf-spots-title">Best spots to watch the sunset in ' + city + '</div><p class="sf-status">Searching viewpoints nearby…</p>';
    fetchOverpass(overpassQuery(lat, lon)).then(function (j) {
      var seen = {}, list = [];
      (j.elements || []).forEach(function (e) {
        var t = e.tags; if (!t || !t.name) return;
        var kind = spotKind(t); if (!kind) return;
        var la = e.lat != null ? e.lat : (e.center && e.center.lat);
        var lo = e.lon != null ? e.lon : (e.center && e.center.lon);
        if (la == null) return;
        var key = t.name.toLowerCase();
        if (seen[key]) return; seen[key] = 1;
        list.push({ name: t.name, kind: kind, la: la, lo: lo, dist: haversine(lat, lon, la, lo), west: (function (b) { return b >= 200 && b <= 340; })(bearing(lat, lon, la, lo)) });
      });
      list.sort(function (a, b) { return (SPOT_META[b.kind].w - SPOT_META[a.kind].w) || (a.dist - b.dist); });
      var top = list.slice(0, 10);
      if (!top.length) {
        spots.innerHTML = '<div class="sf-spots-title">Best spots in ' + city + '</div><p class="sf-status">No mapped viewpoints found nearby — try a bigger city, or head to a west-facing hill, rooftop or waterfront.</p>';
        return;
      }
      var rows = top.map(function (s) {
        var m = SPOT_META[s.kind];
        var d = s.dist < 1 ? Math.round(s.dist * 1000) + " m" : s.dist.toFixed(1) + " km";
        var maps = "https://www.google.com/maps/search/?api=1&query=" + s.la + "," + s.lo;
        return '<a class="sf-spot" href="' + maps + '" target="_blank" rel="noopener">' +
          '<span class="sf-spot-ico">' + m.icon + '</span>' +
          '<span class="sf-spot-main"><span class="sf-spot-name">' + s.name + '</span>' +
          '<span class="sf-spot-meta">' + m.label + ' · ' + d + ' from centre' + (s.west ? ' · <em>west side 🌅</em>' : '') + '</span></span>' +
          '<span class="sf-spot-go">Directions →</span></a>';
      }).join("");
      spots.innerHTML = '<div class="sf-spots-title">Best spots to watch the sunset in ' + city + '</div>' +
        '<div class="sf-spot-list">' + rows + '</div>' +
        '<p class="sf-note">Viewpoints &amp; hilltops from OpenStreetMap, nearest first. Pick one open toward the west and tap for directions.</p>';
    }).catch(function () {
      spots.innerHTML = '<div class="sf-spots-title">Best spots in ' + city + '</div><p class="sf-status">Couldn’t load nearby spots right now. Please try again in a moment.</p>';
    });
  }

  function run(label, lat, lon) {
    setStatus("Checking the sky…");
    result.hidden = true;
    if (spots) { spots.hidden = true; spots.innerHTML = ""; }
    forecast(lat, lon).then(function (data) {
      if (!data || !data.daily || !data.daily.sunset) throw new Error("no data");
      render(label, +lat, data);
      loadSpots(label, +lat, +lon);
    }).catch(function () {
      setStatus("Couldn’t load the forecast. Please try again.", true);
    });
  }

  /* ---- autocomplete ---- */
  function showSuggestions(list) {
    if (!list.length) { suggest.hidden = true; suggest.innerHTML = ""; return; }
    suggest.innerHTML = list.map(function (p, i) {
      return '<button type="button" class="sf-sug" data-i="' + i + '">' +
        '<span>' + p.name + '</span><small>' + [p.admin1, p.country].filter(Boolean).join(", ") + '</small></button>';
    }).join("");
    suggest.hidden = false;
    suggest._list = list;
  }
  input.addEventListener("input", function () {
    var q = input.value.trim();
    clearTimeout(debounce);
    if (q.length < 2) { suggest.hidden = true; return; }
    debounce = setTimeout(function () {
      geocode(q).then(showSuggestions).catch(function () {});
    }, 250);
  });
  suggest.addEventListener("click", function (e) {
    var btn = e.target.closest(".sf-sug");
    if (!btn) return;
    var p = suggest._list[+btn.getAttribute("data-i")];
    input.value = p.name;
    suggest.hidden = true;
    run(placeLabel(p), p.latitude, p.longitude);
  });
  document.addEventListener("click", function (e) {
    if (!suggest.contains(e.target) && e.target !== input) suggest.hidden = true;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    suggest.hidden = true;
    setStatus("Finding “" + q + "”…");
    geocode(q).then(function (list) {
      if (!list.length) { setStatus("No place found for “" + q + "”. Try another spelling.", true); return; }
      var p = list[0];
      run(placeLabel(p), p.latitude, p.longitude);
    }).catch(function () { setStatus("Search failed. Please try again.", true); });
  });

  geoBtn && geoBtn.addEventListener("click", function () {
    if (!navigator.geolocation) { setStatus("Geolocation isn’t available in this browser.", true); return; }
    setStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(function (pos) {
      run("Your location", pos.coords.latitude, pos.coords.longitude);
    }, function () {
      setStatus("Couldn’t get your location. Type a city instead.", true);
    }, { timeout: 10000 });
  });
})();
