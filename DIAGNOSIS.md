# CI Failure Diagnosis

The baseline GitHub Actions run is [CI Pipeline run 36523452327](https://github.com/pauljoe2k/ci-fix-drill/actions/runs/36523452327). Its install job passed and its `Run tests` step failed. The assertion and lockfile messages below are exact local reproductions because the baseline workflow did not reach those checks.

## Test job has no checkout

- **Step name:** Run tests (test job)
- **Exact error from the GitHub Actions log:** `npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/home/runner/work/ci-fix-drill/ci-fix-drill/package.json'`
- **Cause:** The test job ran on a separate, fresh GitHub-hosted runner and had no `actions/checkout` step. npm therefore had no repository files or `package.json` to run. The install job's checkout and `node_modules` are not shared with another job.

## Discount assertion

- **Step name:** Run tests (Jest)
- **Exact error from the test log:** `Expected: 100` and `Received: 90`
- **Cause:** `calculateDiscount(100, 10)` correctly returns 90. The assertion expected the original price instead of the price after a 10% discount.

## Currency object matcher

- **Step name:** Run tests (Jest)
- **Exact error from the test log:** `If it should pass with deep equality, replace "toBe" with "toStrictEqual"` and `Received: serializes to the same string`
- **Cause:** `formatCurrency` returns a new object with the expected values. `toBe` checks whether the actual and expected objects are the same reference, not whether their properties match; the assertion needs a deep-equality matcher.

## Dependency lockfile mismatch

- **Step name:** Install dependencies (`npm ci` reproducibility check)
- **Exact error from the install log:** `npm error Missing: lodash@4.18.1 from lock file`
- **Cause:** `package.json` declares lodash, but the committed lockfile did not contain its package entry or root dependency metadata. `npm ci` therefore rejected the lockfile as out of sync.