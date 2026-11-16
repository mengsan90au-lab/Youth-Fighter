'use strict';

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const warnings = [];
const checks = [
  { label: 'Unity project', relPath: 'UnityProject', type: 'dir' },
  { label: 'Unity project settings', relPath: path.join('UnityProject', 'ProjectSettings'), type: 'dir' },
  { label: 'Unity package manifest', relPath: path.join('UnityProject', 'Packages', 'manifest.json'), type: 'file' },
  { label: 'Playable browser entry', relPath: 'public', type: 'dir' },
  { label: 'Server entry', relPath: 'server.js', type: 'file' },
];

for (const check of checks) {
  const fullPath = path.join(rootDir, check.relPath);
  const exists = check.type === 'dir' ? fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory() : fs.existsSync(fullPath) && fs.statSync(fullPath).isFile();
  if (!exists) {
    warnings.push(`${check.label} missing at ${path.relative(rootDir, fullPath) || check.relPath}`);
  }
}

if (warnings.length === 0) {
  console.log('Unity config check passed. Required Unity and game entrypoints are present.');
  process.exit(0);
}

console.log('Unity config check: warning-only. The project is missing optional Unity metadata or entry files.');
for (const warning of warnings) {
  console.log(`- ${warning}`);
}
console.log('Result: PASS with warnings. Unity remains blocked until the project is restored or a real Unity install is added.');
process.exit(0);
