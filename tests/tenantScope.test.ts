import test from 'node:test';
import assert from 'node:assert/strict';
import {sameOrganization} from '../src/utils/tenantScope.ts';
test('tenantScope integrity check',()=>{ assert.equal(sameOrganization('org1','org1'),true); assert.equal(sameOrganization('org1','org2'),false); });

test('tenant scope rejects malformed organization IDs at runtime',()=>{
 for(const value of [null,undefined,0,1,{},[], '', ' ', 'org1 ', 'x'.repeat(129)]) {
  assert.equal(sameOrganization(value,'org1'),false);
  assert.equal(sameOrganization('org1',value),false);
 }
 assert.equal(sameOrganization('org_1','org_1'),true);
});
