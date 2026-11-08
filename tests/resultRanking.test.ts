import test from 'node:test';
import assert from 'node:assert/strict';
import {rankCandidates} from '../src/utils/resultRanking.ts';
test('resultRanking integrity check',()=>{ assert.deepEqual(rankCandidates([{id:'b',votes:2},{id:'a',votes:3}]).map(x=>x.id),['a','b']); });

test('rejects invalid candidate vote totals',()=>{assert.deepEqual(rankCandidates([{id:'a',votes:NaN}]),[]);});

test('duplicate candidate identities fail closed',()=>{assert.deepEqual(rankCandidates([{id:'a',votes:1},{id:'a',votes:2}]),[]);});

test('rejects padded candidate identity',()=>{assert.deepEqual(rankCandidates([{id:' a ',votes:4}]),[]);});

test('oversized candidate set fails closed',()=>{assert.deepEqual(rankCandidates(Array.from({length:10001},(_,i)=>({id:'c'+i,votes:0}))),[]);});
