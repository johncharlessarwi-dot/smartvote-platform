import test from 'node:test';
import assert from 'node:assert/strict';
import {rankCandidates} from '../src/utils/resultRanking.ts';
test('resultRanking integrity check',()=>{ assert.deepEqual(rankCandidates([{id:'b',votes:2},{id:'a',votes:3}]).map(x=>x.id),['a','b']); });

test('rejects invalid candidate vote totals',()=>{assert.deepEqual(rankCandidates([{id:'a',votes:NaN}]),[]);});
