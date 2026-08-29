#!/usr/bin/env python3
"""Finish Numa preview pages: about, recycling, landing copy, policies, cart, homepage."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "preview" / "pages"
INDEX = ROOT / "preview" / "index.html"

OUTCOME_DELIVERY = """
      <section class="section lp-section section--surface" id="outcome" data-reveal data-section-ground="surface">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head" style="text-align:center">
            <h2>A bed that becomes yours,<br>and stays that way.</h2>
          </div>
          <div class="lp-outcome">
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">You do not choose the feel. You discover it.</p>
              <p class="lp-outcome__desc">Sleep on it for a month. Tell us how it should feel. We make it that way.</p>
            </div>
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">It arrives finished.</p>
              <p class="lp-outcome__desc">Concierged. Room of your choice. Unrolled onto your bed. The old one leaves with it.</p>
            </div>
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">It stays right for twenty five years.</p>
              <p class="lp-outcome__desc">The part that softens renews. The part that lasts, lasts.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="section lp-section section--bg" id="delivery" data-reveal data-section-ground="bg">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head">
            <h2>It arrives compressed.<br>We do not leave it that way.</h2>
            <p class="section__lede">Roll packing gets it up the stairs. It is not how it should be left.</p>
          </div>
          <div class="lp-tiers">
            <div class="lp-tier lp-tier--pick">
              <div>
                <span class="lp-tier__tag">Included with every mattress</span>
                <p class="lp-tier__name">Concierge unpacking</p>
                <p class="lp-tier__desc">Concierged. Room of your choice. Unboxed, unrolled, positioned. The packaging leaves with it. So does the old one.</p>
              </div>
              <span class="lp-tier__price">Complimentary</span>
            </div>
            <div class="lp-tier">
              <div>
                <p class="lp-tier__name">Old mattress removal and recycling</p>
                <p class="lp-tier__desc">Taken away on the same visit. Nothing in the hall, nothing to arrange.</p>
              </div>
              <span class="lp-tier__price">Complimentary</span>
            </div>
          </div>
          <div class="lp-svc">
            <div>
              <h3>Unrolled on the bed</h3>
              <p>It settles evenly.</p>
            </div>
            <div>
              <h3>Nothing left behind</h3>
              <p>Carton, plastic, wrap. All of it leaves with it.</p>
            </div>
            <div>
              <h3>A window agreed in advance</h3>
              <p>Notification on the day.</p>
            </div>
          </div>
        </div>
      </section>
