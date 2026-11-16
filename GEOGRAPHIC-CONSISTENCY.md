# v0.5 city placement note

The approved world and eight country images below are unchanged. The new browser city overview is a schematic: Temple north, Canal east, Residential west, South Gate south of the Market. It reflects the supplied Sovann concept at a thematic level (sandstone city, water crossings and southern approach), not an exact traced street survey. Its walkable objects, collisions and mini-maps are original gameplay geometry. The source concept with its painted UI is preserved only as a reference under art/city-reference; it is not used as the gameplay background.

# Geographic consistency report — approved nine-image set

The approved world image is the geographic reference. All nine originals are preserved byte-for-byte in `art/approved-originals`; SHA-256 values and dimensions are in its `provenance.json`. No coastline, label, forest, city or other painted feature was regenerated during integration. Runtime WebP and Unity JPEG copies preserve dimensions and aspect ratio.

The integration is a **clickable hierarchy of separate illustrated views**. It is **not an exact geographic zoom**. Country boundaries were not supplied, and the artwork is not georeferenced. A pin identifies a realm; it does not define a surveyed national polygon. Normalized image coordinates register click targets against labels, not geographical latitude/longitude or gameplay coordinates.

| Realm | Recognizable shared features | Observed mismatch / limitation |
| --- | --- | --- |
| Golden Naga Basin | Crescent lake, green central basin, northern/western watershed and southern delta | The regional lake and coast have different proportions; the main river and delta branches are redrawn. The mountain relief is more pronounced. Its western/northern map edges show neighbouring mainland rather than an established national boundary. |
| Jade Peak Dominion | Western alpine belt, broad river plain, east-facing estuary and channel toward Skybreak | Several regional lakes and tributaries differ from the world view. Coastal inlets, delta width and mountain spacing do not overlay with one uniform scale. |
| Moonblade Archipelago | Four principal islands, western volcanic terrain and pale northeastern highlands | Island outlines, relative sizes, strait widths and ridge positions differ. Keeping four islands does not make their geometry identical. |
| Skybreak Peninsula | Northern snowy highlands, long mountain spine, western river lowlands and southern coastal arms | The regional peninsula is broader in places; southern lobes and coastal indentation differ. Neighbouring Jade Peak terrain is visible at the left of the regional frame. |
| Sunwave Coast | Northern forest, two warm dry basins, greener eastern drainage and south-facing bays | The regional outline and east-side bays have changed proportions. Sandy districts are interpreted differently; neighbouring mountains across the eastern channel are more prominent. |
| Serpent Lotus Realm | Northern mountain boundary, dry plateau, west/southwest delta and southern wooded peninsula | The regional artwork includes neighbouring Golden Naga's crescent lake and eastern delta as context. Their presence does not transfer ownership; settlement markers remain on the Serpent Lotus side. River branching and plateau edges differ from the world artwork. |
| Storm Reed Isles | Five principal tropical islands, hook-shaped western island, broad southern island and snow-free ridges | The separate-island correction is present, but coast shapes, relative spacing, channels and land-cover proportions remain redrawn rather than registered world crops. |
| Iron Banner Frontier | Three forest lakes, alpine watershed, southern farming valley and west-facing estuary | Lake shapes and spacing, river bends, coastline indentations and ridge orientation do not align exactly with the world image. |

## What is aligned and checked

- Eight world hit areas identify the correct approved country image.
- Seventy-three named settlements use measured normalized positions on their respective country images. Each has its own stable location record; capital, main-city and smaller-settlement distinctions match the artwork.
- Two existing Golden Naga hunting areas have separate programmatic markers because they are not named on the approved settlement artwork. Their regional positions are planning placements, not a geographical survey. Their gameplay coordinates and valid physical exits remain unchanged.
- Labels already painted into the images are not duplicated. Mouse hit areas, focus/selection outlines and search centering share the same aspect-fit transform. Projection, inverse, hit tests and centering were tested across image sizes, pan, zoom and letterboxing.
- Unimplemented prototype locations without an approved plotted position remain searchable as **list-only future locations**. They are not assigned invented image pins.
- A registration review sheet was inspected outside the game. This is not a browser screenshot or a manual pointer test.

## To obtain exact world-to-country zoom later

Define approved country extents on a single unlabeled master terrain canvas. Derive each regional image by a recorded crop/scale transform and add detail without moving the main features. Store those transforms and any shared border geometry. An independent generated redraw cannot be treated as an exact enlargement merely because its style matches. This release intentionally makes no seamless-zoom claim.
