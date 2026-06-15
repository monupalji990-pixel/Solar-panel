# Company performance slow fixes (MongoDB/Controller)

## Step 1 (done)
- Update `listCompanyRegUser()` aggregation pipeline in `back-end-new/projects/company/controller.ts`
  - Move `$lookup` for `Assignee` before `$skip`.
  - Fix response to return real `count`.

## Step 2 (done)
- Add required indexes in Mongoose models:
  - `back-end-new/models/Company.ts`
  - `back-end-new/models/Site.ts`
  - `back-end-new/models/user.ts`


## Step 3
- (next) Optimize `showCompanyRegUser()` populate depth to only populate required fields.


## Step 4
- Restart service and validate endpoint timings.

