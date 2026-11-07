import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const ui=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8')

test('ballot simulation cannot masquerade as an official cryptographic receipt',()=>{
 assert.match(ui,/SV-DEMO-/)
 assert.match(ui,/NOT a real vote or cryptographic receipt/)
 assert.match(ui,/DEMO_BALLOT/)
 assert.doesNotMatch(ui,/Ballot successfully cast! Cryptographic receipt/)
})

test('browser-only registration does not claim verified voting rights',()=>{
 assert.match(ui,/Identity verification and real voting access are NOT active/)
 assert.match(ui,/No official approval was granted/)
})
