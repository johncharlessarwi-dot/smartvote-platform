export function sameOrganization(actorOrg:unknown,resourceOrg:unknown):boolean {
 return typeof actorOrg==='string' && typeof resourceOrg==='string' &&
  actorOrg.length>0 && actorOrg.length<=128 && actorOrg.trim()===actorOrg &&
  resourceOrg.length>0 && resourceOrg.length<=128 && resourceOrg.trim()===resourceOrg &&
  !/[\x00-\x1F\x7F]/.test(actorOrg) && !/[\x00-\x1F\x7F]/.test(resourceOrg) && actorOrg===resourceOrg;
}
