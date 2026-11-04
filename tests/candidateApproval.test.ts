import test from 'node:test';
import assert from 'node:assert/strict';
import {isEligibleCandidate} from '../src/utils/candidateApproval.ts';
test('candidateApproval integrity check',()=>{ assert.equal(isEligibleCandidate('APPROVED','president',['president']),true); });
