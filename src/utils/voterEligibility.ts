export function canVote(registered:boolean,suspended:boolean,alreadyVoted:boolean):boolean { return registered===true&&suspended===false&&alreadyVoted===false; }
