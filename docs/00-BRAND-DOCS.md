# Brand documentation

Three files. Read them in order. Do not work from any other voice or copy document in the repository.

---

## The set

| File | What it holds | Changes | Owner |
|---|---|---|---|
| `00-README.md` | This file. What supersedes what | Rarely | Ben |
| `01-BRAND-VOICE.md` | Wording rules that hold regardless of business state | Rarely | Ben, with Claude |
| `02-FACTS-AND-CLAIMS.md` | What is currently true, contracted and substantiated | Whenever a supplier, carrier or certifier answers | Ben |
| `numa-change-log.md` | The current build brief. Site changes to execute | Per release | Ben, with Claude |

---

## Delete these

These are superseded in full. Having more than one live voice document is what caused correct site copy to be flagged as non-compliant, and correct claims to be pulled. Remove them rather than archiving them in place.

| File | Reason |
|---|---|
| `numa-tone-of-voice.md` | Merged into `01-BRAND-VOICE.md` |
| `13-BRAND-VOICE.md` | Merged into `01-BRAND-VOICE.md`. Its sections 7 and 8 mixed stale facts into a rules document and must not be reused |
| `numa-decisions.md` section 0 | The copy standard is now section 9 of `01-BRAND-VOICE.md`. The rest of the file is decisions, not voice, and stays |
| Voice sections of `brand-guidelines.html`, `10-BRAND-GUIDELINES-DEV.md`, `6-COPY-SPEC.md` | Superseded. The visual and development guidance in those files stands |

---

## Why the split

Rules and facts were previously kept in one document. Facts go stale weekly. Rules almost never change. Mixing them meant a fact that had moved on read as a permanent rule, and copy that was correct got rewritten on the strength of it.

So the test for which file something belongs in:

**Would this still be true if a supplier or carrier changed tomorrow?**

Yes, it is a rule. `01-BRAND-VOICE.md`.
No, it is a fact. `02-FACTS-AND-CLAIMS.md`.

`Never quantify a performance claim without substantiation` is a rule. `Wire gauge is 1.8mm and 2.0mm` is a fact. `Room-of-choice delivery is contracted` is a fact, and it was living in the rules file, which is exactly the failure this split prevents.

---

## Resolving a conflict

1. **`numa-change-log.md` section 11** records deliberate changes to the voice. If the item is listed there, the change log wins.
2. Otherwise **`01-BRAND-VOICE.md`** wins on wording.
3. **`02-FACTS-AND-CLAIMS.md`** wins on whether a thing is true or may be said.
4. Rule 1 of the voice document outranks every other rule in it. A line that is on-voice but has to be decoded is not finished.

---

## Before writing any copy

Check the claim against `02-FACTS-AND-CLAIMS.md`. A row marked **Pending** does not go on the site, in an ad, or in a support reply, in any form, until it moves to **Confirmed**.

## Before releasing

Re-read the register. If nothing has been reviewed in a month, that is a signal the file is drifting, not that nothing changed.
