#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'babel.config.js');

console.log('Checking Babel configuration...');

if (!fs.existsSync(configPath)) {
  console.error('Error: babel.config.js not found');
  process.exit(1);
}

try {
  const babelConfig = require(configPath);

  if (typeof babelConfig !== 'function') {
    console.error('Error: babel.config.js should export a function');
    process.exit(1);
  }

  const api = {
    cache: (value) => {
      console.log(`Cache configured: ${value}`);
    },
  };

  const config = babelConfig(api);

  if (!config.presets || !Array.isArray(config.presets)) {
    console.error('Error: babel.config.js must have presets array');
    process.exit(1);
  }

  if (!config.presets.includes('babel-preset-expo')) {
    console.error('Error: babel-preset-expo must be included in presets');
    process.exit(1);
  }

  console.log('✓ Babel configuration is valid');
  console.log('Presets:', config.presets);
  console.log('Plugins:', config.plugins || []);

  process.exit(0);
} catch (error) {
  console.error('Error loading babel.config.js:', error.message);
  process.exit(1);
}
