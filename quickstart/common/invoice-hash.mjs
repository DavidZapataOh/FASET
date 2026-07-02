// FASET — canonical CUFE hashing. Shared spec: faset-hash-spec.md.
//   invoiceHash = sha256_hex_lower( utf8( canonical(CUFE) ) )
// This is the single source of truth the frontend TS helper (sprint-08) must match.
import { createHash } from 'node:crypto';

/** canonical(CUFE) = NFC(trim(CUFE)). No case folding (CUFE is a fixed token). */
export const canonical = (cufe) => cufe.trim().normalize('NFC');

/** invoiceHash(CUFE) = lowercase hex SHA-256 of the UTF-8 bytes of canonical(CUFE). */
export const invoiceHash = (cufe) =>
  createHash('sha256').update(Buffer.from(canonical(cufe), 'utf8')).digest('hex');
