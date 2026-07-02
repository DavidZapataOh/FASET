#!/usr/bin/env bash
set -euo pipefail

# ADR-04 / §6 test 13: the raw CUFE (the fiscal authority id) lives OFF-ledger. It must
# NEVER appear in on-ledger Daml CODE — the Invoice carries only `invoiceHash` (its
# deterministic pseudonym). Doc comments that cite the rule (".. the raw CUFE ..") are
# fine; this guard ignores full-line `--` comments and flags any CUFE reference in
# actual code (e.g. a `cufe` field on a template, or a hardcoded CUFE value).

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIRS=(
  "$REPO_ROOT/quickstart/daml/faset/daml"
  "$REPO_ROOT/quickstart/daml/faset-tests/daml"
)

# Every whole-word `cufe` mention (case-insensitive; -w so identifiers like the test's
# own name `TestNoCufe` do NOT match), minus full-line `--` doc comments.
matches="$(grep -rniw 'cufe' "${DIRS[@]}" 2>/dev/null | grep -vE ':[0-9]+:[[:space:]]*--' || true)"

if [ -n "$matches" ]; then
  echo "FALLO: referencia a CUFE en codigo Daml on-ledger (no es comentario de doc):"
  echo "$matches"
  exit 1
fi

echo "OK: sin CUFE crudo en codigo Daml on-ledger (solo comentarios de doc ADR-04)"