"""

PROMISE_STD = (
    '<div class="lp-promise"><p><strong>30-day sleep trial.</strong> If the feel is not right, we will make you a new comfort layer to your preference, with our compliments. Worth <span data-layer-price-text></span>. If that still does not settle it, we collect the mattress and refund you in full.</p></div>'
)
PROMISE_EMP = (
    '<div class="lp-promise"><p><strong>Emperor comfort promise.</strong> If the feel is not right, we will make you a new comfort layer to your preference, with our compliments. Worth <span data-layer-price-text></span>. Emperor is made to order at 200 x 200cm and is not covered by the 30-day return trial. Your statutory cancellation rights are unaffected.</p></div>'
)

ABOUT_MAIN = """
    <main>
      <section class="section lp-section lp-section--hero section--bg" data-lp-page data-lp-variant="F-about" data-reveal data-section-ground="bg">
        <div class="page-width lp-hero">
          <p class="section__eyebrow lp-kicker">About</p>
          <h1>Nobody has thirty nights<br>to spare. Twice.</h1>
          <p class="section__lede lp-lede">Numa was built because the people closest to me kept buying the wrong mattress and then living with it, because getting it right was harder than putting up with it.</p>
        </div>
      </section>
      <section class="section lp-section section--bg" data-reveal data-section-ground="bg">
        <div class="page-width lp-narrow">
          <div class="rte cart-story">
            <p>My family have bad backs. Several of them, across two generations, and I have listened to the same conversation for most of my adult life.</p>
            <p>Someone would decide the mattress was the problem. A Saturday in a showroom, four minutes lying on a bed with their shoes off. They would choose something, it would arrive weeks later, and within a month they would know it was wrong.</p>
            <p>Too firm. Or too soft, which they only worked out once their shoulder started aching. Or right for one of them and wrong for the other.</p>
            <p>And then they kept it. Eight years. Sometimes ten.</p>
            <p>Not because they were stubborn. Because the alternative was hopeless. To actually get it right you would have to sleep on a mattress for thirty nights to know, then send it back, then wait for another, then sleep on that one for thirty nights. Months of it. A part-time job with no guarantee at the end, carried out in the one place you go to stop working.</p>
            <p>The whole burden of getting it right sits with the person who knows least, at the moment they know least.</p>
            <p>So they do what anyone would. They accept the first one, tell themselves it will settle, and quietly stop mentioning their back.</p>
            <p>That is the part I could not leave alone. Not that the mattress was wrong, but that being wrong was treated as the customer’s problem to solve, using a method nobody has the time or the will to see through.</p>
            <p>Numa is built so that burden is ours. You do not choose a feel. Your mattress arrives, you sleep on it for a month, and then you tell us how it should feel. Softer, firmer, more give under the hip, whatever it is in whatever words you have. We make a comfort layer to that, with our compliments. No trial-and-error, no sending anything back, no starting again.</p>
            <p>You get one month of sleeping. We do the rest.</p>
            <div class="lp-pull"><p>A bed that becomes yours, and stays that way.</p></div>
            <p>That is why the top comes off. It began as a way to fix a wrong guess and it turned out to solve something larger. The part of a mattress that softens is the top five centimetres, and everything beneath it is usually still sound at year ten. Renewing the layer keeps the bed right for twenty five years instead of watching it drift wrong over eight.</p>
            <p>The rest followed from the same thought. If somebody is spending three thousand pounds on a bed, it should not arrive as a box in their hallway. Concierge unpacking. Unrolled where it belongs. The packaging leaves with it. The old one leaves too.</p>
            <p>We named it Numa after the second king of Rome, remembered for ending a long war and giving the city forty three years of quiet. It is also, almost exactly, the Arabic word for a night’s sleep. Two languages, one meaning, and it seemed like the right thing to call a bed.</p>
            <p>We started in 2026 and we are small. That is deliberate for now, because I want to work with you personally to get your bed right. Write to me and it is me who answers.</p>
            <p>Ben Acolatse<br>Founder · Numa · Est. 2026</p>
          </div>
        </div>
      </section>
      <section class="section lp-section section--surface" id="outcome" data-reveal data-section-ground="surface">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head" style="text-align:center">
            <h2>A bed that becomes yours,<br>and stays that way.</h2>
          </div>
          <div class="lp-outcome">
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">You do not choose the feel. You discover it.</p>
              <p class="lp-outcome__desc">Sleep on it for a month. Tell us how it should feel. We make it that way.</p>
            </div>
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">It arrives finished.</p>
              <p class="lp-outcome__desc">Concierged. Room of your choice. Unrolled onto your bed. The old one leaves with it.</p>
            </div>
            <div class="lp-outcome__item">
              <p class="lp-outcome__name">It stays right for twenty five years.</p>
              <p class="lp-outcome__desc">The part that softens renews. The part that lasts, lasts.</p>
            </div>
          </div>
          <p class="lp-cta-band__btn" style="text-align:center;margin-top:2.25rem"><a class="btn" href="./configure.html">Choose your size</a></p>
        </div>
      </section>
    </main>
