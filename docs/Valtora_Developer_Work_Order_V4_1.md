# Valtora Developer Work Order V4.1

Developer Work Order - Theme V4

Test isolation, information architecture, instrumentation and copy

Written for implementation in Cursor. Every change is file-level and specific.

0. Context in one paragraph

The name is not settled. Sattva has been ruled out as a direct conflict with Saatva, a USD 500m luxury mattress brand using the same Sanskrit root in the same category with the same made-to-order model. Continue using the brand_name theme setting - do not hard-code any name.

The site is about to run a paid test in the UK to answer one question: will someone buy a GBP 2,000+ mattress from an unknown brand, made to order, with an 8-10 week wait, paying in full at checkout. The build is good, but as it stands a failed test will not tell us WHY it failed. These changes make each variable measurable in isolation, fix the page order so more visitors reach the decision point, and add the events needed to read drop-off.

1. Split the reserve panel so price and lead time are revealed at separate steps (S1)

2. Add event instrumentation and verify UTM persistence (S2)

3. Reorder the homepage so price appears early (S3)

4. Copy changes for generic premium keywords (S4)

5. Conversion additions - anchoring, top price, exit intent (S5)

6. Pre-launch cleanup - empty placeholder proof data (S6)

1. Reserve panel - staged reveal (CRITICAL)

1.1 The problem

File: sections/size-reserve.liquid

Price (line 127), deposit terms (lines 142-163) and lead time (line 135) all render together in one panel above the reserve button. They occupy one viewport. If a visitor leaves at that point we cannot distinguish a price objection from a lead-time rejection. The test returns one blended number and no diagnosis.

1.2 What is on the site now, and why it fails the test

The live build shows selection, price, guarantees line, Continue button, the full 'Before you order' delivery paragraph and the complete order terms list - all in one right-hand panel, all in one viewport. Roughly 120 words before the button.

A visitor who leaves that panel could be rejecting the price, the 8 to 10 week wait, the terms, or the sheer volume of text. We would record a drop-off and learn nothing. The split is not a refinement - it is the difference between a test that produces an answer and one that produces a number.

1.2b Required behaviour

Stage A is a basket, not a product panel

The right panel becomes an order summary. Line items with quantity, a total, the finance figure, Continue. When a second size is added it simply grows another line - no trolley icon, no separate cart page. This handles multi-item orders and the single-item case with the same component.

One reassurance line only: 'Cancel any time before dispatch'. It reverses risk without revealing the wait, and lifts intent uniformly across price variants so it does not contaminate the price read. A paragraph here reintroduces the problem the split was built to solve.

The delivery window, the terms list and the 'Before you order' copy all move to Stage B in their entirety.

Floating basket on scroll

When the panel scrolls out of view it collapses into a single bar: item count, total, Continue. This REPLACES snippets/sticky-reserve-bar.liquid rather than running alongside it - two competing calls to action reduce both. See the reserve flow mockup for the intended treatment.

1.3 Payment model - full payment at checkout

Old model: small refundable deposit now, balance later.

New model: 100% of the price at checkout. Klarna available so the customer can still spread it.

Reason 1 - cash to fund the MOQ. 7 orders at full price fund the GBP 13,280 minimum order. Under a 50/50 split it takes roughly 13 orders before the same cash exists. With tight liquidity and a factory that will not sell fewer than 40 units, that delay is the difference between reordering and stalling.

Reason 2 - test cleanliness. Two payment events introduce a second drop-off point and a second failure mode, and contaminate the read on the first. The test exists to answer one question and must not measure two propositions at once.

Reason 3 - no balance collection. No chasing, no dunning, no orders sitting unpaid, no founder time spent on admin during the period when founder time is worth most.

What this costs: a lower conversion rate than a split payment would have delivered, and the loss of the 'we only take half' trust message. Both are accepted deliberately. See the payment model stress test for the full comparison.

All copy referring to 'deposit' must change to full payment language. Nothing on the site should suggest a partial payment.

The deposit product in Shopify becomes a standard full-price product. No partial-payment or deposit app is required, which removes a dependency.

