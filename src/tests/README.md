# BOM Recipe Calculator Refactoring Tests

This directory contains unit and integration tests for the refactoring of the
recipe calculation module (Bill of Materials).

## Directory Structure

The tests are organized into the following categories:

- **models**: Tests for model classes (Product, TreeNode, etc.)
- **services**: Tests for services (Calculator, TreeValidator, Utils, etc.)
- **builders**: Tests for builders (MaterialsTreeBuilder, etc.)
- **traversers**: Tests for traversers (TreeTraverser, etc.)
- **integration**: Integration tests for the complete flow

## Test Data

The `testData.ts` file contains test data shared between different tests,
including:

- Example products (flour, water, salt, yeast)
- Semi-finished products (dough)
- Final products (bread)
- Products for testing circular dependencies
- Expected results for validation

## How to Run the Tests

### Run All Tests

#### Windows (PowerShell)

```powershell
.\run_all_tests.ps1
```

#### Windows (CMD)

```cmd
run_all_tests.bat
```

#### Unix/Linux/Mac

```bash
./run_all_tests.sh
```

### Run Specific Tests

#### Windows (PowerShell)

```powershell
# Standard version
.\run_tests.ps1

# Compact version
.\run_tests_compact.ps1

# Ultra-compact version (all tests in one line)
.\run_tests_oneline.ps1

# Run only passing tests
.\run_passing_tests.ps1
```

#### Windows (CMD)

```cmd
run_tests.bat
```

#### Unix/Linux/Mac

```bash
./run_tests.sh
```

### Run an Individual Test

```
deno test --allow-all src/refactoring/tests/[category]/[FileName].test.ts
```

Example:

```
deno test --allow-all src/refactoring/tests/traversers/TreeTraverser.test.ts
```

## Requirements

- Deno runtime (version 1.x or higher)

## Naming Conventions

- Test files: `[ClassName].test.ts`
- Test functions:
  `Deno.test("[ClassName].[method] should [expected behavior]", () => { ... })`
