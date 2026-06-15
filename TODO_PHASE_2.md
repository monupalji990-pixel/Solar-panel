# Phase 2 — Lead Auto-Creation + Lead Cleanup (React 16)

## Steps
1. Create `LeadPayload` interface in `src/projects/lead/types/leadTypes.ts`.
2. Create/update `src/constants/leadTypes.ts` with simplified lead types.
3. Add new client helper `src/projects/lead/services/leadService.ts` posting to `/api/v2/solar-leads/create`.
4. Implement auto-lead creation in `src/projects/consumer/redux/consumer.ts` after successful customer creation.
5. Ensure logged-in user (createdBy name/id) is available in the saga; wire from auth state.
6. Update UI dropdowns/filters to remove old B2B lead types from new lead creation (do not remove display for old DB).
7. Implement Lead form cleanup in the correct lead edit component (remove only unused/duplicate blocks; keep appointmentBooker/leadGenerator).
8. Rename “Action Date” label to “Lead Contacted On” everywhere it appears.
9. Add solar lead status constants + step-jump validation in lead status update UI.
10. Verify Paid Solar lead dashboard/list shows auto-created leads.

## Status
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
- [ ] Step 4
- [ ] Step 5
- [ ] Step 6
- [ ] Step 7
- [ ] Step 8
- [ ] Step 9
- [ ] Step 10

