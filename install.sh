#!/usr/bin/env bash
set -euo pipefail

# PMBOK 6 Skill Installer for Hermes Agent
# Installs the pmbok6 project management skill into ~/.hermes/skills/

SKILLS_DIR="${HOME}/.hermes/skills/project-management"
REPO_URL="https://github.com/mb-mal/pmbok6.git"
TEMP_DIR="$(mktemp -d)"
SKILL_NAME="pmbok6"

echo "=== PMBOK 6 Skill Installer ==="
echo ""

# Clone repo
echo "[1/3] Cloning ${REPO_URL}..."
git clone --depth 1 "${REPO_URL}" "${TEMP_DIR}" 2>/dev/null

# Create skills directory
echo "[2/3] Installing to ${SKILLS_DIR}/${SKILL_NAME}..."
mkdir -p "${SKILLS_DIR}"
rm -rf "${SKILLS_DIR}/${SKILL_NAME}"
cp -r "${TEMP_DIR}/${SKILL_NAME}" "${SKILLS_DIR}/"

# Clean up
echo "[3/3] Cleaning up..."
rm -rf "${TEMP_DIR}"

# Verify
echo ""
echo "✓ PMBOK 6 skill installed!"
echo "  Location: ${SKILLS_DIR}/${SKILL_NAME}"
echo "  Files: $(find "${SKILLS_DIR}/${SKILL_NAME}" -type f | wc -l) files, $(du -sh "${SKILLS_DIR}/${SKILL_NAME}" | cut -f1)"
echo ""
echo "  Try: hermes skill view pmbok6"
