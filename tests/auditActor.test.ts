import test from 'node:test';
import assert from 'node:assert/strict';
import {validAuditActor} from '../src/utils/auditActor.ts';
test('auditActor integrity check',()=>{ assert.equal(validAuditActor('user_123'),true); assert.equal(validAuditActor('../bad'),false); });
