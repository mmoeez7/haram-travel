#!/usr/bin/env bash
set -euo pipefail

export PATH="${HOME}/micromamba/envs/haram-pg/bin:${PATH}"
export PGDATA="${HOME}/pgsql/haram-travel-data"
export PGPORT=5432

if [[ ! -d "$PGDATA" ]]; then
  echo "Postgres data directory missing at $PGDATA"
  echo "Re-run Phase 0 setup or initdb first."
  exit 1
fi

if pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  echo "PostgreSQL already running at 127.0.0.1:${PGPORT}"
else
  pg_ctl -D "$PGDATA" -l "${HOME}/pgsql/haram-travel.log" start
  echo "PostgreSQL started at 127.0.0.1:${PGPORT}"
fi

pg_isready -h 127.0.0.1 -p "$PGPORT"
