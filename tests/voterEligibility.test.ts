import test from 'node:test';
import assert from 'node:assert/strict';
import {canVote} from '../src/utils/voterEligibility.ts';
test('voterEligibility integrity check',()=>{ assert.equal(canVote(true,false,false),true); assert.equal(canVote(true,false,true),false); });
