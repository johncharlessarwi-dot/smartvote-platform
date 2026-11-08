import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeElectionTitle} from '../src/utils/electionTitle.ts';
test('electionTitle integrity check',()=>{ assert.equal(normalizeElectionTitle('  Class\nPresident  '),'Class President'); });

test('rejects non-string title',()=>{assert.equal(normalizeElectionTitle(null as unknown as string),'');});

test('removes bidirectional control codes',()=>{assert.equal(normalizeElectionTitle('Vote'+String.fromCharCode(0x202E)+'Now'),'Vote Now');});