Klarna must be available on the full amount. Klarna pays us in full immediately and carries the credit risk, so the customer can spread the cost without us financing it.

Required controls when taking full payment

Taking GBP 2,149 for goods delivered weeks later creates real obligations. These are ordinary mitigations, not reasons to avoid the model.

State the delivery window precisely, always as a window and never a single date.

Name the remedy in the same sentence as the window: if we are going to miss it we tell them before the date and they can cancel for a full refund.

Deliver the first orders from existing stock inside 4 weeks. Beating an 8-10 week promise by 5 weeks is how the first genuine reviews are earned.

Cancel-any-time-before-dispatch, honoured without friction. This replaces the trust that a split payment would have provided, and costs nothing while the mattress is a standard size from a batch.

Communicate at every stage: order confirmed, in production, arrived in UK, delivery booked. Silence is what turns a delay into a chargeback.

Do not spend customer money on marketing before dispatch. Prepaid customers are unsecured creditors if things go wrong.

Monitor abandonment at the payment step specifically. If people reach checkout and stop there - rather than dropping at the price or the delivery window - that is the evidence that asking for the full amount is the blocker, and a 50/50 split should be reconsidered. The instrumentation in section 2 is what makes this readable.

BNPL - two things to confirm before launch

1. Check the approval limit. Klarna Pay in 3 and similar short-term products are approved per customer and often cap below GBP 2,149. Some buyers will be declined at our price point, especially on a super king. Confirm with Klarna what is available at this order value and enable a longer financing option as a fallback. A silent decline at checkout is a lost sale we never see the reason for.

2. Show the monthly figure in stage A, beneath the headline price. Not at checkout. The affordability answer has to arrive before the price shocks anyone. Simba shows 'from GBP 51.03/month' directly next to the price for exactly this reason. Placement: immediately under the price in the reserve panel, same visual weight as a subheading.

Klarna Pay in 3 splits the cost further than a 50/50 model would (roughly GBP 716 now versus GBP 1,075) and we are paid in full immediately either way. Affordability is therefore fully solved by BNPL.

The only thing a 50/50 split would add is a trust signal, and that is already covered by cancel-any-time-before-dispatch, the 100-night trial, the 15-year warranty, company details in the footer, and a delivery window with a stated remedy.

1.5 Payment mode toggle - build now, use later

We are launching on full payment. The 50/50 model may still be needed if the funnel shows a specific problem at the payment step, or once we are through stock and selling on the 8-10 week made-to-order timeline where a split payment restores chargeback protection. Build the toggle now so switching is a setting change rather than a development cycle.

Setting

"type": "select",

"id": "payment_mode",

"label": "Payment mode",

"info": "Full = 100% at checkout (current). Split = 50% now, balance before dispatch.",

"options": [

{ "value": "full",  "label": "Full payment at checkout" },

{ "value": "split", "label": "50% now, 50% before dispatch" }

],

"default": "full"

},

{

"type": "range",

"id": "split_percent",

"label": "First payment percentage",

"min": 25, "max": 75, "step": 5, "unit": "%",

"default": 50

}

What the toggle must change

Requirements

All payment-mode-dependent copy lives in schema settings with both variants authored, so switching does not require rewriting content. Do not hard-code either version.

A single Liquid variable derived from the setting drives every conditional. Do not scatter the check across sections.

When mode = split, checkout must charge only the first percentage, and the order must carry a balance_due line item or metafield so it is visible in admin and in exports.

Balance collection uses a second checkout or Shopify draft-order payment link. Klarna must be available on both payments. No custom payment infrastructure.

Add an admin view or saved order filter showing all orders with an outstanding balance. Nothing dispatches unpaid.

Tracking must remain comparable across modes: begin_checkout and purchase fire identically in both, with payment_mode as an event parameter so periods can be compared like for like.

Switching the toggle must not break existing orders. Orders already placed retain the terms they were sold under.

Testing before any switch

Place a real low-value order in split mode, take the balance, then refund both, before the toggle is used in production.

Confirm the order confirmation email renders the correct variant in both modes.

