# Portal Reverse Engineering Notes (HAR workflow)

This doc explains the practical workflow we use to reverse engineer Smartschool
portal endpoints from the browser, so we can implement reliable portal
operations in the n8n custom node.

## Goals
- Identify the minimal HTTP calls required for a portal action.
- Capture the exact request body, query params, and headers that matter.
- Confirm which values are session bound (cookies, user id, tokens).
- Store reproducible traces in `reverse/` for future reference.

## Capture a HAR trace
1. Open the portal page in the browser and log in normally.
2. Open DevTools -> Network.
3. Enable "Preserve log" and clear old entries.
4. Perform the exact action you want to automate.
5. Right click in the Network list -> "Save all as HAR with content".

Tips:
- Filter to `XHR` / `fetch` only.
- Keep a short window of requests, then save.
- Always record the final action in the trace (not just initial page load).

## Redact and store
Before committing, remove or mask:
- `PHPSESSID`, `smscndc`, `pid` cookies.
- Any access tokens or session ids.
- Usernames, passwords, or identifiable user data.

Store the HAR or key request extracts under `reverse/<module>/`.
Example structure:
```
reverse/
  agenda/
    updateScheduleCodes.har
  absences/
    getConfig.json
```

## Reduce to the minimal call set
From the HAR, identify:
- The base endpoint (path + method).
- Required headers (usually cookies + X-Requested-With).
- Required payload and parameters.
- Optional or noisy headers (sentry, telemetry, etc).

If the UI does multiple calls:
- Find the call that actually changes data.
- Verify that any prior "getToken" call is either mandatory or ignorable.
- Re-run with only the suspected required calls to confirm.

## What to look for in the request
Common portal patterns:
- JSON body with specific field names (e.g. `newScheduleCodes`).
- Cookies carrying session state (`PHPSESSID`, `smscndc`, `pid`).
- User id values embedded in the URL path (e.g. `/planner/main/user/5819_1682_0/...`).

Check for:
- CSRF tokens in headers or body.
- One-time tokens returned by a `getToken` call.
- Required `Origin`, `Referer`, or `X-Requested-With` headers.

## Implementation checklist
When implementing a portal call:
- Start with the minimal headers and add only what is required.
- Ensure `cookieHeader` is forwarded when using a portal session.
- Avoid storing raw secrets in the node output.
- Prefer deterministic fields in the input node parameters.

## Validation
To validate a new endpoint:
1. Re-run the action manually in the browser and compare request payloads.
2. Execute the same action via the node with matching payload.
3. If you get 403 or 500, check for:
   - Permission issues (role limitations).
   - Missing cookies or headers.
   - Wrong user id / session id for the endpoint.

## Notes for this repo
- Portal traces live under `reverse/`.
- The portal node is `SmartSchool Portal` and uses its own credential type.
- Portal endpoints may require both `PHPSESSID` and `cookieHeader`.
