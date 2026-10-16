# First commercial offer

Public entries: `index.ts` for the catalog and `PricingView` for the customer
page. Three monthly plans share core features and differ by managed publishing
computers. Mac Local is a separate one-time product. Checkout uses StoreKit.

Availability is independent from prices. Only verified store publication may
replace invitation actions with a real store URL. This catalog never grants
access: the account service verifies Apple transactions and account IDs.
The previous ten-computer SKU is not in the first commercial catalog.

Behavior tests: `tests/coverage/launch-offer.test.tsx` and
`tests/coverage/managed-subscriptions.test.ts`.
