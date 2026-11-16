# World Structure

Status: Existing prototype documented; future governance model proposed.

## Canonical world hierarchy

```text
World
└── Golden Naga Basin
    ├── Sovereign City / Sovann City
    │   ├── Market Ward
    │   ├── Temple Ward
    │   ├── Residential Ward
    │   ├── South Gate Ward
    │   └── Old Sovann Square
    ├── Bamboo Grove
    └── Wilderness / outlying regions
```

## Verified current structure
The map registry and city data already include a structured world definition in the browser prototype. Relevant modules:
- `public/map-data.js`
- `public/map-catalog.js`
- `public/city-data.js`
- `public/world.js`

## World design standards
The future world architecture should enforce:
- stable map IDs
- explicit map type
- playable status flag
- spawn and exit validation
- collision and travel rules
- lawful / PvP zone metadata
- format version metadata

## Sovann City expectation
The approved illustrated Sovann City should remain the intended geographic reference for later playable city development.

## Map governance requirements
Every new map or district must provide:
- unique identifier
- parent region or city
- bounds
- spawn points
- valid exits
- navigation compatibility
- blocked areas and collision data

## Planned upgrade
Future content should be authored through data-driven definitions rather than ad hoc edits across multiple gameplay modules.
