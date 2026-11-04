import test from 'node:test';
import assert from 'node:assert/strict';
import {uniqueBallotPositions} from '../src/utils/ballotPositions.ts';
test('ballotPositions integrity check',()=>{ assert.equal(uniqueBallotPositions([{positionId:'p1'},{positionId:'p1'}]),false); });
