// FASET — TEST: every vector's stored invoiceHash must equal invoiceHash(cufe).
// The whitespace vector (same hash as its trimmed twin) proves canonical() trims.
// Run: node check-hash-vectors.mjs      (exit 0 = OK, exit 1 = mismatch)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { invoiceHash } from './invoice-hash.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const vectors = JSON.parse(readFileSync(join(here, 'invoice-hash-vectors.json'), 'utf8'));

let failures = 0;
for (const [i, v] of vectors.entries()) {
  const got = invoiceHash(v.cufe);
  if (got !== v.invoiceHash) {
    failures++;
    console.error(
      `FAIL vector[${i}] cufe=${JSON.stringify(v.cufe)}\n` +
      `  expected ${v.invoiceHash}\n` +
      `  got      ${got}`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} vector(s) failed`);
  process.exit(1);
}
console.log(`OK ${vectors.length} vectors`);
