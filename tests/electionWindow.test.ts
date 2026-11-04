import test from 'node:test';
import assert from 'node:assert/strict';
import {isElectionOpen} from '../src/utils/electionWindow.ts';
test('electionWindow integrity check',()=>{ assert.equal(isElectionOpen('2026-11-01','2026-11-05','2026-11-04'),true); });
