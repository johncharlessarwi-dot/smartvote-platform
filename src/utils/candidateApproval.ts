export function isEligibleCandidate(status:string,positionId:string,electionPositionIds:string[]):boolean { return status==='APPROVED'&&!!positionId&&electionPositionIds.includes(positionId); }
