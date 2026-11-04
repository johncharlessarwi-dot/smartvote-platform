export function normalizeElectionTitle(input:string):string { return input.replace(/[\x00-\x1F\x7F]/g,' ').replace(/\s+/g,' ').trim().slice(0,120); }
