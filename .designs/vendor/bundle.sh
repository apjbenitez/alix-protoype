#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
npx --yes esbuild entry.tsx \
  --bundle \
  --format=esm \
  --jsx=automatic \
  --loader:.css=css \
  --outfile=alix-ui.js