"""

RECYCLING_MAIN = """
    <main>
      <section class="section lp-section lp-section--hero section--bg" data-lp-page data-lp-variant="E-recycling" data-reveal data-section-ground="bg">
        <div class="page-width lp-hero">
          <p class="section__eyebrow lp-kicker">Old mattress removal · Complimentary with every mattress</p>
          <h1>Seven million a year.<br>Let us deal with yours.</h1>
          <p class="section__lede lp-lede">Around seven million mattresses are thrown out in the UK annually and roughly three quarters end up in landfill. Collection, transport and recycling are paid for by us. You are not charged, and you never will be.</p>
        </div>
      </section>
      <section class="section lp-section section--surface" data-reveal data-section-ground="surface">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head">
            <h2>Why it ends up in the ground</h2>
          </div>
          <div class="rte">
            <p>A mattress is not one material. It is steel, foam and textile bonded together, and separating them is manual, slow work. For years the cost of pulling one apart has been higher than the value of what comes out, so most were buried.</p>
            <p>That is changing, but not fast enough. The industry target is to divert three quarters of mattresses from landfill by 2028, and it is currently not on track to meet it.</p>
          </div>
          <div class="lp-stats">
            <div>
              <span class="lp-stats__n">7m</span>
              <span class="lp-stats__l">Mattresses discarded in the UK each year</span>
            </div>
            <div>
              <span class="lp-stats__n">75%</span>
              <span class="lp-stats__l">Still going to landfill or incineration</span>
            </div>
            <div>
              <span class="lp-stats__n">£76</span>
              <span class="lp-stats__l">What councils charge to collect one</span>
            </div>
          </div>
          <p class="lp-note-line">Figures from National Bed Federation end-of-life mattress research.</p>
        </div>
      </section>
      <section class="section lp-section section--bg" data-reveal data-section-ground="bg">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head"><h2>Why we pay for it</h2></div>
          <div class="rte">
            <p>Every mattress sold puts another one into the waste stream. Ours included. Collection, transport and recycling are paid for by us. It is a real cost on every order and it is deducted from our margin, not added to your price.</p>
            <p>Councils charge up to £76 to take a mattress away. Declining the service does not reduce the price of your mattress.</p>
          </div>
        </div>
      </section>
      <section class="section lp-section section--surface" data-reveal data-section-ground="surface">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head">
            <h2>What happens to it</h2>
            <p class="section__lede">Complimentary is easy to say. Where it actually goes is the part that matters.</p>
          </div>
          <ol class="lp-steps">
            <li><b>We collect it on the same visit</b> Your old mattress leaves as the new one arrives. Nothing waits in the hall, nothing goes on the drive, and you do not book a second appointment or pay a council fee.</li>
            <li><b>It goes to a recycler, not a tip</b> Not a general waste transfer station. A facility that separates the components rather than baling the whole thing.</li>
            <li><b>The materials are recovered</b> Steel springs return to steel manufacturing. Foam and polyester are reprocessed. Textiles go into industrial felt and carpet backing.</li>
            <li><b>We tell you the truth about the rest</b> Diversion from landfill and actual material recovery are different numbers. We will publish our real recovery rate once our partner has confirmed it in writing, and not before.</li>
          </ol>
        </div>
      </section>
      <section class="section lp-section section--bg" data-reveal data-section-ground="bg">
        <div class="page-width lp-narrow">
          <div class="lp-notice">
            <span class="lp-notice__tag">Please read before adding this</span>
            <h2>Once it goes, it is gone.</h2>
            <div class="rte">
              <p><strong>This service cannot be reversed.</strong> Your old mattress is taken directly for recycling. It is not stored, held or kept aside, and we cannot return it to you under any circumstances after collection.</p>
              <p><strong>That matters if you later return your mattress.</strong> If you use the 30-day sleep trial and we collect our mattress, you will not have your old one to go back to. Please think about that before adding this service, particularly if you are unsure about the purchase.</p>
              <p><strong>It is entirely optional.</strong> You can decline it at checkout and keep your old mattress, and it changes nothing else about your order. You can also tell us on the day that you have changed your mind, at any point before it is taken.</p>
              <p><strong>There is nothing to refund.</strong> The service is complimentary. No charge is made and none is returned. Declining it does not reduce the price of your mattress.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="section lp-section section--surface" data-reveal data-section-ground="surface">
        <div class="page-width lp-narrow">
          <div class="lp-sec-head"><h2>What we cannot take</h2></div>
          <div class="rte">
            <p>We may be unable to accept an item at the door, and it is better to know now than on the day. We cannot collect a mattress that is wet, mouldy, infested, heavily soiled or contaminated, because a recycler will not accept it and it becomes landfill anyway.</p>
            <p>If you think yours might fall into that category, tell us when you book the delivery. It is not a problem, it just means we plan for it.</p>
          </div>
        </div>
      </section>
      <section class="section lp-section section--bg" data-reveal data-section-ground="bg">
        <div class="page-width lp-narrow" style="text-align:center">
          <div class="lp-sec-head"><h2>Choose your size</h2></div>
          <p><a class="btn" href="./configure.html">Configure yours</a></p>
        </div>
      </section>
    </main>
