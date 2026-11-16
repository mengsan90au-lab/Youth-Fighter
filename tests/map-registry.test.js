'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const maps = require('../public/map-catalog.js');

const sampleMap = {
  id: 'sample-map',
  name: 'Sample Map',
  playable: true,
  bounds: { minX: 0, maxX: 20, minY: 0, maxY: 20 },
  spawn: { x: 5, y: 5 },
  exits: [
    { id: 'sample-exit', x: 10, y: 10, toMap: 'sovann-city' },
  ],
  pois: [],
  buildings: [],
  water: [],
  bridges: [],
  decorCollision: [],
};

test('map catalogue exposes a valid world structure', () => {
  const result = maps.validateWorldData(maps.data);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.ok(maps.map('sovann-city'));
  assert.equal(maps.blocked('sovann-city', 12, 12), false);
});

test('map validation catches invalid map bound and exit data', () => {
  const invalidData = {
    realms: [{ id: 'invalid-realm', name: 'Broken Realm', locationIds: ['sample-map'] }],
    locations: [
      {
        id: 'sample-map',
        name: 'Broken Map',
        playable: true,
        bounds: { minX: 10, maxX: 5, minY: 0, maxY: 10 },
        spawn: { x: 30, y: 30 },
        exits: [{ id: 'bad-exit', x: 15, y: 12, toMap: 'missing-map' }],
        pois: [],
        buildings: [],
        water: [],
        bridges: [],
        decorCollision: [],
      },
    ],
  };

  const result = maps.validateWorldData(invalidData);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
  assert.ok(result.errors.some((msg) => msg.includes('inverted bounds') || msg.includes('unknown map')));
});

test('map validation accepts a valid custom map payload', () => {
  const customData = {
    realms: [{ id: 'test-realm', name: 'Test Realm', locationIds: ['sample-map'] }],
    locations: [sampleMap],
  };

  const result = maps.validateWorldData(customData);
  assert.equal(result.valid, true, result.errors.join('\n'));
});
