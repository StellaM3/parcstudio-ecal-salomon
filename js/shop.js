// Nearest Salomon store: distance + a compass needle that turns with the phone.
// Uses the real position (GPS) when the visitor is near the selected city, otherwise a demo position.
(function () {
  window.App = window.App || {};

  // Edit here. Barcelona: Salomon Brand Store, Rambla de Catalunya 54.
  // Matterhorn: PLACEHOLDER position in Zermatt village, to verify before the presentation.
  const stores = {
    barcelona: { label: 'Salomon Barcelona', lat: 41.3919, lon: 2.1636 },
    matterhorn: { label: 'Salomon Zermatt', lat: 46.0215, lon: 7.7487 },
    lavaux: { label: 'Salomon · Lavaux', lat: 46.49, lon: 6.74 },
    paris: { label: 'Salomon · Paris', lat: 48.8566, lon: 2.3522 }
  };

  let watchId = null;
  let gps = null;
  let heading = null;
  let listening = false;
  let active = false;
  let compassGranted = false;
  let permissionPending = false;
  let needleAngle = null;

  function toRad(v) { return v * Math.PI / 180; }

  function distanceMeters(a, b) {
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function bearing(a, b) {
    const y = Math.sin(toRad(b.lon - a.lon)) * Math.cos(toRad(b.lat));
    const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lon - a.lon));
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function format(m) {
    if (m < 1000) return Math.max(10, Math.round(m / 10) * 10) + ' m';
    return (m / 1000).toFixed(m < 10000 ? 1 : 0) + ' km';
  }

  function set(name, value) {
    document.querySelectorAll('[data-show="' + name + '"]').forEach(function (n) { n.textContent = value; });
  }

  function refresh() {
    const city = App.state.get('location');
    const store = stores[city];
    const place = App.utils.places[city];
    if (!store || !place) return;
    const useGps = gps && distanceMeters(gps, store) < 40000;
    const from = useGps ? gps : place;
    const d = distanceMeters(from, store);
    const configured = distanceMeters(place, store) > 1;
    set('shop-distance', configured ? format(d) : '—');
    set('shop-name', store.label);
    const turn = bearing(from, store) - (heading == null ? 0 : heading);
    // Cross north by the short route instead of spinning almost a full turn.
    needleAngle = needleAngle == null ? turn : needleAngle + ((turn - needleAngle + 540) % 360 + 360) % 360 - 180;
    const needle = document.getElementById('compass-needle');
    if (needle) needle.style.transform = 'rotate(' + needleAngle + 'deg)';
    if (needle) needle.style.opacity = configured ? '1' : '.25';
  }

  function onOrientation(event) {
    if (!active) return;
    let h = null;
    if (typeof event.webkitCompassHeading === 'number') h = event.webkitCompassHeading;
    else if (event.absolute && typeof event.alpha === 'number') h = 360 - event.alpha;
    if (!Number.isFinite(h)) return;
    heading = (h % 360 + 360) % 360;
    refresh();
  }

  function listenOrientation() {
    if (listening) return;
    listening = true;
    window.addEventListener('deviceorientationabsolute', onOrientation);
    window.addEventListener('deviceorientation', onOrientation);
  }

  App.shop = {
    stores: stores,
    refresh: refresh,
    start(fromTap) {
      active = true;
      refresh();
      if (navigator.geolocation && watchId == null) {
        try {
          watchId = navigator.geolocation.watchPosition(function (pos) {
            gps = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            refresh();
          }, function () { /* refused or unavailable: keep the demo position */ }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 });
        } catch (e) { watchId = null; }
      }
      // iPhone asks for compass permission, and only after a tap.
      const D = window.DeviceOrientationEvent;
      if (D && typeof D.requestPermission === 'function') {
        if (compassGranted) listenOrientation();
        else if (fromTap && !permissionPending) {
          permissionPending = true;
          D.requestPermission().then(function (result) {
            compassGranted = result === 'granted';
            if (compassGranted && active) listenOrientation();
          }).catch(function () {}).finally(function () { permissionPending = false; });
        }
      } else if (D) {
        listenOrientation();
      }
    },
    stop() {
      active = false;
      window.removeEventListener('deviceorientationabsolute', onOrientation);
      window.removeEventListener('deviceorientation', onOrientation);
      listening = false;
      if (watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };
})();
