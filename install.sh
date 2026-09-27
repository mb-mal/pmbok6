#!/usr/bin/env bash
# PMBOK 6 skill installer.
#
#   curl -fsSL https://raw.githubusercontent.com/mb-mal/pmbok6/main/install.sh | bash
#   curl -fsSL .../install.sh | bash -s -- --agent claude
#
# Options:
#   --agent hermes|claude|codex   install into the agent's default skills dir (default: hermes)
#   --target DIR                  install into DIR/pmbok6 (overrides --agent)
#   --source DIR                  copy from a local checkout instead of cloning
#   --ref REF                     git branch or tag to install (default: main)
set -euo pipefail

REPO_URL="https://github.com/mb-mal/pmbok6.git"
SKILL_NAME="pmbok6"
AGENT="hermes"
TARGET=""
SOURCE=""
REF="main"

usage() { sed -n '2,13p' "$0" 2>/dev/null | sed 's/^# \{0,1\}//'; }
die() { echo "error: $*" >&2; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --agent)  AGENT="${2:-}"; shift 2 ;;
    --target) TARGET="${2:-}"; shift 2 ;;
    --source) SOURCE="${2:-}"; shift 2 ;;
    --ref)    REF="${2:-}"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown option: $1 (see --help)" ;;
  esac
done

if [ -z "$TARGET" ]; then
  case "$AGENT" in
    hermes) TARGET="${HOME}/.hermes/skills/project-management" ;;
    claude) TARGET="${HOME}/.claude/skills" ;;
    codex)  TARGET="${HOME}/.codex/skills" ;;
    *) die "unknown agent: $AGENT (use hermes, claude, codex or --target)" ;;
  esac
fi

echo "=== PMBOK 6 skill installer ==="

TEMP_DIR=""
cleanup() { if [ -n "$TEMP_DIR" ]; then rm -rf "$TEMP_DIR"; fi; }
trap cleanup EXIT

if [ -z "$SOURCE" ]; then
  command -v git >/dev/null 2>&1 || die "git is required"
  TEMP_DIR="$(mktemp -d)"
  echo "[1/3] Cloning ${REPO_URL} (${REF})..."
  git clone --quiet --depth 1 --branch "$REF" "$REPO_URL" "$TEMP_DIR" || die "clone failed"
  SOURCE="$TEMP_DIR"
else
  echo "[1/3] Using local source ${SOURCE}"
fi

[ -f "${SOURCE}/${SKILL_NAME}/SKILL.md" ] || die "${SOURCE}/${SKILL_NAME}/SKILL.md not found"

echo "[2/3] Installing to ${TARGET}/${SKILL_NAME}..."
mkdir -p "$TARGET"
STAGE="$(mktemp -d "${TARGET}/.${SKILL_NAME}.XXXXXX")"
cp -R "${SOURCE}/${SKILL_NAME}/." "$STAGE/"
rm -rf "${TARGET:?}/${SKILL_NAME}"
mv "$STAGE" "${TARGET}/${SKILL_NAME}"

echo "[3/3] Verifying..."
FILES="$(find "${TARGET}/${SKILL_NAME}" -type f | wc -l | tr -d ' ')"
echo ""
echo "✓ PMBOK 6 skill installed: ${TARGET}/${SKILL_NAME} (${FILES} files)"
if command -v node >/dev/null 2>&1; then
  echo "  Calculator: node ${TARGET}/${SKILL_NAME}/scripts/pmcalc.js"
else
  echo "  Note: install Node.js >= 18 to use scripts/pmcalc.js"
fi
