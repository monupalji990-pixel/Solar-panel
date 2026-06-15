# TODO - MongoDB Query Optimization

- [ ] Identify MongoDB slow/inefficient patterns in the provided code (missing $match early, $lookup before $match, missing $project, missing pagination).
- [ ] Add caching (ioredis) for GET/dashboard/list/single routes with TTL rules.
- [ ] Add query execution time logging in development mode.
- [ ] Propose MongoDB indexes (at least: _id, status, createdAt, assignee, userId + query-specific ones).
- [ ] Rewrite the identified endpoints in TypeScript with correct pipeline ordering rules:
  - [ ] Always put $match first
  - [ ] Always put $limit before $lookup
  - [ ] Always use $project
- [ ] Clear cache on POST/PUT/DELETE mutations.
- [ ] Provide before vs after comparison and estimated performance improvements.
- [ ] Compression kept as-is.

Progress:
- [x] Located target endpoints to optimize:
  - AdminController.listOfQuotes (projects/quote/controller.ts)
  - RegUserController.listLeadRegUser (projects/lead/controller.ts)
- [ ] Implement caching + logging + pipeline rewrite
- [ ] Add redis dependency + cache util
- [ ] Update indexes suggestions (as comments)

