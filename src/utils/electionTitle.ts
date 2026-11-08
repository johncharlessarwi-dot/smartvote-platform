export function normalizeElectionTitle(input:string):string { if(typeof input!=='string')return ''; return input.replace(/[\x00-\x1F\x7F]/g,' ').replace(/\s+/g,' ').trim().slice(0,120); }
