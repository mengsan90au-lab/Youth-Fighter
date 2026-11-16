# Data Contracts

Status: Proposed standard for future stable development.

## Contract principles
- Stable IDs must be explicit and durable.
- State ownership must be single-sourced.
- Each system contract must define inputs, outputs, and validation rules.
- Convert raw data into domain-safe structures before gameplay mutation.

## Proposed data categories

### World contracts
- `mapId` — stable map identifier
- `regionId` — parent region identifier
- `bounds` — min/max X/Y values
- `spawn` — safe fallback spawn point
- `exits` — valid travel destinations
- `pois` — named points of interest
- `playable` — whether the map is valid for active gameplay

### Character contracts
- `id` — player or NPC unique ID
- `name` — display-safe name
- `mapId` — current active map
- `x`, `y` — authoritative simulation coordinates
- `level`, `xp`, `gold`, `hp`, `energy`
- `path` — martial path (fist, spear, etc.)
- `wanted`, `jail`, `combatUntil`

### Combat contracts
- `skillIndex` — selected skill ID
- `range` — max valid distance from target
- `damage` — applied damage value
- `cost` — energy cost
- `cooldown` — time before skill may be used again
- `targetId` — target entity ID

### Save contracts
- `version` — schema version identifier
- `mapId` — location validation
- `x`, `y` — safe position within map bounds
- `city` — sanitized city state
- `inventory` / `equipment` — valid item references

## Validation rules
- invalid map IDs must fail closed
- coordinates must be checked against map bounds and blocked data
- equipment IDs must be resolved by data registry before use
- save version mismatches must trigger migration or fallback loading

## Ownership boundaries
- World data owns map and spawn metadata.
- Character state owns stats and gear references.
- Combat owns resolution rules but not content definitions.
- Save owns serialization and migration versioning.

## Required test coverage
- map spawn validation
- save/load compatibility
- inventory and equipment validation
- skill range and cooldown checks
- travel exit validation
- blocked-tile collision checking
