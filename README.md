# QR menu prototype

A guest scans the QR code on their table and the menu opens in the phone browser with the right table already shown. No app, no login.

- `/menu/?table=3` shows "Table 3" with the content for that table.
- All dishes, prices, photos and tables live in one file: `menu/data.js`.
- Static files only. It runs on any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel, S3).

## Project layout

```
index.html          Landing page with the three sample QR codes
menu/
  index.html        The menu page that guests see
  app.js            Reads the table from the link and renders the page
  data.js           Mock data: restaurant, tables, categories, dishes
  styles.css        All styling
  img/              Dish photos, 360 x 360
qr/                 Generated QR codes, one SVG per table
tools/make-qr.mjs   Script that generates the QR codes
```

## Run it on your computer

The menu page uses JavaScript modules, so it must be opened through a local web server, not by double clicking the file.

```bash
npx serve .
```

Then open the address it prints, for example `http://localhost:3000/menu/?table=3`.

## Deploy

Upload the whole folder to any static host. No build step is needed.

After the site is live, regenerate the QR codes so they point at the live address:

```bash
npm install
npm run qr -- https://your-site.example.com
```

This writes `qr/table-1.svg`, `qr/table-2.svg` and `qr/table-3.svg`. Upload the `qr` folder again, then print the codes. SVG stays sharp at any print size.

## How the table is detected

`app.js` reads the `table` value from the link and looks it up in the `tables` list in `data.js`.

| Link | Result |
| --- | --- |
| `/menu/?table=3` | "Table 3", its area and seats, and the dish picked for that table |
| `/menu/?table=99` | A friendly "We could not find that table" note. The menu is still shown. |
| `/menu/` | A "Welcome" note that asks the guest to scan the code. The menu is still shown. |

## Change the menu

Open `menu/data.js`. It is the only file you edit.

Add a table:

```js
tables: {
  1: { area: 'Window side', seats: 2, pick: 'prawn-stir-fry' },
  4: { area: 'Bar', seats: 2, pick: 'paella' },
},
```

`pick` is the `id` of the dish to highlight for that table. Run `npm run qr` again to get a code for the new table.

Add a dish to a category:

```js
{
  id: 'grilled-corn',
  name: 'Grilled Corn',
  description: 'Charred corn with chilli butter and lime.',
  price: 12,
  image: 'img/grilled-corn.jpg',
},
```

Photos are shown square. Save them at 360 x 360 pixels as JPEG to keep the page fast.

## Ready for real data and ordering

- **Real data:** the page gets its data only through `getMenu()` in `data.js`. Replace the body of that function with a `fetch()` call to your API or CMS and return the same shape. Nothing else changes.
- **Ordering:** every dish row carries `data-item-id`, and the table number is already known on the page. An "add to order" button and a cart can be added on top without changing the layout.

## Speed

- First load of the menu is about 260 KB including photos.
- Only the photos near the top load at once. The rest load as the guest scrolls.
- No framework and no build step. The page code is about 16 KB before compression.

## Browser support

Current iOS Safari and Android Chrome, plus desktop Chrome, Firefox, Safari and Edge. Minimum versions: Safari 15.4, Chrome 93, Firefox 92.
