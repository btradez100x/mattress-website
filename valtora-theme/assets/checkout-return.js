/**
 * Paste this file's IIFE (or the Liquid in docs/CHECKOUT_THANK_YOU.md) into
 * Shopify Admin → Settings → Checkout → Order status page additional scripts.
 *
 * Hosted Shopify checkout does not load the storefront theme. Assigning
 * templates/page.order-confirmed.json is not enough — this script sends the
 * shopper back to the branded thank-you page after they pay.
 */
(function () {
  var dest = '/pages/order-confirmed';
  try {
    if (window.ValtoraTheme && ValtoraTheme.routes && ValtoraTheme.routes.orderConfirmed) {
      dest = ValtoraTheme.routes.orderConfirmed;
    }
  } catch (e) {}
  try {
    var checkout = window.Shopify && Shopify.Checkout;
    var onThanks =
      (checkout && (checkout.step === 'thank_you' || checkout.page === 'thank_you')) ||
      /thank_you|thank-you/i.test(location.pathname + location.search);
    if (onThanks) window.location.replace(dest);
  } catch (err) {}
})();
