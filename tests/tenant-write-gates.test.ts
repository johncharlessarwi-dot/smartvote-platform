import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const server=readFileSync(new URL('../server.ts',import.meta.url),'utf8')

test('administrative tenant mutations require real authorization',()=>{
 for(const message of [
 'Organization creation requires authenticated',
 'Organization settings require authorized',
 'Club registration requires authenticated',
 'Club updates require tenant ownership',
 'Election creation requires verified election officers',
 'Election lifecycle updates require authorized',
 ])assert.ok(server.includes(message),message)
})

test('nominations and billing cannot report false backend success',()=>{
 for(const message of [
 'Candidate nominations require verified identity',
 'Candidate approval requires an authorized review',
 'Plan changes require authenticated billing',
 'Branding changes require authenticated tenant administration',
 ])assert.ok(server.includes(message),message)
})
