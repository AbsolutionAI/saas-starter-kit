import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';

test('config has port', () => {
  assert.equal(typeof config.port, 'number');
  assert.ok(config.port > 0);
});

test('jwt secret present', () => {
  assert.ok(config.jwtSecret.length > 0);
});