Confirm Klarna appears on both the first payment and the balance link.

Switch to split if EITHER: checkout abandonment exceeds roughly 75% with healthy upstream behaviour and exit-intent responses naming payment, OR we are through stock and delivering on the 8-10 week timeline, where the balance payment restores chargeback protection.

Do not switch on instinct. A statistically valid A/B on payment model would cost GBP 20k-238k in media, which is why this is a sequential decision read from the funnel rather than a test.

1.6 Implementation

Wrap the existing reserve-panel content from the deposit line (line 130) downward in a container with data-reserve-stage-b, hidden by default via a class such as is-hidden.

Move the lead-time paragraph (line 135, currently rendering settings.lead_time_window) into stage B. Remove it from the default panel.

Move the deposit-terms block (lines 142-163) into stage B. It remains always-visible within stage B, which satisfies the S15.1.2 requirement - the rule is that terms are not hidden at the point of payment, not that they must precede intent.

Change the reserve button into a two-stage control. First click: preventDefault, reveal stage B, fire reserve_intent and view_leadtime, scroll stage B into view, move focus to it. The submit button inside stage B performs the actual form submission and fires begin_checkout.

Add a new section setting so the placement can itself be A/B tested (see below). When set to inline, render lead time in stage A as it is today.

New schema settings for size-reserve.liquid

"type": "select",

"id": "leadtime_placement",

"label": "Lead time placement",

"options": [

{ "value": "staged", "label": "Stage B - after reserve click (default, for testing)" },

{ "value": "inline", "label": "Stage A - alongside price" },

{ "value": "vague",  "label": "Stage B, no specific weeks stated" }

],

"default": "staged"

},

{

"type": "text",

"id": "leadtime_vague_text",

"label": "Lead time text when placement = vague",

"default": "Made to order. We confirm your dispatch date before the balance is due."

},

{

"type": "text",

"id": "stage_b_heading",

"label": "Stage B heading",

"default": "Before you reserve"

}

This is progressive disclosure, not concealment. The lead time must remain discoverable: keep it in the FAQ, on the delivery page, and in the footer. It simply must not share a viewport with the price. Revealing it once intent exists is cleaner test design and better selling.

Accessibility

Stage B must be focusable and announced. Use aria-expanded on the reserve button and aria-live=polite on the stage B container.

If JavaScript is unavailable, render both stages (progressive enhancement) so the page still functions.

1b. Two decisions outstanding on the live build

Prices have moved

The live site shows GBP 1,999 / 2,499 / 2,999 / 3,499. The brochure and the financial model carry GBP 1,549 / 1,999 / 2,499 / 2,899. Both need aligning to whichever is final, and the model's contribution figures shift with it.

Super King is marked NOT YET AVAILABLE

It is the highest-value size and it is switched off. A 40-unit MOQ applies whichever size is ordered, so consider making it orderable on a stated longer lead time rather than turning the revenue away. If it stays off, remove the price - displaying a price for something nobody can buy is friction without purpose.

2. Instrumentation

2.1 Current state

File: assets/theme.js lines 684-688

The only conversion tracking in the build is fbq AddToCart and ttq AddToCart on reserve submit. There is no GA4, no scroll tracking, and no separation between intent and completion. A test run on this instrumentation produces spend, not answers.

2.2 Events to implement

Implementation notes

Send every event to GA4, Meta and TikTok with a single wrapper function so nothing drifts out of sync. GA4 is currently missing from snippets/tracking-pixels.liquid and must be added.

Use IntersectionObserver for the visibility-based events, with a 1 second dwell threshold so scroll-past does not register as a view.

Include market, price_set, size and leadtime_placement as event parameters so results can be segmented without extra work.

Example wrapper

params = params || {};

params.market = document.body.dataset.market;

params.price_set = document.body.dataset.priceSet;

if (typeof gtag === 'function') gtag('event', name, params);

if (typeof fbq === 'function') fbq('trackCustom', name, params);

if (typeof ttq !== 'undefined' && ttq.track) ttq.track(name, params);

}

2.3 The two ratios the test exists to produce

