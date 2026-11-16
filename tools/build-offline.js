'use strict';

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist', 'offline');
const requiredFiles = [
  'public',
  'server.js',
  'README.md',
  'START-HERE.md',
  'Youth-Fighter.html',
];

for (const relPath of requiredFiles) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required build input: ${relPath}`);
  }
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

function copyItem(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyItem(path.join(src, child), path.join(dest, child));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

for (const relPath of requiredFiles) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  copyItem(src, dest);
}

const manifest = {
  name: 'Youth Fighter Offline Build',
  generatedAt: new Date().toISOString(),
  version: '0.10.0',
  entryPoints: [
    'public/index.html',
    'Youth-Fighter.html',
    'server.js',
  ],
};

fs.writeFileSync(path.join(distDir, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Offline build created at ${distDir}`);
console.log('Entry points: public/index.html, Youth-Fighter.html, server.js');
