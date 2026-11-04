export function validAuditActor(actorId:unknown):actorId is string { return typeof actorId==='string' && /^[A-Za-z0-9_-]{3,80}$/.test(actorId); }
