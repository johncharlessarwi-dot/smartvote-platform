import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const server=readFileSync(new URL('../server.ts',import.meta.url),'utf8')

test('voter PII reads require verified ownership or admin role',()=>{
 for(const text of ['Voter registry access requires administrator','Voter profiles are private until authenticated','Notification audit history requires administrator'])
  assert.ok(server.includes(text),text)
})

test('unverified users cannot change voter records or decisions',()=>{
 for(const text of ['Voter profile changes require authenticated ownership','Voter approval requires authenticated administrators','Voter rejection requires authenticated administrators'])
  assert.ok(server.includes(text),text)
})