Lead-time rejection rate = 1 - (begin_checkout / view_leadtime)

Without the staged split these collapse into a single unreadable figure. This is the entire justification for section 1.

2.4 Also required

Microsoft Clarity - free, and session recordings will show where people stall at low sample sizes. Add to layout/theme.liquid.

Scroll-depth events per named section, not page-level percentages.

Verify UTM persistence end to end. assets/utm-persistence.js writes to cart attributes - confirm those attributes survive the deposit app and appear on the order record in the Shopify admin export. This is the most likely silent failure in the whole setup. Test with a real GBP 1 order before launch.

3. Information architecture

3.1 The problem

File: templates/index.json

Price currently sits at position 17 of 19. A visitor passes sixteen sections before learning the cost. Commercially this raises bounce among qualified buyers; for the test it means very few visitors reach the price gate, which is where the cleanest signal lives. Separately, press-logos sits at position 3 and the proof cluster at 10-12, all before desire has been built.

3.2 Required order

size-reserve must be instantiable twice on one page. Ensure IDs and data attributes are unique per instance, and that view_price fires only once per session regardless of which instance is seen first.

Merge press-logos and awards into a single section instance to avoid four separate proof blocks competing.

4. Copy changes - generic premium keywords

4.1 Why the copy must change

The first test will run on generic premium search terms (luxury mattress uk, best mattress uk, premium hybrid mattress), NOT on cooling or back-pain terms. Two reasons: a feature-specific keyword contaminates the read, and the cooling claim has no lab substantiation yet. Generic premium terms make ad-to-page mismatch impossible.

The current hero opens on the swap system, which has essentially zero search volume. The keyword sets the entry promise; the swap system is the reason to choose us once we are here. The hero must therefore lead on premium and made-to-order, with the swap system immediately after.

4.2 Hero - sections/hero.liquid schema defaults

'See sizes and prices' outperforms 'Reserve yours' as a first action because it promises information rather than commitment, and it sends people directly to the price gate - which is exactly where we need them for the test.

4.3 Assurance line must be market-aware

The current default hard-codes AED 200. Add market conditional logic so UK visitors see GBP 50.

assign assurance = 'Cancel any time before dispatch'

if market == 'GB'

assign finance = 'Spread the cost with Klarna'

else

assign finance = 'Spread the cost with Tabby or Tamara'

endif

-%}

4.4 Big idea - sections/big-idea.liquid

Keep the existing heading and body. It follows the hero well and carries the differentiator. No change required.

4.5 Offer section - add the anchor and the top price

New setting: market_anchor

Nothing on the page establishes what a premium mattress costs before our price appears. A factual comparison makes the number land as reasonable rather than arbitrary.

GBP 1,399 to GBP 2,399. Ours is made to order, and the comfort top is replaceable."

Default (AE): "Premium mattresses in the UAE typically run AED 6,000 to AED 15,000.

Ours is made to order, and the comfort top is replaceable."

New setting: replacement_top_price

The strongest long-term argument is 'refresh the layer instead of replacing the mattress'. That argument only bites when the visitor can see the numbers side by side. Add to the swap-explainer or offer section:

AE: "A replacement comfort top is AED 1,200. A new mattress is not."

4.6 Reserve panel copy - stage B

Delivery window (staged, default):

"Made to order and delivered in 8 to 10 weeks. Most orders arrive sooner.

Your mattress is built after you order it, flown to the UK, and delivered

into your room by a two-person team. If we are going to miss that window

we will tell you before the date, and you can cancel for a full refund."

Delivery window (vague variant, for A/B):

"Made to order. We confirm your delivery date before dispatch."

Order terms:

- Cancel any time before dispatch for a full refund, no questions asked.

- Spread the cost with Klarna at no extra charge.

- Refunds returned to the original payment method within 5-10 business days.

- 100 nights to change your mind once it arrives.

- 15-year warranty on the spring core.

4.7 FAQ additions

Add these entries. They pre-empt the objections most likely to surface in the test.

5. Conversion additions

5.1 Surface guarantees inside the reserve panel

