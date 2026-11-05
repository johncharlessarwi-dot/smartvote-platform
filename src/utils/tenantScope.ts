export function sameOrganization(actorOrg:unknown,resourceOrg:unknown):boolean {
 return typeof actorOrg==='string' && typeof resourceOrg==='string' &&
  actorOrg.length>0 && actorOrg.length<=128 && actorOrg.trim()===actorOrg &&
  resourceOrg.length>0 && resourceOrg.length<=128 && resourceOrg.trim()===resourceOrg &&
  actorOrg===resourceOrg;
}
