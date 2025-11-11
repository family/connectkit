#!/usr/bin/env node

/**
 * Syncs quickstart templates to create-openfort package templates
 * Run this script before publishing to ensure templates are up-to-date
 */

const { execSync } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const REPO_ROOT = join(__dirname, '..');
const QUICKSTARTS_DIR = join(REPO_ROOT, 'examples/quickstarts');
const TEMPLATES_DIR = join(
  REPO_ROOT,
  'packages/create-openfort/cli/template/openfort-templates'
);

// Templates to sync (excluding betterauth and supabase as they might not be in create-openfort)
const TEMPLATES_TO_SYNC = ['firebase', 'headless', 'openfort-ui'];

console.log('🔄 Syncing quickstart templates to create-openfort...\n');

for (const template of TEMPLATES_TO_SYNC) {
  const sourcePath = join(QUICKSTARTS_DIR, template);
  const targetPath = join(TEMPLATES_DIR, template);

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️  Warning: Source template not found: ${sourcePath}`);
    continue;
  }

  console.log(`📋 Syncing ${template}...`);

  try {
    // Remove the old template
    if (existsSync(targetPath)) {
      rmSync(targetPath, { recursive: true, force: true });
    }

    // Copy the quickstart to templates, excluding node_modules, dist, and .env files
    execSync(
      `rsync -av --exclude='node_modules' --exclude='dist' --exclude='.env*' "${sourcePath}/" "${targetPath}/"`,
      { stdio: 'pipe' }
    );

    console.log(`✅ ${template} synced successfully`);
  } catch (error) {
    console.error(`❌ Error syncing ${template}:`, error.message);
    process.exit(1);
  }
}

console.log('\n✨ All templates synced successfully!');
