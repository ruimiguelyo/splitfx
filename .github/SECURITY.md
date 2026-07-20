# Security policy

## Scope

SplitFX is a client-side portfolio prototype with fictional demo data and fixed demo FX rates. It does not authenticate users, store personal financial data, connect to a bank, provide live market pricing, or move money.

A report is still valuable if it identifies a vulnerability in the code, dependency configuration, GitHub Actions, or deployed static site.

## Reporting a vulnerability

Please do not open a public issue containing exploit details, credentials, tokens, personal data, or confidential information.

Use GitHub's private vulnerability reporting for the repository. Do not include sensitive details in a public issue. If private reporting is unavailable, contact Rui through the LinkedIn link in the project README and request a private channel before sharing technical details. Include:

- The affected commit, page, or component.
- A concise description of the impact.
- Minimal reproduction steps or a proof of concept.
- Any suggested mitigation.
- Whether the information has been shared elsewhere.

Do not use real financial or identity data when demonstrating an issue. Acknowledgement and remediation timing depend on severity and availability; no response-time guarantee is made for this personal prototype.

## Supported version

Only the latest revision on the default branch is considered for fixes. There are no released or production-supported versions.

## Disclosure

Please allow reasonable time to investigate and address a valid report before public disclosure. No testing is authorised against third-party systems because SplitFX has no authorised third-party integration surface.
