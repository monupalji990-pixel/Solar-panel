# TODO_PHASE_7 (Azure removal)

- [ ] Replace `sharedModules/smallModules/outlookGraph.ts` with a no-Azure stub implementation (remove `@azure/identity` import).
- [ ] Update any references if needed so TypeScript compiles.
- [ ] Ensure `npm start` / `ts-node` no longer fails on missing `@azure/identity`.
- [ ] Remove Azure dependencies from `package.json` (optional if compile is fixed by stub; prefer remove after verifying).
- [ ] (Optional) Remove leftover Azure test files and any Azure-specific code paths.

