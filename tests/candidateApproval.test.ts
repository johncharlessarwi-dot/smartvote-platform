import test from 'node:test';
import assert from 'node:assert/strict';
import {isEligibleCandidate} from '../src/utils/candidateApproval.ts';
test('candidateApproval integrity check',()=>{ assert.equal(isEligibleCandidate('APPROVED','president',['president']),true); });

test('invalid position lists fail closed',()=>{assert.equal(isEligibleCandidate('APPROVED','p',null as unknown as string[]),false);});
