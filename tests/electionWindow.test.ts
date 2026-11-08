import test from 'node:test';
import assert from 'node:assert/strict';
import {isElectionOpen} from '../src/utils/electionWindow.ts';
test('electionWindow integrity check',()=>{ assert.equal(isElectionOpen('2026-11-01','2026-11-05','2026-11-04'),true); });

test('rejects non-string election time',()=>{assert.equal(isElectionOpen(0 as unknown as string,'2026-11-05','2026-11-04'),false);});

test('rejects ambiguous date format',()=>{assert.equal(isElectionOpen('11/01/2026','2026-11-05','2026-11-04'),false);});
