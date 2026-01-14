# Portal legacy session (Playwright) - historical reference

This document preserves the behavior of the removed **Generate Session (Legacy)** operation
from the SmartSchool Portal node. The operation used Playwright directly inside the node to
create a portal session. It is no longer exposed in the node UI, but the flow is documented
here for re-implementation in other stacks.

## Inputs

- `domain` (required): Smartschool host, e.g. `school.smartschool.be`.
- `username` (required)
- `password` (required)
- `birthdate` (required): date string; only used when account verification appears.
- `totpSecret` (optional): base32 TOTP seed for MFA.

## Behavior summary

1. Normalize the domain by removing protocol and trailing slashes.
2. Launch Chromium (headless unless `SMARTSCHOOL_HEADLESS=0`).
3. Navigate to `https://<domain>/login`.
4. Locate username + password fields using resilient selectors and submit the form.
5. If an MFA/TOTP prompt appears:
   - Select the authenticator app option when available.
   - Generate a TOTP code from `totpSecret` and submit.
6. If redirected to `/account-verification`, fill the birthdate and submit.
7. Extract cookies, especially `PHPSESSID`, and build a `cookieHeader` string of all
   cookies for the domain.
8. Derive `userId` from the `plannerurl` attribute on `#datePickerMenu`.
9. Return `{ phpSessId, userId, cookieHeader }`.

## Returned payload

```json
{
  "phpSessId": "abc123",
  "userId": "12345",
  "cookieHeader": "PHPSESSID=abc123; smscndc=...; pid=...",
  "userIdNumeric": 12345
}
```

## Notes

- Missing `PHPSESSID` after login is treated as a hard failure.
- If MFA is required but no `totpSecret` is provided, return an error.
- The portal node now uses the external login service (`Generate Session`) instead.
