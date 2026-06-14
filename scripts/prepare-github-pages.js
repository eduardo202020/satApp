const fs = require('node:fs');
const path = require('node:path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '404.html');
const noJekyllPath = path.join(distDir, '.nojekyll');

if (!fs.existsSync(indexPath)) {
  throw new Error('Missing dist/index.html. Run the Expo web export before preparing GitHub Pages.');
}

fs.copyFileSync(indexPath, fallbackPath);
fs.writeFileSync(noJekyllPath, '');

console.log('Prepared GitHub Pages files: dist/404.html, dist/.nojekyll');
