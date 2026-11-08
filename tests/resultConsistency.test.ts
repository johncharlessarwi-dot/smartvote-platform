import test from 'node:test';
import assert from 'node:assert/strict';
import {tallyMatchesTotal} from '../src/utils/resultConsistency.ts';
test('resultConsistency integrity check',()=>{ assert.equal(tallyMatchesTotal([2,3],5),true); assert.equal(tallyMatchesTotal([2,3],6),false); });

test('rejects malformed tally shape',()=>{assert.equal(tallyMatchesTotal(null as unknown as number[],0),false);});

test('oversized tally list rejected',()=>{assert.equal(tallyMatchesTotal(Array(10001).fill(0),0),false);});
