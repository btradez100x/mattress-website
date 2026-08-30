# Component Specification

The foundations - colour, type, space, motion - are in `10-BRAND-GUIDELINES-DEV.md`. This is everything below that: which colour on which ground, every component, every state.

**Nothing here is a suggestion.** If a value is not here, ask rather than choose.

---

## 1. Correction to the existing guidelines

`10-BRAND-GUIDELINES-DEV.md` states Ember on Snow as 4.8:1 and permits it above 16px.

**The true ratio is 4.4:1.** That fails AA for normal text. Ember may be used only for:

- Large text - 18.66px regular or 14px bold and above
- Non-text elements - borders, indicators, rules - which need 3:1

**Ember is never a body text colour on any ground.**

---

## 2. Foreground on background - the complete matrix

Every permitted combination. Anything not listed is forbidden.

| Text | on Snow | on Bone | on Graphite | on Carbon |
|---|---|---|---|---|
| **Carbon** | 15.8 AAA | 13.3 AAA | Forbidden | Forbidden |
| **Graphite** | 10.3 AAA | 8.7 AAA | Forbidden | Forbidden |
| **Snow** | Forbidden | Forbidden | 10.3 AAA | 15.8 AAA |
| **Bone** | Forbidden | Forbidden | 8.7 AAA | 13.3 AAA |
| **Ember** | 4.4 - large only | 3.7 - large only | Forbidden | 3.6 - large only |

### The working rules

| Ground | Primary text | Secondary text | Rules and borders |
|---|---|---|---|
| Snow | Carbon | Graphite | Hair `#D6D2CA` |
| Bone | Carbon | Graphite | Hair |
| Graphite | Snow | Bone | HairDark `#2E2E30` |
| Carbon | Snow | Bone | HairDark |

**Never** Graphite text on Graphite ground, or Bone on Bone. Both fail at 1.0.

---

## 3. Breakpoints

```
sm    640px
md    860px
lg    1024px
xl    1240px
```

Mobile first. Design at 375px, then 860px, then 1240px. The 640px and 1024px breakpoints exist for adjustment, not for new layouts.

**Max content width: 1240px.** Text blocks never exceed 75 characters regardless of container width.

---

## 4. Measure - maximum text widths

| Content | Max width |
|---|---|
| Body paragraph | 66ch |
| Lede paragraph | 56ch |
| Display heading | 20ch |
| H2 | 24ch |
| Caption, label | 48ch |
| Table cell | No limit, but wrap rather than truncate |

Never let a paragraph run the full width of a 1240px container.

---

## 5. Vertical rhythm

| Relationship | Space |
|---|---|
| Section to section | 128px desktop, 72px mobile |
| Heading to its body | 14px |
| Paragraph to paragraph | 12px |
| Body to a subheading below it | 34px |
| Label to the element it labels | 8px |
| Related items in a group | 8px |
| Unrelated items | 24px |
| Above and below a hairline rule | 22px |

**The rule:** space above a heading is always larger than the space below it. A heading belongs to what follows, not what precedes.

---

## 6. Buttons

### 6.1 Primary

| Property | Value |
|---|---|
| Background | Carbon |
| Text | Snow |
| Font size | 15px |
| Font weight | 600 |
| Padding | 15px vertical, 24px horizontal |
| Minimum height | 48px |
| Border radius | 0 |
| Border | None |
| Width | Full width in a panel, auto inline |

| State | Change |
|---|---|
| Hover | Background `#000000`. 120ms |
| Active | Background `#000000`, no transform, no scale |
| Focus visible | 2px Ember outline, 4px offset |
| Disabled | Background Hair, text Graphite, cursor default. No opacity change |
| Loading | Text replaced with a label, never a spinner. Button stays the same size |

### 6.2 Secondary

| Property | Value |
|---|---|
| Background | Transparent |
| Text | Carbon |
| Border | 1px Carbon |
| Everything else | As primary |

| State | Change |
|---|---|
| Hover | Background Carbon, text Snow |
| Focus visible | As primary |

### 6.3 On a dark ground
Invert. Background Snow, text Carbon. Hover to Bone.

### 6.4 Never
Rounded corners. Drop shadows. Gradients. Icons inside buttons unless the icon is the entire button. Scale or lift on hover. More than one primary button in a view.

---

## 7. Links

### 7.1 In body copy

| Property | Value |
|---|---|
| Colour | Inherits the text colour |
| Decoration | Underline, 1px, offset 3px |
| Underline colour | Hair on light grounds, HairDark on dark |

| State | Change |
|---|---|
| Hover | Underline colour becomes the text colour. 120ms |
| Focus visible | 2px Ember outline, 3px offset |

### 7.2 Standalone

| Property | Value |
|---|---|
| Font size | 15px |
| Weight | 500 |
| Decoration | Underline, 1px, offset 4px |
| No arrow, no chevron | The underline is the affordance |

### 7.3 Never
Ember as a link colour - it fails contrast for body text. Links that are distinguished by colour alone. Underlines removed on hover.

---

## 8. Form fields

### 8.1 Text input, select, textarea

| Property | Value |
|---|---|
| Background | `#FFFFFF` on Snow, Snow on Bone |
| Border | 1px Hair |
| Border radius | 0 |
| Padding | 14px vertical, 16px horizontal |
| Minimum height | 48px |
| Font size | 16px - never smaller, iOS zooms below 16px |
| Text colour | Carbon |
| Placeholder | Graphite |

