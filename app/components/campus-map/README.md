# SURGE campus map

The component replaces the old PNG with a self-contained, fixed-angle isometric
SVG scene. The same geographic data supports the overhead view and device
location. No map SDK, runtime tile service, API key or paid geocoder is needed.

## Venue directory

`places.ts` contains the 15 organizer-confirmed destinations and original Google
Maps links. Coordinates were resolved from the actual destination pins, not the
map camera positions. Football and futsal share one destination; it appears in
both the sports and food filters. Search includes campus aliases and the sports
inside the ISC. Unknown event desks, first-aid stations and stall entrances have
not been invented. Pins identify places, not surveyed pedestrian entrances.

## Geometry and attribution

`campus-geometry.json` derives from OpenStreetMap campus way 369248213 and nearby
buildings, paths, water and grounds. The extract was retrieved on 20 October 2026:

https://api.openstreetmap.org/api/0.6/map.json?bbox=77.5675,28.5175,77.582,28.5342

The data is © OpenStreetMap contributors, licensed under ODbL 1.0. Preserve the
map's visible attribution. See https://www.openstreetmap.org/copyright and
https://opendatacommons.org/licenses/odbl/1-0/ .

To refresh, download the public JSON extract and run:

```sh
node scripts/build-campus-geometry.mjs /path/to/osm-map.json
```

Projection uses a local metric plane around 77.5745° E, 28.526° N. The decorative
trees and unspecified building heights are illustrative; building footprints,
paths and grounds come from the source. Construction-tagged buildings are
excluded. This is a campus illustration, not a surveyed architectural model.
The ISC has a distinctive blue facade and ribbed light roof; wall windows, tree
canopies, water and ground shading are illustrative details. Numbered venue pins
match the directory and selected venue card, independently of zoom or filtering.

## Interactions and verification

Search and filters run locally. Marker clusters separate as the view zooms in.
The opening view frames the main venues; Reset campus overview includes the full
campus and Gate 1 approach.
Drag pans; pinch or Ctrl/Cmd+wheel zooms; ordinary scrolling continues the page.
Keyboard users can select the map region and use arrows, +/− and Home, or use the
venue list and labeled controls. An expanded view supports Escape to close.

Camera input is coalesced with requestAnimationFrame. Wheel zoom reads the latest
pending camera, and pointer release flushes the final position; selection/reset
cancel pending input. The unchanged SVG scene moves as one CSS transform layer.
Repeated facade windows and roof ribs are combined into compound paths, removing
about 30% of the original SVG elements without removing drawing detail. Individual
buildings and preview scenes are memoized. Tree transforms use fixed precision so
server and browser math differences do not cause hydration warnings.

Location is requested only after pressing Locate me and is kept in component
memory, with no server submission or persistence. High accuracy is requested,
cached fixes are disabled (`maximumAge: 0`), and each fix has a 15-second timeout.
Actual precision depends on the device, signal and location permissions; the
browser cannot guarantee GPS-level accuracy. Watches are cleared on stop,
error and unmount. Accuracy is shown as a geographic circle. Outside-campus
positions keep the campus visible and offer Gate 1 directions. Browser/device
location permissions and on-campus GPS accuracy still need real-device testing.

```sh
node --test --test-isolation=none tests/campus-map.test.mjs tests/frame-scheduler.test.mjs
npx tsc --noEmit --incremental false
```