"""


def chrome_from(src: Path) -> tuple[str, str]:
    html = src.read_text()
    head, rest = html.split("<main>", 1)
    _, foot = rest.split("</main>", 1)
    return head, foot


def write_page(name: str, title: str, body_class: str, main: str, cta_href: str) -> None:
    head, foot = chrome_from(PAGES / "large-sizes.html")
    head = head.replace(
        "<title>Emperor and Super King mattresses · Numa</title>",
        f"<title>{title} · Numa</title>",
    )
    head = head.replace('class="template-page-large-sizes"', f'class="{body_class}"')
    head = head.replace('href="#configure"', f'href="{cta_href}"')
    (PAGES / name).write_text(head + main + foot)


def insert_before_configure(html: str) -> str:
    marker = '      <section class="section lp-section lp-section--configure'
    if marker not in html:
        raise SystemExit("configure section missing")
    if 'id="outcome"' in html:
        return html
    return html.replace(marker, OUTCOME_DELIVERY + marker, 1)


def patch_landings() -> None:
    large = PAGES / "large-sizes.html"
    text = large.read_text()
    text = text.replace(
        '<div class="lp-sec-head"><h2>Why the size exists</h2></div>',
        '<div class="lp-sec-head"><h2>Why it is 200 wide</h2></div>',
    )
    text = text.replace(
        "<p>Very few UK manufacturers make it. Pocket spring machines are built around a 180cm ceiling and retooling for a size that sells in tens rather than thousands is not worth their while.</p>\n              <p>We make to order, so it is worth ours.</p>",
        "<p>We make to order, so the size exists because someone wants it, not because a machine was already set up for it.</p>",
    )
    text = text.replace(
        "<p class=\"section__lede\">A mattress does not wear out. The top wears out, and the rest goes to landfill with it. Ours separates. A pocket sprung core built to last <span data-warranty-years-text>25</span> years, and a comfort layer above it that unzips and lifts off.</p>",
        "<p class=\"section__lede\">A mattress does not wear out. The top five centimetres wear out. Ours separates. A pocket sprung core built to last twenty five years, and a comfort layer above it that unzips and lifts off.</p>",
    )
    text = text.replace("<li><b>Depth</b><span>37cm made up.</span></li>", "<li><b>Depth</b><span>35cm. 30cm core, 5cm comfort layer.</span></li>")
    text = text.replace(
        "<li><b>Core</b><span>Hand-assembled pocket springs. <span data-warranty-years-text>25</span>-year guarantee.</span></li>",
        "<li><b>Core</b><span>Pocket springs. Twenty five year guarantee.</span></li>",
    )
    text = text.replace(
        "<li><b>Comfort layer</b><span>Removable and reversible. Medium on one face, medium firm on the other. You do not choose - it arrives with both.</span></li>",
        "<li><b>Comfort layer</b><span>Removable and reversible. Two feels. You do not choose. It arrives with both.</span></li>",
    )
    text = text.replace(
        "<li><b>Replacement layer</b><span><span data-layer-price-text></span> when it eventually softens, instead of a new mattress.</span></li>",
        "<li><b>Comfort layer, later</b><span><span data-layer-price-text></span> when it eventually softens, instead of a new mattress.</span></li>",
    )
    old_p = '<div class="lp-promise"><p><strong>Emperor comfort promise.</strong>'
    if old_p in text:
        start = text.index(old_p)
        end = text.index("</div>", start) + len("</div>")
        text = text[:start] + PROMISE_EMP + text[end:]
    text = insert_before_configure(text)
    large.write_text(text)

    euro = PAGES / "european-king.html"
    text = euro.read_text()
    text = text.replace(
        '<div class="lp-sec-head"><h2>The 10cm problem</h2></div>',
        '<div class="lp-sec-head"><h2>One hundred and sixty centimetres</h2></div>',
    )
    text = text.replace(
        """          <div class="rte">
            <p>If you bought a bed frame from IKEA, or almost anywhere in continental Europe, it takes a 160 x 200cm mattress.</p>
            <p>Every British manufacturer builds 150 x 200. Put one in a European frame and you get a 10cm gap down one side, sheets that will not sit, and a mattress that shifts every time you move.</p>
            <p>The usual answers are to buy IKEA's own mattress, import one from Europe and wait, or replace the frame. We make a third option.</p>
          </div>""",
        """          <div class="rte">
            <p>Continental bed frames, IKEA included, take a mattress 160 centimetres wide. It is a standard across most of Europe and it is the size we build.</p>
            <p>The British King is 150. Ten centimetres narrower, which sounds like nothing until it is a gap down one side of your bed and sheets that will not sit flat.</p>
          </div>""",
    )
    text = text.replace(
        '<div class="lp-sec-head lp-narrow"><h2>What you get instead</h2></div>',
        '<div class="lp-sec-head lp-narrow"><h2>What it is</h2></div>',
    )
    text = text.replace(
        '<article class="lp-card"><h3>37cm of mattress</h3><p>Hand-assembled pocket sprung core with a comfort layer above it. Roughly twice the depth of what came with the frame.</p></article>',
        '<article class="lp-card"><h3>Thirty five centimetres</h3><p>A pocket sprung core with a comfort layer above it, closed with a zip so the top can be renewed without the bed.</p></article>',
    )
    text = text.replace(
        '<article class="lp-card"><h3>A layer you can replace</h3><p>The part that wears out unzips and lifts off. <span data-layer-price-text></span> to renew, not <span data-lp-featured-price></span>.</p></article>',
        '<article class="lp-card"><h3>A feel you settle later</h3><p>Sleep on it for a month. Tell us how it should feel. We make it that way, with our compliments.</p></article>',
    )
    text = text.replace("<li><b>Depth</b><span>37cm made up.</span></li>", "<li><b>Depth</b><span>35cm. 30cm core, 5cm comfort layer.</span></li>")
    text = text.replace(
        "<li><b>Comfort layer</b><span>Removable and reversible. Firm one side, soft the other. You do not choose - it arrives with both.</span></li>",
        "<li><b>Comfort layer</b><span>Removable and reversible. Two feels. You do not choose. It arrives with both.</span></li>",
    )
    old_p = '<div class="lp-promise"><p><strong>30-day comfort promise.</strong>'
    if old_p in text:
        start = text.index(old_p)
        end = text.index("</div>", start) + len("</div>")
        text = text[:start] + PROMISE_STD + text[end:]
    text = insert_before_configure(text)
    euro.write_text(text)

    spec = PAGES / "specification.html"
    text = spec.read_text()
    text = text.replace(
        """          <div class="lp-sec-head lp-narrow">
            <h2>Four things worth checking</h2>
            <p class="section__lede">On any mattress, at any price. Most brands will answer two of them.</p>
          </div>
          <div class="lp-cards">
            <article class="lp-card"><h3>Is it assembled by hand?</h3><p>Hand assembly holds the fillings in place for decades. Glue and quilting are faster and cheaper, and they settle. Ask which one, and if the answer is vague, it is glued.</p></article>
            <article class="lp-card"><h3>Can the top be replaced?</h3><p>The comfort layer wears out long before the springs do. If it is sealed inside, the whole mattress goes when the top fails. Ask whether it comes off.</p></article>
            <article class="lp-card"><h3>What is the guarantee actually on?</h3><p>Most guarantees cover manufacturing faults, not the softening that makes you replace it. Ask what happens in year eight, not year one.</p></article>
          </div>""",
        """          <div class="lp-sec-head lp-narrow">
            <h2>How it is built</h2>
            <p class="section__lede">Three decisions that determine whether a mattress is still good in twenty years.</p>
          </div>
          <div class="lp-cards">
            <article class="lp-card"><h3>Pocket springs, individually housed</h3><p>Each spring moves on its own, so one person turning over does not move the other. It is the part that carries the twenty five year guarantee.</p></article>
            <article class="lp-card"><h3>A comfort layer that comes out</h3><p>The top five centimetres are what soften. Ours unzip and lift away, so the bed is renewed rather than replaced.</p></article>
            <article class="lp-card"><h3>Made after you order it</h3><p>Nothing is built before someone wants it. No warehouse, no stock to clear.</p></article>
          </div>""",
    )
    text = text.replace("<li><b>Depth</b><span>37cm made up.</span></li>", "<li><b>Depth</b><span>35cm. 30cm core, 5cm comfort layer.</span></li>")
    text = text.replace(
        "<li><b>Comfort layer</b><span>Unzips and lifts off. Medium on one face, medium firm on the other. You do not choose a firmness - you turn it over.</span></li>",
        "<li><b>Comfort layer</b><span>Unzips and lifts off. Two feels. You do not choose a firmness. You turn it over.</span></li>",
    )
    text = text.replace(
        "<li><b>Replacement layer</b><span><span data-layer-price-text></span> when it eventually softens. The core stays.</span></li>",
        "<li><b>Comfort layer, later</b><span><span data-layer-price-text></span> when it eventually softens. The core stays.</span></li>",
    )
    text = text.replace(
        "<li><b>Sizes</b><span>Double through Emperor 200 x 200cm, including European King 160 x 200cm.</span></li>",
        "<li><b>Sizes</b><span>Single through Emperor 200 x 200cm, including European King 160 x 200cm.</span></li>",
    )
    if old_p in text:
        start = text.index(old_p)
        end = text.index("</div>", start) + len("</div>")
        text = text[:start] + PROMISE_STD + text[end:]
    text = text.replace(
        '<p class="section__lede">A pocket sprung core lasts decades. The top does not.</p>',
        '<p class="section__lede">A pocket sprung core lasts decades. The five centimetres on top do not.</p>',
    )
    text = text.replace(
        """          <div class="rte">
            <p>Every mattress you have thrown away was thrown away because of the part that wears fastest, while the springs underneath were still doing their job.</p>
            <p>Ours comes apart. When the comfort layer eventually softens, it unzips and a new one goes on. The core stays where it is, and so does the bed you chose.</p>
            <p>That is the whole argument for the construction. Not that it is cheaper. That you are not starting again.</p>
          </div>""",
        """          <div class="rte">
            <p>The part that softens is the top. The springs underneath are still doing their job.</p>
            <p>Ours comes apart. When the comfort layer eventually softens, it unzips and a new one goes on. The core stays where it is, and so does the bed you chose.</p>
          </div>""",
    )
    text = insert_before_configure(text)
    spec.write_text(text)

    buys = PAGES / "what-it-buys.html"
    text = buys.read_text()
    text = text.replace(
        """          <div class="lp-sec-head">
            <h2>Where the money goes</h2>
            <p class="section__lede">Most mattresses at this price carry a retailer margin and a showroom. Ours carries neither.</p>
          </div>""",
        """          <div class="lp-sec-head">
            <h2>What is in it</h2>
            <p class="section__lede">Thirty five centimetres, built in two parts, closed with a zip.</p>
          </div>""",
    )
    text = text.replace(
        "<li><b>The comfort layer</b><span>Separately constructed, zipped in. Medium on one face, medium firm on the other. Built as its own product because it has to be replaceable.</span></li>",
        "<li><b>The comfort layer</b><span>5cm, separately constructed, zipped in. Two feels. Built as its own product because it has to be renewable.</span></li>",
    )
    text = text.replace(
        "<li><b>Made to order</b><span>Nothing is built before you buy it. No warehouse, no stock write-off, no clearance sale of last season's tension.</span></li>",
        "<li><b>Made to order</b><span>Nothing is built before you buy it.</span></li>",
    )
    text = text.replace(
        "<li><b>No showroom</b><span>The saving is roughly a third of the retail price of a comparable mattress, and it is the reason a handmade bed costs what it costs rather than twice that.</span></li>",
        "<li><b>It arrives finished</b><span>Concierged. Room of your choice. Unrolled onto the bed. The old one leaves with it.</span></li>",
    )
    text = text.replace(
        """          <div class="rte">
            <p>A pocket sprung core lasts toward <span data-warranty-years-text>25</span> years. The top lasts seven or eight. Every mattress you have ever replaced was replaced because of the part that wears fastest.</p>
            <p>Ours comes apart. When the comfort layer softens it unzips, a new one goes on, and the core stays exactly where it is.</p>
            <p>You are not buying a mattress that lasts longer than the alternatives. You are buying one you do not have to replace.</p>
          </div>""",
        """          <div class="rte">
            <p>A pocket sprung core lasts toward twenty five years. The top five centimetres last seven or eight.</p>
            <p>Ours comes apart. When the comfort layer softens it unzips, a new one goes on, and the core stays exactly where it is.</p>
          </div>""",
    )
    text = text.replace(
        """          <div class="lp-sec-head lp-narrow">
            <h2>What we do not offer</h2>
            <p class="section__lede">Worth saying plainly, because you will find out anyway.</p>
          </div>
          <div class="lp-cards">
            <article class="lp-card"><h3>A showroom</h3><p>You cannot lie on it before buying. That is why every mattress arrives with two feels in one layer, and why a different tension, worth <span data-layer-price-text></span>, is complimentary if neither suits.</p></article>
            <article class="lp-card"><h3>Next day delivery</h3><p>It is made after you order it. That takes weeks, not days.</p></article>
            <article class="lp-card"><h3>A hundred year history</h3><p>We are new. The specification is the argument, not the heritage.</p></article>
          </div>""",
        """          <div class="lp-sec-head lp-narrow">
            <h2>Worth knowing</h2>
            <p class="section__lede">Three things people ask before they order.</p>
          </div>
          <div class="lp-cards">
            <article class="lp-card"><h3>A showroom</h3><p>You cannot lie on it before buying. Sleep on it for a month. Tell us how it should feel. We make it that way, with our compliments. Worth <span data-layer-price-text></span>.</p></article>
            <article class="lp-card"><h3>It is made after you order</h3><p>Which takes weeks rather than days.</p></article>
            <article class="lp-card"><h3>It arrives finished</h3><p>Concierged. Room of your choice. Unrolled onto the bed. The old one leaves with it.</p></article>
          </div>""",
    )
    old_p2 = '<div class="lp-promise"><p><strong>30-day comfort promise.</strong> If the feel is not right, we send a replacement comfort layer free of charge. If that does not fix it, we collect the mattress and refund you in full.</p></div>'
    text = text.replace(old_p2, PROMISE_STD)
    if old_p in text:
        start = text.index(old_p)
        end = text.index("</div>", start) + len("</div>")
        text = text[:start] + PROMISE_STD + text[end:]
    text = insert_before_configure(text)
    buys.write_text(text)

    for path in (large, euro, spec, buys, PAGES / "configure.html"):
        if not path.exists():
            continue
        t = path.read_text()
        t = t.replace("same 37cm construction", "same 35cm construction")
        t = t.replace("37cm made up.", "35cm. 30cm core, 5cm comfort layer.")
        path.write_text(t)


def patch_policies() -> None:
    trial = PAGES / "trial.html"
    text = trial.read_text()
    text = text.replace("100-night trial · Numa", "30-day sleep trial · Numa")
    text = text.replace("<h1>100-night trial</h1>", "<h1>30-day sleep trial</h1>")
    text = text.replace(
        "Sleep on it properly. Specific terms - not fine print.",
        "Sleep on it for a month. Tell us how it should feel. We make it that way.",
    )
    text = text.replace(
        "The 100-night trial is offered by",
        "The 30-day sleep trial is offered by",
    )
    text = text.replace(
        """            <article class="policy-article">
              <h2>How long</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>You have 100 nights from delivery to decide. That is long enough to adjust to a new bed.</p>
              </div>
            </article>
            <article class="policy-article">
              <h2>If it is not right</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>Contact us before the trial ends. We arrange collection. Return shipping within the mainland UAE is covered by us on the standard trial return; remote areas may differ and we will confirm before collection. UK returns: we will confirm the collection route and any carriage cost before you commit.</p>
              </div>
            </article>""",
        """            <article class="policy-article">
              <h2>Made to Desire</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>If the feel is not right, we will make you a new comfort layer to your preference, with our compliments. Worth £299.</p>
              </div>
            </article>
            <article class="policy-article">
              <h2>If that still does not settle it</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>We collect the mattress and refund you in full. Contact us before the trial ends.</p>
              </div>
            </article>
            <article class="policy-article">
              <h2>Emperor</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>Emperor is made to order at 200 x 200cm and is not covered by the 30-day return trial. Made to Desire still applies. Your statutory cancellation rights are unaffected.</p>
              </div>
            </article>""",
    )
    if 'data-trial-nights=' not in text:
        text = text.replace('data-warranty-years="25">', 'data-warranty-years="25" data-trial-nights="30">', 1)
    trial.write_text(text)

    delivery = PAGES / "delivery.html"
    text = delivery.read_text()
    text = text.replace(
        "Delivery into your home is arranged for your market. Options and any access requirements are confirmed before dispatch. There is no setup service contracted at this time.",
        "Included with every mattress. Concierged. Room of your choice. Unboxed, unrolled, positioned. The packaging leaves with it.",
    )
    text = text.replace("<h2>Delivery</h2>", "<h2>Concierge unpacking</h2>")
    if "Old mattress removal and recycling" not in text:
        text = text.replace(
            """            <article class="policy-article">
              <h2>Areas served</h2>""",
            """            <article class="policy-article">
              <h2>Old mattress removal and recycling</h2>
              <div class="policy-article__body rte trust-policy__body">
                <p>Collected on the same visit. Complimentary. <a href="./mattress-recycling.html">Read what happens to it</a>.</p>
              </div>
            </article>
            <article class="policy-article">
              <h2>Areas served</h2>""",
        )
    if 'data-trial-nights=' not in text:
        text = text.replace('data-warranty-years="25">', 'data-warranty-years="25" data-trial-nights="30">', 1)
    delivery.write_text(text)

    cart = PAGES / "cart.html"
    text = cart.read_text()
    text = text.replace(
        '<p class="cart-trial-line">30-day comfort promise.</p>',
        '<p class="cart-trial-line">30-day comfort promise. Concierge unpacking included.</p>',
    )
    text = text.replace('<li><a href="./trial.html">100-night trial</a></li>', '<li><a href="./trial.html">30-day sleep trial</a></li>')
    if 'data-trial-nights=' not in text:
        text = text.replace('data-warranty-years="25">', 'data-warranty-years="25" data-trial-nights="30">', 1)
    cart.write_text(text)

    for name in ("checkout.html", "order-confirmed.html", "order-status.html", "terms.html"):
        path = PAGES / name
        if path.exists():
            t = path.read_text()
            t = t.replace("100-night trial", "30-day sleep trial")
            t = t.replace("same 100-night trial", "same 30-day sleep trial")
            path.write_text(t)

    for path in (PAGES / "size-guide.html", PAGES / "bed-sheets.html", PAGES / "order-confirmed.html"):
        if path.exists():
            t = path.read_text()
            t = t.replace("37cm", "35cm")
            t = t.replace("37cm depth", "35cm depth")
            path.write_text(t)


def patch_homepage() -> None:
    text = INDEX.read_text()
    text = text.replace(
        'data-warranty-years="25"',
        'data-warranty-years="25" data-trial-nights="30"',
        1,
    )
    banner = "Concierge unpacking included with every mattress · To the room of your choice, packaging taken away"
    text = text.replace(
        'value="Cancel any time before dispatch · 100-night trial · Made to order"',
        f'value="{banner}"',
    )
    text = text.replace(
        'value="Cancel any time before dispatch · 100-night trial · Spread with Klarna"',
        f'value="{banner}"',
    )
    text = text.replace(
        "var DEFAULT_AE = 'Cancel any time before dispatch · 100-night trial · Made to order';",
        f"var DEFAULT_AE = '{banner}';",
    )
    text = text.replace(
        "var DEFAULT_GB = 'Cancel any time before dispatch · 100-night trial · Spread with Klarna';",
        f"var DEFAULT_GB = '{banner}';",
    )
    text = text.replace(">100-night trial<", ">30-day sleep trial<")
    text = text.replace(
        "Most mattresses are thrown away because one layer wore out. We made that layer the part you replace.",
        "The part that softens is the top five centimetres. Ours separates, so you renew that layer instead of the bed.",
    )
    text = text.replace(
        "Most mattresses get replaced every seven or eight years because the top layer wears out. Ours is built so you replace the layer instead.",
        "The part that softens renews. The part that lasts, lasts.",
    )
    INDEX.write_text(text)


def emails_index() -> None:
    dest = ROOT / "preview" / "emails" / "index.html"
    rows = [
        ("01-post-purchase.html", "Post purchase"),
        ("02-in-production.html", "In production"),
        ("03-delivery-booked.html", "Delivery booked"),
        ("04-day-before.html", "Day before"),
        ("05-delivered.html", "Delivered"),
        ("06-settling-in.html", "Settling in"),
        ("07-trial-ending.html", "Trial ending"),
        ("08-owner-welcome.html", "Owner welcome"),
        ("09-basket-1.html", "Basket 1"),
        ("10-basket-2.html", "Basket 2"),
        ("11-basket-3.html", "Basket 3"),
        ("12-browse-abandon.html", "Browse abandon"),
        ("13-layer-requested.html", "Layer requested"),
        ("14-return-booked.html", "Return booked"),
        ("15-refund-processed.html", "Refund processed"),
        ("16-layer-reminder.html", "Layer reminder"),
    ]
    links = "\n".join(f'      <li><a href="./{f}">{label}</a></li>' for f, label in rows)
    dest.write_text(
        f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Numa emails · preview</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body>
    <h1>Sixteen lifecycle emails</h1>
    <p>Shopify is an event source. These templates are not Shopify Email flows.</p>
    <ol>
{links}
    </ol>
  </body>
</html>
"""
    )


def main() -> None:
    write_page("about.html", "About", "template-page-about", ABOUT_MAIN, "./configure.html")
    write_page(
        "mattress-recycling.html",
        "Old mattress removal and recycling",
        "template-page-mattress-recycling",
        RECYCLING_MAIN,
        "./configure.html",
    )
    patch_landings()
    patch_policies()
    patch_homepage()
    emails_index()
    print("preview pages finished")


if __name__ == "__main__":
    main()
