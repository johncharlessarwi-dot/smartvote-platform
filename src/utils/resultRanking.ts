export function rankCandidates<T extends {id:string;votes:number}>(items:T[]):T[] { return [...items].sort((a,b)=>b.votes-a.votes||a.id.localeCompare(b.id)); }
