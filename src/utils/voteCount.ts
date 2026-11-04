export function validVoteCount(votes:unknown):votes is number { return typeof votes==='number'&&Number.isSafeInteger(votes)&&votes>=0; }
