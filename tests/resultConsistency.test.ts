import test from 'node:test';
import assert from 'node:assert/strict';
import {tallyMatchesTotal} from '../src/utils/resultConsistency.ts';
test('resultConsistency integrity check',()=>{ assert.equal(tallyMatchesTotal([2,3],5),true); assert.equal(tallyMatchesTotal([2,3],6),false); });
