import test from 'node:test';
import assert from 'node:assert/strict';
import {participationPercent} from '../src/utils/participation.ts';
test('participation integrity check',()=>{ assert.equal(participationPercent(25,100),25); });
