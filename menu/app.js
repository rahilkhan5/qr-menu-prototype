import { getMenu } from './data.js';

// Small helper: build an element without touching innerHTML,
// so text from the data file can never run as markup.
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'text') node.textContent = value;
    else if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) node.append(child);
  return node;
}

// Reads the table from the link, for example /menu/?table=3
// Returns { status: 'ok' | 'missing' | 'unknown', number, table }
export function readTable(tables, search = location.search) {
  const raw = new URLSearchParams(search).get('table');
  if (raw === null || raw.trim() === '') return { status: 'missing' };
  const number = raw.trim();
  const table = Object.hasOwn(tables, number) ? tables[number] : null;
  return table ? { status: 'ok', number, table } : { status: 'unknown', number };
}

function formatPrice(amount, currency) {
  return `${currency} ${amount}`;
}

function findItem(menu, id) {
  for (const category of menu.categories) {
    const item = category.items.find((entry) => entry.id === id);
    if (item) return item;
  }
  return null;
}

function renderHeader(menu, result) {
  document.getElementById('brand-name').textContent = menu.restaurant.name;
  document.getElementById('brand-tagline').textContent = menu.restaurant.tagline;

  const stub = document.getElementById('stub');
  const title = document.getElementById('table-title');
  const meta = document.getElementById('table-meta');

  if (result.status === 'ok') {
    title.textContent = `Table ${result.number}`;
    meta.textContent = `${result.table.area}, seats ${result.table.seats}`;
    document.title = `Table ${result.number} menu, ${menu.restaurant.name}`;
  } else {
    stub.classList.add('is-problem');
    document.title = `Menu, ${menu.restaurant.name}`;
    if (result.status === 'unknown') {
      title.textContent = 'We could not find that table';
      meta.textContent = 'Please scan the code on your table again, or ask our team. You can still browse the menu below.';
    } else {
      title.textContent = 'Welcome';
      meta.textContent = 'Scan the code on your table to see your table here. The full menu is below.';
    }
  }
  stub.hidden = false;
}

function renderPick(menu, result) {
  if (result.status !== 'ok') return null;
  const item = findItem(menu, result.table.pick);
  if (!item) return null;

  const section = document.getElementById('pick');
  section.append(
    el('h2', { id: 'pick-title', text: `Picked for table ${result.number}` }),
    el('figure', {}, [
      el('img', {
        src: item.image,
        alt: item.name,
        width: '360',
        height: '360',
        fetchpriority: 'high',
        decoding: 'async',
      }),
      el('figcaption', {}, [
        el('strong', { text: item.name }),
        el('span', { text: formatPrice(item.price, menu.restaurant.currency) }),
      ]),
    ]),
  );
  section.hidden = false;
  return item.id;
}

// One menu row. data-item-id is the hook for the ordering layer:
// an "add to order" button can be appended here later without changing the layout.
function renderItem(item, currency, { eager, isPick }) {
  return el('li', { class: isPick ? 'item is-pick' : 'item', 'data-item-id': item.id }, [
    el('img', {
      src: item.image,
      alt: '',
      width: '360',
      height: '360',
      loading: eager ? 'eager' : 'lazy',
      decoding: 'async',
    }),
    el('h3', { text: item.name }),
    el('p', { class: 'price', text: formatPrice(item.price, currency) }),
    el('p', { class: 'desc', text: item.description }),
  ]);
}

function renderMenu(menu, pickId) {
  const nav = document.getElementById('cats');
  const root = document.getElementById('menu');

  menu.categories.forEach((category, index) => {
    nav.append(el('a', { href: `#${category.id}`, text: category.name }));

    const items = category.items.map((item) =>
      renderItem(item, menu.restaurant.currency, { eager: index === 0, isPick: item.id === pickId }),
    );
    root.append(
      el('section', { class: 'section', id: category.id, 'aria-labelledby': `${category.id}-title` }, [
        el('h2', { id: `${category.id}-title`, text: category.name }),
        el('ul', { class: 'items' }, items),
      ]),
    );
  });
}

// Highlights the section link for the part of the menu on screen.
function trackActiveSection() {
  const links = new Map(
    [...document.querySelectorAll('#cats a')].map((link) => [link.getAttribute('href').slice(1), link]),
  );
  const setActive = (id) => {
    for (const [key, link] of links) {
      if (key === id) {
        link.setAttribute('aria-current', 'true');
        link.scrollIntoView({ block: 'nearest', inline: 'center' });
      } else {
        link.removeAttribute('aria-current');
      }
    }
  };
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-64px 0px -60% 0px' },
  );
  document.querySelectorAll('.section').forEach((section) => observer.observe(section));
}

async function start() {
  try {
    const menu = await getMenu();
    const result = readTable(menu.tables);
    renderHeader(menu, result);
    const pickId = renderPick(menu, result);
    renderMenu(menu, pickId);
    trackActiveSection();
  } catch (error) {
    console.error(error);
    document.getElementById('menu').append(
      el('p', {
        class: 'notice',
        text: 'The menu could not load. Please check your connection and scan the code again, or ask our team.',
      }),
    );
  }
}

start();
