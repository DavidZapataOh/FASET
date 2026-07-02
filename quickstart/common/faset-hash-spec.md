# FASET — `invoiceHash` specification

Shared contract between the **frontend TS helper** (`frontend/src/lib/invoiceHash.ts`, sprint-08),
these **test-vectors**, and any other hashing path. All MUST produce byte-identical output, or
financier A and B won't collide in the Single-Pledge Registry.

## Definition

```
invoiceHash = sha256_hex_lower( utf8( canonical(CUFE) ) )
```

- **Preimage = ONLY the CUFE** — the Colombian DIAN fiscal invoice id. No amount / NIT / date
  appended (the CUFE already binds them internally). **No party-chosen salt** — a supplier-controlled
  salt would break the moat (the supplier is the adversary in double-financing). See CONTEXT.md ADR-04.
- **`canonical(CUFE)` = `NFC( trim(CUFE) )`**
  - `trim` — strip surrounding whitespace.
  - `NFC` — Unicode Normalization Form C.
  - **No case folding.** ⚠️ CONFIRMAR con el equipo antes de sprint-08: el CUFE DIAN es un token
    hex/alfanumérico fijo, así que trim-only es seguro; si algún emisor variara el caso, revisar.
- **Output** — SHA-256 of the UTF-8 bytes of `canonical(CUFE)`, hex-encoded, lowercase.

## Honestidad (CONTEXT.md ADR-05)
El CUFE es **público** (factura / QR / portal DIAN) → `sha256(CUFE)` es un **pseudónimo determinista**,
no un commitment con ocultamiento. La ceguera entre rivales viene de los **stakeholders**, no del hash.

## Verificación
`invoice-hash-vectors.json` fija pares `{cufe → invoiceHash}` conocidos; `check-hash-vectors.mjs`
recomputa `invoiceHash(cufe)` (vía `invoice-hash.mjs`) y compara. El vector con espacios comparte
hash con su gemelo sin espacios → prueba que `canonical` hace trim.
Correr: `node check-hash-vectors.mjs` (exit 0 = OK).
