import test from 'node:test';
import assert from 'node:assert/strict';
import {validVoteCount} from '../src/utils/voteCount.ts';
test('voteCount integrity check',()=>{ assert.equal(validVoteCount(0),true); assert.equal(validVoteCount(-1),false); });
