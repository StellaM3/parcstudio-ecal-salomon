(function () {
  window.App = window.App || {};
  App.utils = {
    places: {
      barcelona: { label: 'Barcelona', lat: 41.3874, lon: 2.1686 },
      matterhorn: { label: 'Matterhorn', lat: 45.9763, lon: 7.6586 },
      lavaux: { label: 'Lavaux', lat: 46.49, lon: 6.74 },
      paris: { label: 'Paris', lat: 48.8566, lon: 2.3522 }
    },
    weathers: {
      sun: { label: 'Sunny', detail: 'Blue skies. All-day movement.', index: '01', symbol: '#i-sun' },
      rain: { label: 'Rainstorm', detail: 'Stay out. Stay protected.', index: '02', symbol: '#i-rain' },
      snow: { label: 'Snow', detail: 'Cold air. New terrain.', index: '03', symbol: '#i-snow' },
      cloud: { label: 'Overcast', detail: 'Quiet skies. Open horizons.', index: '04', symbol: '#i-wind' }
    },
    temperatures: {
      barcelona: { sun: '+18°', rain: '+18°', snow: '+18°', cloud: '+18°' },
      matterhorn: { sun: '+3°', rain: '+3°', snow: '+3°', cloud: '+3°' },
      lavaux: { sun: '+10°', rain: '+10°', snow: '+10°', cloud: '+10°' },
      paris: { sun: '+14°', rain: '+14°', snow: '+14°', cloud: '+14°' }
    },
    imageFor(location, weather) {
      const place = this.places[location];
      const backdrop = place && place.backdrop ? place.backdrop : location;
      return 'assets/backgrounds/' + backdrop + '-' + weather + '.webp';
    },
    parseCity(text) {
      const term = String(text).trim().toLocaleLowerCase();
      if (/(barcelona|barcelone|barca|bcn)/.test(term)) return 'barcelona';
      if (/(matterhorn|zermatt|cervin|cervino)/.test(term)) return 'matterhorn';
      if (/(lavaux|lausanne|lsn)/.test(term)) return 'lavaux';
      if (/(paris)/.test(term)) return 'paris';
      return '';
    },
    distanceSquared(lat, lon, place) {
      const rad = Math.PI / 180;
      const dlat = (lat - place.lat) * rad;
      const dlon = (lon - place.lon) * rad;
      return dlat * dlat + dlon * dlon * Math.cos(lat * rad) * Math.cos(place.lat * rad);
    },
    nearestPlace(lat, lon) {
      const cities = this.places;
      return Object.keys(cities).reduce(function (nearest, key) {
        return this.distanceSquared(lat, lon, cities[key]) < this.distanceSquared(lat, lon, cities[nearest]) ? key : nearest;
      }.bind(this), 'barcelona');
    }
  };
})();