Trial, warranty and the cancellation terms currently live in a separate offer section that sits after the first reserve point in the new order. Repeat the three key guarantees as a compact line inside the reserve panel stage A, directly beneath the price. Risk reversal must be present at the moment of decision.

5.2 Single dominant CTA above the fold

Check that snippets/sticky-reserve-bar.liquid does not compete with the in-hero CTA on mobile. Two competing actions reduce both. Suppress the sticky bar until the hero CTA has scrolled out of view.

5.3 Exit-intent capture

At test volumes, qualitative signal outweighs the conversion rate. Add a single-question exit-intent prompt on desktop and a scroll-up trigger on mobile.

Options:  Price  |  Delivery time  |  Not sure it suits me  |  Just browsing

Store the answer against the session and expose it in the admin export.

5.4 Monthly price display

Show the BNPL monthly figure directly beneath the headline price in stage A. Klarna for GB, Tabby and Tamara for AE. A GBP 2,499 price reads very differently as 'or GBP 208/month'.

6. Pre-launch cleanup

assets/reviews.json contains 500 placeholder reviews with names, dates and verified flags. Empty this file or gate the social-proof section off until real reviews exist.

Press logo assets (Financial Times, The Times, Dezeen, Wallpaper, Evening Standard, Gulf News, The National, Arabian Business, Time Out Dubai, Ideal Home) must not render until those placements are real. Keep the section, empty the blocks.

Awards section blocks must be empty until awards exist.

OEKO-TEX certification claim in reviews.json - only display if the certificate exists and the number can be shown.

Keep every section in place and configurable. The scaffolding is correct and will be needed - only the placeholder content comes out.

The honest empty state already specified ('Reviews will appear here as the first allocation settles in') should render when the data is empty. Confirm this path works.

6b. Delivery window - the number to use

The previously stated 6-7 weeks was factory to UK arrival. It did not include customs, inbound handling, or final mile. The corrected end-to-end timeline is below.

We currently hold 2 units per size, so the first 8-10 orders can be delivered inside 4 weeks against an 8-10 week promise. That over-delivery is how the first genuine reviews get earned. The supplier has already flagged that freight timing is unstable.

UK law: the default delivery period is 30 days unless a longer period is expressly agreed. A longer window is legitimate but must be clear and agreed at the point of sale, not buried in terms.

Frame it as furniture, not as a mattress. Against Simba and Emma (next day) 8-10 weeks is catastrophic. Against a made-to-order sofa from DFS or Loaf (8-14 weeks) it is completely normal. The copy must actively place us in the crafted-furniture category so buyers apply the right comparison.

Set settings.lead_time_window to '8 to 10 weeks'.

Show the window at stage B, in the FAQ, on the delivery page, and in the order confirmation email.

Do not state a single date anywhere. Always a window.

"Made to order and delivered in 8 to 10 weeks. Most orders arrive sooner. If we are going to miss that window we will tell you before the date, and you can cancel for a full refund."

A stated period creates an obligation under the Consumer Rights Act. Naming the remedy is both the legal position and better selling - it reads as confidence rather than hedging.

7. Acceptance criteria

Reserve panel stage A shows price with no delivery window visible anywhere in the viewport.

Clicking continue reveals stage B with the delivery window and cancellation terms, and fires reserve_intent then view_leadtime.

leadtime_placement can be switched to inline or vague from the theme editor without code changes.

All seven events fire correctly to GA4, Meta and TikTok, verified in each platform's debug view.

UTM parameters appear on the order record in the Shopify admin export after a real test order.

Checkout takes the full price of the selected size, with Klarna available on the full amount.

Delivery window reads 8 to 10 weeks everywhere it appears, and never as a single date.

Homepage order matches section 3, with size-reserve appearing at both position 5 and 15, and view_price firing once per session.

Hero copy leads on premium and made-to-order, not the swap system.

Price, currency, finance provider and anchor text all switch correctly by market.

Exit-intent prompt fires and stores the response.

reviews.json, press logos and awards render nothing until real content is added, and the honest empty state displays.

Page loads under 2.5s LCP on mobile - the hero must not be lazy-loaded.
