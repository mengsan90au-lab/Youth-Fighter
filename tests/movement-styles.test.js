'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const movement = require('../public/movement-styles.js');
const world = require('../public/world.js');

test('movement styles expose the expected calibrated values', () => {
  assert.equal(movement.styles.walk.id, 'walk');
  assert.equal(movement.styles.run.id, 'run');
  assert.ok(movement.styles.run.speed > movement.styles.walk.speed);
  assert.equal(movement.get('missing').id, 'walk');
});

test('distanceBudget smooths the transition to the target speed', () => {
  const result = movement.distanceBudget(0, 2, 0.1);
  assert.ok(result.distance > 0);
  assert.ok(result.speed > 0);
  assert.ok(result.speed <= 2.1);
});

test('world bootstrap creates a valid city state and movement tick updates ground speed', () => {
  const state = { time: 0, entities: [] };
  const baseWorld = world.createWorld();
  const player = world.addPlayer(baseWorld, 'tester', 'Test Hero');

  assert.equal(player.mapId, 'sovann-city');
  assert.equal(player.x, 12);
  assert.equal(player.y, 12);
  assert.ok(Array.isArray(baseWorld.entities));

  const movingPlayer = {
    x: 0,
    y: 0,
    input: { x: 1, y: 0 },
    movementStyle: 'walk',
    wanted: 0,
    jail: 0,
    combatUntil: 0,
    cd: [],
  };

  movement.reset(movingPlayer);
  movement.tick(state, movingPlayer, 0.25, (entity, x, y) => {
    entity.x = x;
    entity.y = y;
  });

  assert.ok(movingPlayer.groundSpeed >= 0);
  assert.ok(Number.isFinite(movingPlayer.currentSpeed));
  assert.ok(movingPlayer.movementMetres >= 0);
});