| State | Change |
|---|---|
| Hover | Border Graphite |
| Focus | Border 1.5px Carbon, plus 2px Ember outline at 2px offset |
| Filled | No visual change |
| Error | Border 1.5px `#B04A3A`, message below in the same colour at 14px |
| Disabled | Background Bone, border Hair, text Graphite |

### 8.2 Labels
Above the field, 8px gap, 14px, weight 500, Carbon. **Never a placeholder as a label.**

### 8.3 Help text
Below the field, 6px gap, 13px, Graphite.

### 8.4 Radio and checkbox

| Property | Value |
|---|---|
| Size | 18px |
| Border | 1.5px Graphite |
| Radio radius | 50% |
| Checkbox radius | 2px - the only permitted radius on the site |
| Checked | Background Carbon, border Carbon |
| Focus visible | 2px Ember outline, 3px offset |
| Touch target | 44px minimum, achieved with padding on the label |

---

## 9. Selection cards - the size and firmness options

| Property | Value |
|---|---|
| Background | Bone |
| Border | 1px Hair |
| Padding | 15px 18px |
| Gap between cards | 8px |
| Minimum height | 64px |

| State | Change |
|---|---|
| Hover | Border Graphite. 120ms |
| Selected | Background `#FFFFFF`, border 1.5px Carbon |
| Focus visible | 2px Ember outline, 3px offset |
| Unavailable | 50% opacity, cursor default, reason shown in 12px Graphite |

**The whole card is the click target, not just the radio.**

---

## 10. Panels and surfaces

| Property | Value |
|---|---|
| Background | `#FFFFFF` on Snow grounds, Graphite on Carbon grounds |
| Border | 1px Hair or HairDark |
| Radius | 0 |
| Padding | 24px |
| Shadow | **None, ever** |

**There is no elevation system.** Depth is expressed through ground alternation and hairline rules, never through shadow. A shadow on this site is a bug.

---

## 11. Rules and dividers

| Use | Weight | Colour |
|---|---|---|
| Between table rows | 1px | Hair / HairDark |
| Above a total or summary | 1px | Hair / HairDark |
| Section divider on the same ground | 1px | Hair / HairDark |
| The Line - between grounds | The ground change itself | No rule needed |
| Under an eyebrow label | 1px, 40px wide | Ember |

**Never** a 2px rule. Never a dotted or dashed rule except to indicate a zip line in a diagram.

---

## 12. Tables

| Property | Value |
|---|---|
| Header | 9.5px, Geist Mono, +0.2em tracking, uppercase, Graphite |
| Header border | 1px Hair below |
| Cell padding | 14px vertical, 24px right, 0 left |
| Row border | 1px Hair, none on the last row |
| Numbers | Tabular figures, always |
| First column | Carbon, weight 500 |
| Other columns | Graphite |

**No zebra striping.** No vertical rules. No cell backgrounds.

---

## 13. Focus states - non-negotiable

Every interactive element:

```
outline: 2px solid Ember
outline-offset: 3px
```

| Rule |
|---|
| Never `outline: none` without an equivalent replacement |
| Use `:focus-visible`, not `:focus`, so mouse clicks do not show a ring |
| The ring is never clipped by `overflow: hidden` on a parent |
| Ember at 3.6:1 against Carbon and 4.4:1 against Snow passes the 3:1 requirement for non-text on all grounds |

---

## 14. Icons

| Property | Value |
|---|---|
| Style | Outline, never filled |
| Stroke | 1.5px |
| Size | 16px inline, 20px standalone, 24px maximum |
| Colour | Inherits the text colour |
| Corners | Square joins, not rounded |

**Icons never appear alone as a control.** Always with a label, or with an accessible name.

---

## 15. Touch targets

| Requirement |
|---|
| Minimum 44 by 44px for anything tappable |
| Achieved with padding, not by enlarging the visual element |
| Minimum 8px between adjacent targets |

---

## 16. What is forbidden across the whole site

| Never | Why |
|---|---|
| Border radius above 2px | Only checkboxes get 2px. Everything else is square |
| Any box shadow | There is no elevation system |
| Gradients | Flat grounds only |
| Scale or lift on hover | Nothing bounces or grows |
| Colour as the only differentiator | Fails accessibility |
| Ember as body text | Fails contrast at 4.4:1 |
| Placeholder text as a label | Disappears on input |
| Spinners | Use a text label |
| Icon-only controls without an accessible name | |
| Fonts below 16px in a form field | iOS zooms |
| More than one primary button per view | |

---

## 17. Check before shipping

1. Every text and background pair appears in the matrix in section 2.
2. Ember appears as text only at 18.66px regular or 14px bold and above.
3. No border radius above 2px anywhere.
4. No box shadow anywhere.
5. Every interactive element has a visible focus ring using `:focus-visible`.
6. Every tappable element is at least 44 by 44px.
7. Form fields are at least 16px.
8. No paragraph exceeds 66 characters of measure.
9. Space above a heading exceeds space below it.
10. Tabular figures on every number.
11. No spinner, no gradient, no scale on hover.
12. One primary button per view.
