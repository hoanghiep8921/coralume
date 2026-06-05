#!/bin/bash
# ============================================================
# Coralume Database Backup Script
# ============================================================
# SRS Requirement: Backup database hàng ngày, lưu ít nhất 30 ngày
#
# Usage:
#   chmod +x scripts/backup-db.sh
#   scripts/backup-db.sh
#
# Schedule via Vercel cron or GitHub Actions:
#   Vercel: vercel.json cron job (daily)
#   GitHub: .github/workflows/backup.yml (daily)
#
# Retention: 30 days (auto-cleanup)
# ============================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
BACKUP_FILE="${BACKUP_DIR}/coralume-backup-${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting Coralume database backup..."

# Use DATABASE_URL from environment
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set."
  exit 1
fi

# Parse DATABASE_URL for pg_dump
# Format: postgresql://user:password@host:port/database
PG_URL="${DATABASE_URL#postgresql://}"
PG_URL="${PG_URL#postgres://}"

PG_USER="${PG_URL%%:*}"
PG_REST="${PG_URL#*:}"
PG_PASS="${PG_REST%%@*}"
PG_HOST_PORT_DB="${PG_REST#*@}"
PG_HOST="${PG_HOST_PORT_DB%%:*}"
PG_REST2="${PG_HOST_PORT_DB#*:}"
PG_PORT="${PG_REST2%%/*}"
PG_DB="${PG_REST2#*/}"
PG_DB="${PG_DB%%\?*}"

# Run pg_dump
echo "[$(date)] Dumping database: ${PG_DB}@${PG_HOST}:${PG_PORT} ..."
PGPASSWORD="$PG_PASS" pg_dump \
  -h "$PG_HOST" \
  -p "${PG_PORT:-5432}" \
  -U "$PG_USER" \
  -d "$PG_DB" \
  --no-owner \
  --no-acl \
  | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Clean up old backups (older than RETENTION_DAYS)
echo "[$(date)] Cleaning up backups older than ${RETENTION_DAYS} days..."
DELETED=$(find "$BACKUP_DIR" -name "coralume-backup-*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete -print | wc -l | tr -d ' ')
echo "[$(date)] Cleaned up ${DELETED} old backup(s)."

# List current backup count
CURRENT_COUNT=$(find "$BACKUP_DIR" -name "coralume-backup-*.sql.gz" | wc -l | tr -d ' ')
echo "[$(date)] Current backup count: ${CURRENT_COUNT}"

if [ "$CURRENT_COUNT" -eq 0 ]; then
  echo "WARNING: No backups remain after cleanup!"
  exit 1
fi

echo "[$(date)] Backup job completed successfully."
