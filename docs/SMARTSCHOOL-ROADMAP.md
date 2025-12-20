## SmartSchool Node Expansion Roadmap

This document captures the long-term plan for expanding the SmartSchool n8n package from the current proof of concept (groups → getAllAccounts) into a complete, user-friendly node suite that exposes the whole SmartSchool API surface.

---

### Guiding Principles

1. **Composable UX** – Fewer, well-scoped nodes with clear resources/operations so workflows stay readable.
2. **Consistency** – Shared fields (group code, user identifier, recursive flag, etc.) must behave the same everywhere.
3. **Safety First** – Mutating calls (create/update/delete) should default to sandbox/testing modes and provide explicit confirmation fields.
4. **Incremental Delivery** – Ship in vertical slices (resource by resource) so we always have a releasable package.

---

### Proposed Node Topology

| Node | Purpose | Notes |
| --- | --- | --- |
| `SmartSchool` (existing) | **Read-focused** resource router for: Groups & Classes, Accounts, Absences, Courses, Parameters, Student Career | Continue to grow resource/operation matrix; handles all GET-like endpoints. |
| `SmartSchool Admin` | Mutations for Users, Groups, Classes, Passwords, Course membership, Helpdesk | Requires additional safeguards, preview modes, optional dry-run output. |
| `SmartSchool Messaging` | Sending messages, signatures, notifications | Keeps message-specific fields isolated; can evolve into trigger later. |
| `SmartSchool Credentials` | Already implemented | Needs UI polish once icons finalized. |

> We can collapse Admin + Messaging back into the main node later if UX testing shows it is manageable, but start with this separation to keep parameter panels sane.

---

### Resource Buckets & Operations

Below is the proposed mapping (✅ = implemented, ⏳ = in progress, ⛳ = planned).

| Bucket | Operations | Status |
| --- | --- | --- |
| **Accounts & Users** | getAllAccounts ✅, getAllAccountsExtended ✅, getUserDetails, getUserDetailsByNumber, getUserDetailsByUsername, getUserDetailsByScannableCode, getUserOfficialClass, saveUser, delUser, setAccountStatus, changeUsername, changeInternNumber, changePasswordAtNextLogin, forcePasswordReset, replaceInum, saveUserParameter, removeCoAccount, savePassword | ⛳ |
| **Groups & Classes** | getAllGroupsAndClasses, getClassList, getClassListJson, getClassTeachers, saveGroup, saveClass, saveUserToGroup, removeUserFromGroup, delClass, saveClassList, saveClassListJson, getSchoolyearDataOfClass, saveSchoolyearDataOfClass, getSkoreClassTeacherCourseRelation, clearGroup, unregisterStudent | ⛳ |
| **Absences** | getAbsents, getAbsentsWithAlias, getAbsentsByDate, getAbsentsWithAliasByDate, getAbsentsWithInternalNumberByDate, getAbsentsWithUsernameByDate, getAbsentsByDateAndGroup | ⛳ |
| **Messages** | sendMsg, saveSignature | ⛳ |
| **Courses** | addCourse, addCourseStudents, addCourseTeacher, getCourses | ⛳ |
| **Helpdesk** | addHelpdeskTicket, getHelpdeskMiniDbItems | ⛳ |
| **Parameters** | getReferenceField, returnCsvErrorCodes, returnJsonErrorCodes | ⛳ |
| **System** | startSkoreSync, checkStatus | ⛳ |
| **Deprecated** | deactivateTwoFactorAuthentication (skip, doc-only) | ❌ |

---

### Iteration Checklists

We will work resource-by-resource. Each row should end up in git history as its own PR/commit for easy review.

#### Milestone 1 – Foundation Hardening

- [ ] Normalize icon filenames + confirm cache busting in n8n (light/dark)  
- [ ] Add `SmartSchool` node metadata (`node.json`) links & docs  
- [ ] Create shared field definitions (e.g., `groupCodeField`, `recursiveToggle`, `userIdentifierField`) under `nodes/SmartSchool/shared/`  
- [ ] Introduce Zod schemas for credentials + common parameters  
- [ ] Add Vitest test harness for `GenericFunctions` & first operation  

#### Milestone 2 – Read Operations Expansion

- [ ] Accounts: add `getUserDetails*` trio  
- [ ] Accounts: add `getUserOfficialClass`  
- [ ] Groups: add `getAllGroupsAndClasses`, `getClassList`, `getClassListJson`, `getClassTeachers`  
- [ ] Absences: implement full set with pagination helpers  
- [ ] Courses (read): `getCourses`  
- [ ] Parameters: `getReferenceField`, error code lookups  

#### Milestone 3 – Mutation Suite

- [ ] Users: `saveUser`, `delUser`, status/password helpers  
- [ ] Groups/Classes: create/update/delete + membership adjustments  
- [ ] Courses: `addCourse`, `addCourseStudents`, `addCourseTeacher`  
- [ ] Helpdesk: ticket creation  
- [ ] Messaging: `sendMsg`, `saveSignature` (may go into dedicated node)  

#### Milestone 4 – Advanced

- [ ] Start/monitor Skore sync  
- [ ] Student career endpoints  
- [ ] Optional triggers/webhooks once API coverage confirmed  
- [ ] Documentation refresh + sample workflows  

---

### Implementation Notes

1. **Routing Strategy**  
   - Keep using declarative resource-operation arrays within the `SmartSchool` node for GET endpoints.  
   - For mutations, consider a programmatic dispatcher (`execute()` with services) to handle loops, batching, and confirmation prompts.

2. **Transport Layer**  
   - `getSmartSchoolClient` already wraps the SDK. Add a fallback to raw HTTP for any endpoints missing in the SDK (guarded by feature flags).

3. **Error Handling**  
   - Map `SmartschoolError` codes to `NodeOperationError` with user-friendly messages.  
   - Offer `continueOnFail` with enriched context (operation, payload snippet).

4. **Testing**  
   - Use mocked SDK responses for unit tests.  
   - Provide fixtures (JSON) that mimic the XML→JSON transformation described in the SDK docs.

5. **Documentation**  
   - Each milestone should update `docs/` with usage notes and sample workflows.  
   - Include a changelog entry (SEMVER) highlighting newly supported endpoints.

---

### Progress Tracking

Use this table to keep status visible. Update `Status` column as work proceeds.

| Item | Status | Notes |
| --- | --- | --- |
| Icons renamed & cache-busting | ⏳ | Waiting for confirmation after next n8n restart |
| Shared parameter descriptions | ⛳ | Not started |
| Accounts detail operations | ⛳ | Not started |
| Helpdesk endpoints (list/create) | ✅ | `getHelpdeskMiniDbItems` + `addHelpdeskTicket` in SmartSchool node |
| Messaging (sendMsg) | ✅ | Send SmartSchool messages incl. optional attachments |
| Absence endpoints | ⛳ | Not started |
| Mutation node scaffold | ⛳ | Not started |
| Messaging node | ⛳ | Not started |

---

This roadmap is intentionally iterative—feel free to add rows/milestones as new API capabilities or UX considerations arise. Always ensure each shipped slice leaves the package in a usable state. 
