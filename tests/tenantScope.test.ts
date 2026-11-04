import test from 'node:test';
import assert from 'node:assert/strict';
import {sameOrganization} from '../src/utils/tenantScope.ts';
test('tenantScope integrity check',()=>{ assert.equal(sameOrganization('org1','org1'),true); assert.equal(sameOrganization('org1','org2'),false); });
