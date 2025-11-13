#!/usr/bin/env node

/**
 * Syncs quickstart templates to create-openfort package templates
 * Run this script before publishing to ensure templates are up-to-date
 */

const { execSync } = require('node:child_process');
const { existsSync, rmSync } = require('node:fs');
const { join, resolve } = require('node:path');

const REPO_ROOT = join(__dirname, '..');
const QUICKSTARTS_DIR = join(REPO_ROOT, 'examples/quickstarts');
const TEMPLATES_DIR = join(
  REPO_ROOT,
  'packages/create-openfort/template/openfort-templates'
);
const BACKEND_TEMPLATE_DIR = join(
  REPO_ROOT,
  'packages/create-openfort/template/backend'
);

// Templates to sync (excluding betterauth and supabase as they might not be in create-openfort)
const TEMPLATES_TO_SYNC = ['firebase', 'headless', 'openfort-ui'];
const BACKEND_REPO_URL = 'https://github.com/openfort-xyz/openfort-backend-quickstart.git';

console.log('🔄 Syncing quickstart templates to create-openfort...\n');

// Sync openfort-templates from quickstarts
for (const template of TEMPLATES_TO_SYNC) {
  const sourcePath = join(QUICKSTARTS_DIR, template);
  const targetPath = join(TEMPLATES_DIR, template);

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️  Warning: Source template not found: ${sourcePath}`);
    continue;
  }

  console.log(`📋 Syncing ${template}...`);

  try {
    // Validate paths are within expected directories
    const resolvedSource = resolve(sourcePath);
    const resolvedTarget = resolve(targetPath);
    const resolvedQuickstarts = resolve(QUICKSTARTS_DIR);
    const resolvedTemplates = resolve(TEMPLATES_DIR);
    
    if (!resolvedSource.startsWith(resolvedQuickstarts)) {
      throw new Error(`Invalid source path: ${resolvedSource}`);
    }
    if (!resolvedTarget.startsWith(resolvedTemplates)) {
      throw new Error(`Invalid target path: ${resolvedTarget}`);
    }

    // Remove the old template
    if (existsSync(resolvedTarget)) {
      rmSync(resolvedTarget, { recursive: true, force: true });
    }

    // Copy the quickstart to templates, excluding node_modules, dist, and .env files
    execSync(
      `rsync -av --exclude='node_modules' --exclude='dist' --exclude='.env*' "${resolvedSource}/" "${resolvedTarget}/"`,
      { stdio: 'pipe' }
    );

    console.log(`✅ ${template} synced successfully`);
  } catch (error) {
    console.error(`❌ Error syncing ${template}:`, error.message);
    process.exit(1);
  }
}

// Sync backend template from git repository
console.log('\n📋 Syncing backend template...');

try {
  // Remove the old backend template
  if (existsSync(BACKEND_TEMPLATE_DIR)) {
    rmSync(BACKEND_TEMPLATE_DIR, { recursive: true, force: true });
  }

  // Clone the backend repository
  execSync(
    `git clone --depth 1 ${BACKEND_REPO_URL} "${BACKEND_TEMPLATE_DIR}"`,
    { stdio: 'pipe' }
  );

  // Remove the .git directory to integrate it properly
  const gitDir = join(BACKEND_TEMPLATE_DIR, '.git');
  if (existsSync(gitDir)) {
    rmSync(gitDir, { recursive: true, force: true });
  }

  console.log('✅ backend synced successfully');
} catch (error) {
  console.error('❌ Error syncing backend:', error.message);
  process.exit(1);
}

console.log('\n✨ All templates synced successfully!');
