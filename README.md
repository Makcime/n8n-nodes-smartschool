# n8n-nodes-smartschool

This repository contains the SmartSchool community node for n8n. It lets you work with your SmartSchool tenant (accounts, helpdesk, messaging) directly from any workflow.

[SmartSchool](https://www.smartschool.be/) est la plateforme numérique utilisée par de nombreuses écoles francophones pour la communication, les cours et le suivi administratif. Ce paquet exploite le SDK `@abrianto/smartschool-kit` pour exposer ses API dans n8n.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/). The package name is `n8n-nodes-smartschool`.

After installation, restart n8n so it loads the new node from `~/.n8n/custom` (or the directory you configured through `N8N_CUSTOM_EXTENSIONS`).

## Operations

All functionality is exposed by a single node named **SmartSchool**. It currently supports five resource families:

| Resource | Operations | Description |
| --- | --- | --- |
| `Group` | `Get All Accounts`, `Get All Accounts (Extended)`, `Get All Groups and Classes`, `Get Class List (CSV)`, `Get Class List (JSON)`, `Get Class Teachers`, `Save Group`, `Save Class`, `Save User to Group`, `Remove User from Group`, `Delete Class`, `Save Class List (CSV)`, `Save Class List (JSON)`, `Get Schoolyear Data of Class`, `Save Schoolyear Data of Class`, `Get Skore Class Teacher Course Relation`, `Clear Group`, `Unregister Student` | Work with the group/class hierarchy, export class lists, and manage classes, groups, and memberships. |
| `Helpdesk` | `List Helpdesk Items`, `Create Helpdesk Ticket` | Retrieve the helpdesk mini database (categories + item IDs) and create new tickets. |
| `Message` | `Send Message` | Send SmartSchool messages (main account or co-account) with optional attachments and LVS copy. |
| `Account` | `Get User Details`, `Get User Details by Number`, `Get User Details by Username`, `Get User Details by Scannable Code`, `Get User Official Class`, `Save User`, `Delete User`, `Set Account Status`, `Change Username`, `Change Internal Number`, `Change Password at Next Login`, `Force Password Reset`, `Replace Internal Number`, `Save User Parameter`, `Remove Co-Account`, `Save Password` | Read and mutate account data, credentials, status, and user parameters. |
| `Parameter` | `Get Reference Field` | Fetch the platform reference field configuration and documentation. |
| `Absence` | `Get Absents`, `Get Absents with Alias`, `Get Absents by Date`, `Get Absents with Alias by Date`, `Get Absents with Internal Number by Date`, `Get Absents with Username by Date`, `Get Absents by Date and Group` | Pull absence data by student, date, or class/group with optional alias labels. |
| `Course` | `Get Courses`, `Add Course`, `Add Course Students`, `Add Course Teacher` | List courses or manage course assignments for classes and teachers. |
| `System` | `Start Skore Sync`, `Check Status`, `Get Student Career` | Kick off Skore sync jobs, check their status, and read student career history. |

Roadmap work (additional API coverage) is tracked in `docs/SMARTSCHOOL-ROADMAP.md`.

## Credentials

Create a credential of type **SmartSchool API** and provide:

1. `API Endpoint` – e.g. `https://myschool.smartschool.be/Webservices/V3` (without `?wsdl`).
2. `Access Code` – the SmartSchool API access code tied to your tenant.

The credential is reused by every resource/operation. If you rotate the access code, update the credential and all workflows keep working.

## Compatibility

- Node.js 20+ (matches n8n 1.40+ default runtime).
- Developed and tested against n8n `1.45.x` but should run on any release that supports community nodes.

## Usage

1. **Fetch users from a class** – Choose resource `Group`, enter the class code (e.g. `1F`), and enable *Include Subgroups* if you need nested groups. Each member shows up as an item in the output data.
2. **Prepare helpdesk automations** – First run `List Helpdesk Items` to capture the `itemId` values for your mini database categories. Use those IDs in the `Create Helpdesk Ticket` operation (fields `Mini Database Item ID`, `Priority`, `User Identifier`, etc.).
3. **Send notifications** – Select resource `Message`, fill in the title/body, sender identifier (`Null` for anonymous), choose the account index, and optionally add base64 attachments via the collection input.

Every operation honours `Continue On Fail`, so you can branch on success/error or retry requests inside the workflow.

## Resources

- [SmartSchool Kit SDK](https://github.com/abrianto/smartschool-kit)
- [SmartSchool API documentation](https://schoolsync.gitbook.io/smartschool-kit)
- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)

## Version history

| Version | Notes |
| --- | --- |
| `0.1.0` | Initial public release with accounts, helpdesk and messaging operations. |
