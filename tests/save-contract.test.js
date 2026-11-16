'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const saveContract = require('../public/save-contract.js');

const mapLookup = {
  map: (id) => id === 'sovann-city' || id === 'bamboo-grove',
};

test('save validation accepts a valid versioned payload', () => {
  const result = saveContract.validateSaveData({
    version: 4,
    mapId: 'sovann-city',
    level: 3,
    xp: 40,
    gold: 120,
    hp: 90,
    energy: 80,
    wanted: 0,
    jail: 0,
    potions: 2,
    kills: 7,
    cd: [0, 0, 1],
    city: { inventory: { torch: 1 }, equipment: { weapon: 'naga-fist' } },
  }, { maps: mapLookup });

  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.normalized.version, 4);
});

test('save validation rejects unsupported versions and invalid coordinates', () => {
  const result = saveContract.validateSaveData({
    version: 99,
    mapId: 'missing-map',
    level: 500,
    gold: -1,
    energy: 101,
    cd: [0, 9, 12],
  }, { maps: mapLookup });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((msg) => msg.includes('Unsupported save schema version')));
  assert.ok(result.errors.some((msg) => msg.includes('unknown mapId')));
});

test('command validation enforces safe movement and attack input ranges', () => {
  const moveResult = saveContract.validateCommand({ type: 'move', x: 1.2, y: 0 });
  assert.equal(moveResult.valid, false);
  assert.ok(moveResult.errors.some((msg) => msg.includes('clamped to [-1,1]')));

  const attackResult = saveContract.validateCommand({ type: 'attack', skill: 2 });
  assert.equal(attackResult.valid, true);

  const gotoResult = saveContract.validateCommand({ type: 'goto', x: 7, y: 9, mapId: 'missing-map' }, { map: mapLookup.map });
  assert.equal(gotoResult.valid, false);
  assert.ok(gotoResult.errors.some((msg) => msg.includes('unknown')));
});
