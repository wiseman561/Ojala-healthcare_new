#!/usr/bin/env bash
# Cleanup and Installation Script for Ojala Healthcare Platform
# This script frees up inodes and installs dependencies for frontend projects

set -e

echo "===== STARTING CLEANUP AND INSTALLATION PROCESS ====="

# Step 1: Free up inodes
echo "Step 1: Freeing up inodes..."

echo "Cleaning npm cache..."
npm cache clean --force

echo "Removing node_modules directories..."
find . -name "node_modules" -type d -prune -exec rm -rf {} \; 2>/dev/null || true

echo "Pruning Docker system..."
docker system prune --volumes --force

echo "Cleaning temporary files..."
rm -rf /tmp/* 2>/dev/null || true

echo "Cleaning old log files..."
sudo find /var/log -type f -name "*.gz" -delete 2>/dev/null || true
sudo find /var/log -type f -name "*.old" -delete 2>/dev/null || true
sudo find /var/log -type f -name "*.1" -delete 2>/dev/null || true

# Step 2: Install dependencies for frontend projects
echo "Step 2: Installing dependencies for frontend projects..."

FRONTEND_PROJECTS=(
  "apps/Ojala.Web"
  "apps/Ojala.PatientPortal"
  "apps/rn-dashboard"
  "apps/employer-dashboard"
  "apps/patient-app"
)

for project in "${FRONTEND_PROJECTS[@]}"; do
  if [ -d "$project" ]; then
    echo "Installing dependencies for $project..."
    (cd "$project" && npm install)
    echo "Running audit fix for $project..."
    (cd "$project" && npm audit fix --force || true)
  else
    echo "Warning: Directory $project not found, skipping."
  fi
done

echo "===== CLEANUP AND INSTALLATION PROCESS COMPLETED ====="
echo "If you encounter any issues, please check the following:"
echo "1. Run 'df -i' to verify inode usage"
echo "2. Run 'npm audit' in each project directory to check for remaining vulnerabilities"
echo "3. Verify that all package.json files have the security patches applied"
