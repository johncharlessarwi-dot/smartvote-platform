import test from 'node:test';
import assert from 'node:assert/strict';
import {uniqueBallotPositions} from '../src/utils/ballotPositions.ts';
test('ballotPositions integrity check',()=>{ assert.equal(uniqueBallotPositions([{positionId:'p1'},{positionId:'p1'}]),false); });

test('rejects blank and padded position identifiers',()=>{assert.equal(uniqueBallotPositions([{positionId:' '}]),false);assert.equal(uniqueBallotPositions([{positionId:' p1'}]),false);});

test('oversized ballot positions fail closed',()=>{assert.equal(uniqueBallotPositions(Array.from({length:1001},(_,i)=>({positionId:'p'+i}))),false);});

test('rejects unsafe position keys',()=>{assert.equal(uniqueBallotPositions([{positionId:'p\n1'}]),false);});
