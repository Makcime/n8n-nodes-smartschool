# SmartSchool Portal Login Service (External) - Design Spec

This document describes the external login service that generates SmartSchool portal sessions
using browser automation. The n8n node will call this service to obtain `PHPSESSID`, `userId`,
and `cookieHeader` without embedding Playwright in the node itself.

## Goals

- Provide a reliable "Generate Session" operation for SmartSchool portal workflows.
- Keep the n8n node free of restricted dependencies (Playwright, otplib).
- Centralize SmartSchool login logic in a Django service you control.
- Support MFA (TOTP) when required.
- Allow both direct credential input and stored credential references.

## Non-Goals

- This service does not manage n8n workflows or n8n credentials directly.
- This service does not store user credentials unless explicitly configured to do so.
- This service is not intended for public access; it should be private and authenticated.

## High-Level Architecture

- Django service exposes a secure endpoint (e.g. `/api/smartschool/login`).
- Service runs Playwright (Chromium) to log into the SmartSchool portal.
- Service extracts:
  - `phpSessId` (from cookies)
  - `cookieHeader` (all relevant cookies for the domain)
  - `userId` (from portal URL / UI attribute)
- Service returns JSON payload to n8n node.
- n8n node uses these values for subsequent portal requests.

## API Contract

### Endpoint

- `POST /api/smartschool/login`

### Authentication

Required. Choose one:

- API Key header: `X-API-Key: <key>`
- Bearer token: `Authorization: Bearer <token>`
- Mutual TLS if you already use it internally

### Request Body (Option A: direct credentials)

```json
{
  "domain": "school.smartschool.be",
  "username": "user@example.com",
  "password": "plaintext-password",
  "birthdate": "2000-01-31",
  "totpSecret": "JBSWY3DPEHPK3PXP"
}
```

### Request Body (Option B: stored credentials)

```json
{
  "credentialId": "smartschool-primary",
  "domain": "school.smartschool.be"
}
```

### Response (success)

```json
{
  "phpSessId": "abc123...",
  "userId": "12345",
  "cookieHeader": "PHPSESSID=abc123; ...",
  "expiresAt": "2026-01-14T18:00:00Z"
}
```

### Response (error)

```json
{
  "error": "Login failed",
  "details": "Could not find login form or invalid credentials",
  "code": "LOGIN_FAILED"
}
```

## Playwright Behavior

- Run Chromium in headless mode by default.
- Use a realistic user agent string.
- Support multi-step flows:
  - username + password page
  - MFA / TOTP prompt
  - birthdate verification page
- Detect when login redirects to the portal landing page.

### Required Playwright Features

- `page.goto()` with `waitUntil: 'load'`
- Robust selectors for username/password fields
- TOTP generation when prompted (from `totpSecret`)
- Cookie extraction via `context.cookies()`

## Timeout and Retry

- Suggested timeout: 60 seconds
- On failure, include a clear error with a short code
- No automatic retry by default (let caller decide)

## Security Requirements

- **Do not log passwords or TOTP secrets**
- Store credentials only if required, encrypted at rest
- Limit endpoint access by IP or API key
- Rate-limit requests to prevent abuse

## Django Implementation Notes

### Suggested Structure

- Django REST endpoint (DRF or plain Django view)
- Background execution:
  - Run Playwright in a worker (Celery) if login can be slow
  - For sync calls, use a request timeout guard

### Minimal Pseudocode (sync)

```python
@api_view(["POST"])
def smartschool_login(request):
    payload = request.data
    creds = resolve_credentials(payload)

    session = run_playwright_login(
        domain=creds.domain,
        username=creds.username,
        password=creds.password,
        birthdate=creds.birthdate,
        totp_secret=creds.totp_secret,
    )

    return Response({
        "phpSessId": session.php_sess_id,
        "userId": session.user_id,
        "cookieHeader": session.cookie_header,
        "expiresAt": session.expires_at,
    })
```

## N8N Node Integration

The n8n node should:

- Add new credential fields:
  - `loginServiceUrl`
  - `loginServiceApiKey` (or token)
- On "Generate Session":
  - Call the Django endpoint
  - Map response into existing node output
  - Fail fast on errors and show message

### Example Request from n8n

```json
{
  "domain": "school.smartschool.be",
  "username": "user@example.com",
  "password": "plaintext-password",
  "birthdate": "2000-01-31",
  "totpSecret": "JBSWY3DPEHPK3PXP"
}
```

### Example Response to n8n

```json
{
  "success": true,
  "phpSessId": "abc123",
  "userId": "12345",
  "cookieHeader": "PHPSESSID=abc123; ..."
}
```

## Operational Notes

- Ensure Playwright system dependencies are installed on the server.
- If running in Docker, use an image that includes Playwright deps or install them.
- Consider caching recent sessions to reduce login overhead.

## Rollout Plan

1) Implement Django endpoint with Playwright.
2) Test with a known SmartSchool account.
3) Update n8n node Generate Session to call this endpoint.
4) Deploy to VPS and verify end-to-end.

## Open Questions

- Should the service store credentials or accept them per request?
- Do we need an explicit session invalidation endpoint?
- How long should cached sessions be reused before re-login?
