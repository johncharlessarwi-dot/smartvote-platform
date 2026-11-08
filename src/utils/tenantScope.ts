export function sameOrganization(actorOrg:unknown,resourceOrg:unknown):boolean {
 return typeof actorOrg==='string' && typeof resourceOrg==='string' &&
  actorOrg.length>0 && actorOrg.length<=128 && actorOrg.trim()===actorOrg &&
  resourceOrg.length>0 && resourceOrg.length<=128 && resourceOrg.trim()===resourceOrg &&
  !/[\x00-\x1F\x7F]/.test(actorOrg) && !/[\x00-\x1F\x7F]/.test(resourceOrg) && !/[\u200B-\u200F\u202A-\u202E\u2066-\u2069]/.test(actorOrg) && actorOrg===resourceOrg;
}
