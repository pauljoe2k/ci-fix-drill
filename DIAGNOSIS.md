# CI Failure Diagnosis

The fork's GitHub Actions API reports `0 workflows` and `0 runs`, including after a new baseline commit was pushed, although `.github/workflows/ci.yml` is present on `main`. GitHub provides no remote step output in this state. The messages below are exact local reproductions, not quotations attributed to a GitHub Actions run.

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