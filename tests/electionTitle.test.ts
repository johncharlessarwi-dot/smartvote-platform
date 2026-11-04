import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeElectionTitle} from '../src/utils/electionTitle.ts';
test('electionTitle integrity check',()=>{ assert.equal(normalizeElectionTitle('  Class\nPresident  '),'Class President'); });
