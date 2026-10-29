# SALOMON — ELEMENTS / V1

An immersive weather-led mobile-first prototype built **inside the original publicparc starter**.

**No installation, build command, account, external API, font library or framework.**

## Open it

1. Unzip the folder.
2. Double-click **index.html**. On desktop the experience is displayed in a 390 × 844 px phone frame; on an actual mobile browser the frame fills the screen.
3. The opening screen contains only the Salomon wordmark and the two location paths. Enter **Barcelona** or **Matterhorn**, or click **Allow location**.
4. In the immersive view click the floating glass button (bottom-right) to reveal the four weather controls and three configurator steps. Tap any weather icon to crossfade into that background.

**If you open the file directly:** Geolocation can be blocked by browser security settings, even when the rest of the site works. The manual city option always works. For geolocation testing on a secure origin, deploy over HTTPS or use localhost.

## Navigation

- **Three horizontal dots (in the expanded glass control):** location, weather, outfit.
- **Four vertical weather icons:** sun, rain, snow, cloud/wind.
- **Glass button:** expand / collapse the weather and navigation control.
- **Location step:** switch Barcelona ↔ Matterhorn without leaving the experience.
- **Outfit step:** opens the product-layer interface, ready for the product assets supplied by the image team.
- **Horizontal swipe:** opens the same outfit interface without changing weather.
- **Esc:** close the panel or glass menu.
- **Persistent data:** the last location and weather choice survive reload. The location entry still opens first on a new visit.

## Avatar SVG

The supplied `assets/bonhomme.svg` is the fixed central silhouette. Product layers can be added later by the product-image team without changing the weather UI.

## Files

```
index.html                   location entry, weather scene and local SVG icons
css/app.css                  Salomon design / weather glass / transitions
css/tokens.css               colors, font scale, phone frame
css/base.css                 original starter reset / reduced motion
css/frame.css                original responsive phone frame
js/app.js                    interactions, geolocation, local selection, swipe
js/state.js                  state values
js/render.js                 view updates / crossfade
js/utils.js                  weather data / filenames / location parsing
js/shared.js,js/storage.js   original optional state persistence
js/frame.js                  original responsive frame
assets/salomon-white.png     transparent wordmark made from supplied logo
assets/salomon-black.png     alternative wordmark
assets/salomon-mark.svg      square Salomon brand mark used in the scene
assets/bonhomme.svg          supplied fixed white avatar silhouette
assets/fonts/Apax-Medium.ttf supplied interface typeface
assets/backgrounds/*.webp    8 supplied 9:16 high quality reference scenes
```

## Replacing scenes

All eight background assets are stored at `assets/backgrounds/` and named `barcelona-sun.webp`, `barcelona-rain.webp`, `barcelona-snow.webp`, `barcelona-cloud.webp` and the same four names for `matterhorn`.

They were sourced from the **eight reference images you provided** and converted to high-quality WebP, with their original 941 × 1672 pixel detail retained. No new AI-generated scenery was introduced in this coding pass.

To replace any scene with a newer image, export the replacement to the same filename; the system picks it up automatically. To switch to PNG, change the `.webp` extension in `js/utils.js` and in the initial background image URLs in `index.html` and `css/app.css`.

## Scope / honest limits

- Weather temperatures and conditions are **simulated**, not fetched from a weather provider. Matterhorn displays **+3°** throughout the V1 as requested.
- Location access is an actual browser permission. As there are only two V1 destinations, the coordinate is mapped to **the nearer of Barcelona or Matterhorn**, not to a third city.
- The supplied avatar SVG stays fixed while backgrounds crossfade.
- Product swapping and the shopping grid remain intentionally ready for the product-image team; this pass focuses on the interface.
- All UI and media use relative paths, support `file://` and deployed subfolders. No local `fetch()` or ES modules.
