// The only file you edit to change what the menu shows.
//
// To use real data later, keep the same shape and replace the body of
// getMenu() with a network call, for example:
//
//   export async function getMenu() {
//     const res = await fetch('https://your-api.example.com/menu');
//     return res.json();
//   }
//
// Nothing else in the project needs to change.

const menu = {
  restaurant: {
    name: 'Ember House',
    tagline: 'Wood fire kitchen',
    currency: 'RM',
  },

  // One entry per physical table. The key is the number in the QR link (?table=3).
  // "pick" is the id of the dish highlighted for that table.
  tables: {
    1: { area: 'Window side', seats: 2, pick: 'prawn-stir-fry' },
    2: { area: 'Main hall', seats: 4, pick: 'sticky-chicken' },
    3: { area: 'Terrace', seats: 6, pick: 'paella' },
  },

  categories: [
    {
      id: 'grill',
      name: 'From the grill',
      items: [
        {
          id: 'sticky-chicken',
          name: 'Sticky Chicken',
          description: 'Char grilled thighs glazed with honey, soy and toasted sesame.',
          price: 28,
          image: 'img/sticky-chicken.jpg',
        },
        {
          id: 'general-tso-chicken',
          name: "General Tso's Chicken",
          description: 'Crisp chicken tossed in a sweet chilli and ginger sauce.',
          price: 26,
          image: 'img/general-tso-chicken.jpg',
        },
        {
          id: 'chicken-fried-rice',
          name: 'Chicken Fried Rice',
          description: 'Wok fried jasmine rice with egg, spring onion and chicken.',
          price: 19,
          image: 'img/chicken-fried-rice.jpg',
        },
      ],
    },
    {
      id: 'sea',
      name: 'From the sea',
      items: [
        {
          id: 'prawn-stir-fry',
          name: 'Prawn Stir Fry',
          description: 'Tiger prawns with garlic, chilli and crunchy greens.',
          price: 34,
          image: 'img/prawn-stir-fry.jpg',
        },
        {
          id: 'paella',
          name: 'Seafood Paella',
          description: 'Saffron rice with prawns, mussels and squid. Serves two.',
          price: 58,
          image: 'img/paella.jpg',
        },
        {
          id: 'salt-pepper-squid',
          name: 'Salt and Pepper Squid',
          description: 'Lightly fried squid with sea salt, pepper and lime.',
          price: 24,
          image: 'img/salt-pepper-squid.jpg',
        },
      ],
    },
    {
      id: 'pasta',
      name: 'Pasta',
      items: [
        {
          id: 'fettuccine-alfredo',
          name: 'Fettuccine Alfredo',
          description: 'Fresh ribbons in a butter and parmesan cream.',
          price: 27,
          image: 'img/fettuccine-alfredo.jpg',
        },
        {
          id: 'duck-ragu',
          name: 'Venetian Duck Ragu',
          description: 'Slow cooked duck with tomato and red wine over pappardelle.',
          price: 36,
          image: 'img/duck-ragu.jpg',
        },
        {
          id: 'puttanesca',
          name: 'Spaghetti Puttanesca',
          description: 'Tomato, olives, capers and a little chilli heat.',
          price: 23,
          image: 'img/puttanesca.jpg',
        },
      ],
    },
    {
      id: 'sweet',
      name: 'Something sweet',
      items: [
        {
          id: 'apple-tart',
          name: 'Apple Frangipane Tart',
          description: 'Warm almond tart with caramelised apple.',
          price: 16,
          image: 'img/apple-tart.jpg',
        },
        {
          id: 'raspberry-brownies',
          name: 'Chocolate Raspberry Brownie',
          description: 'Dark chocolate brownie baked with fresh raspberries.',
          price: 14,
          image: 'img/raspberry-brownies.jpg',
        },
        {
          id: 'cinnamon-cookies',
          name: 'Cinnamon Roll Cookies',
          description: 'Soft swirled cookies with a vanilla glaze. Three pieces.',
          price: 12,
          image: 'img/cinnamon-cookies.jpg',
        },
      ],
    },
  ],
};

export async function getMenu() {
  return menu;
}
