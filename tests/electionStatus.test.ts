import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveElectionStatus} from '../src/utils/electionStatus.ts';
test('electionStatus integrity check',()=>{ assert.equal(deriveElectionStatus('2026-11-01','2026-11-05','2026-11-04'),'ACTIVE'); });

test('invalid timestamp types return INVALID',()=>{assert.equal(deriveElectionStatus(null as unknown as string,'2026-11-05','2026-11-04'),'INVALID');});
