# TestFlight account access

The authenticated endpoint verifies Apple's signed sandbox app transaction for
GrantTap and persists a testing grant without a subscription. A transaction can
belong to only one GrantTap account. Replay cannot clear an operator revocation.
Grants expire no later than 90 days after Apple's signed receipt date, matching
the maximum TestFlight build lifetime; fresh verified app evidence can renew
beta access. These grants are never recorded as purchases or subscription trials.
Production subscription verification remains separate. Clients cannot supply a
seat count or claim beta access with a boolean. No prompt or provider key is sent.

The existing managed admission and relay signature checks still apply. The app
must sign in to link computers. TestFlight controls the actual build expiry.
Tests: tests/coverage/testflight-access.test.ts.
