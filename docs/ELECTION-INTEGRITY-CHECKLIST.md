# Election integrity and auditability checklist

This checklist sets expectations for secure election workflows. It is not a certification or a claim that every control is implemented.

## Before an election
- Publish eligibility, opening and closing times, candidate lists, and voting rules.
- Verify voter registration and prevent duplicate eligibility records.
- Separate administrative duties for voter management, election configuration, and result approval.
- Test backup and recovery procedures in a non-production environment.
- Freeze and record the approved election configuration before voting opens.

## During voting
- Enforce one authorized ballot per eligible voter using server-side controls.
- Protect ballot secrecy; keep identity and ballot choice data separated wherever the design permits.
- Record security-relevant administrative actions without logging ballot selections.
- Monitor unusual authentication failures and traffic spikes.
- Do not expose interim results unless election rules explicitly permit it.

## Closing and results
- Close voting using a controlled, auditable action.
- Reconcile eligible voters, accepted ballots, rejected attempts, and system totals.
- Require independent review of result calculations and exception handling.
- Preserve signed or otherwise tamper-evident result artifacts and audit evidence.
- Publish results only after authorized approval.

## Incident response
Pause affected operations when ballot integrity or secrecy may be compromised. Preserve evidence, notify election officials, and document the decision to resume or restart.