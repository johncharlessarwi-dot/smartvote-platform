import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const server=readFileSync(new URL('../server.ts',import.meta.url),'utf8')

test('prototype authentication cannot issue fake refresh tokens or false logout acknowledgements',()=>{
 assert.match(server,/Token refresh is unavailable until authenticated sessions/)
 assert.match(server,/Session revocation requires an authenticated session provider/)
 assert.doesNotMatch(server,/refreshedAccessTokenJwt/)
})

test('passwordless voter endpoints fail closed until identity provider is configured',()=>{
 assert.match(server,/Voter sign-in requires verified passwords/)
 assert.match(server,/Voter enrollment is unavailable until identity verification/)
 assert.doesNotMatch(server,/jwt_token_secure_/)
})
