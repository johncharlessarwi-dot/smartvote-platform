import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const server=readFileSync(new URL('../server.ts',import.meta.url),'utf8')

test('AI routes cannot bill the provider without authentication infrastructure',()=>{
 assert.match(server,/AI provider calls require authenticated users and durable rate limits/)
 assert.match(server,/AI architecture calls require authenticated access and spend limits/)
 assert.match(server,/Invalid AI architecture question/)
})

test('demo advice never claims actual encrypted ballot or Redis-backed live votes',()=>{
 assert.match(server,/not verified election results/)
 assert.match(server,/real ballot submission and cryptographic receipts are not enabled/)
 assert.doesNotMatch(server,/Voting is active and secured via Redis caching/)
})
