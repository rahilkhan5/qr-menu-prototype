// Makes one QR code per table in menu/data.js.
//
//   npm run qr -- https://your-site.example.com
//
// Each code points at <base>/menu/?table=N and is saved as qr/table-N.svg.
// SVG stays sharp at any print size.

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { getMenu } from '../menu/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const input = process.argv[2];

if (!input) {
  console.error('Give the address of the live site, for example:\n  npm run qr -- https://your-site.example.com');
  process.exit(1);
}

let base;
try {
  base = new URL(input.endsWith('/') ? input : `${input}/`);
} catch {
  console.error(`"${input}" is not a full web address. It must start with https://`);
  process.exit(1);
}

const { tables } = await getMenu();
await mkdir(join(root, 'qr'), { recursive: true });

for (const number of Object.keys(tables)) {
  const link = new URL(`menu/?table=${encodeURIComponent(number)}`, base).href;
  const svg = await QRCode.toString(link, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#18201a', light: '#ffffff' },
  });
  await writeFile(join(root, 'qr', `table-${number}.svg`), svg);
  console.log(`Table ${number}: ${link}`);
}
