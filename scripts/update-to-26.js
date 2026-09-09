import fs from 'fs';

// Always read from pristine original 2025 backup which has exactly 29 subpaths:
// Subpath 0: Outer rect (1440x698)
// Subpath 1: The '2'
// Subpath 2: The '5' (replaced with original official FIFA 26 '6')
// Subpaths 3..28: SURGE, THE HOME OF CHAMPIONS lettering
const svgBackup = fs.readFileSync('public/Subtract_2025_backup.svg', 'utf8');

// Original official FIFA 26 '6' contour:
// X range: [792.5, 1368.8], Y range: [70.8, 514.0]
const path6 = 
  'M 1224.73 70.80 ' +
  'L 936.58 70.80 ' +
  'C 857.00 70.80 792.50 136.94 792.50 218.53 ' +
  'L 792.50 366.26 ' +
  'C 792.50 447.86 857.00 514.00 936.58 514.00 ' +
  'L 1224.73 514.00 ' +
  'C 1304.30 514.00 1368.80 447.86 1368.80 366.26 ' +
  'C 1368.80 284.67 1304.30 218.53 1224.73 218.53 ' +
  'L 1368.80 218.53 ' +
  'C 1368.80 136.94 1304.30 70.80 1224.73 70.80 Z ';

const dMatch = svgBackup.match(/d="([^"]+)"/);
if (dMatch) {
  const parts = dMatch[1].split(/(?=M)/);
  console.log(`Original pristine subpaths count: ${parts.length}`);
  parts[2] = path6;
  const newD = parts.join('');
  const newSvg = svgBackup.replace(dMatch[0], `d="${newD}"`);
  fs.writeFileSync('public/Subtract.svg', newSvg);
  console.log('Successfully updated public/Subtract.svg with original official 6!');
}