/* =====================================================================
   FIA — PRODUCT CATALOGUE
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to change the shop.
   Save the file, then redeploy the site (see README.md).

   A few simple rules:
   • Text goes inside "double quotes".
   • Every item in a list ends with a comma  ,
   • Numbers (prices) have NO quotes and NO commas: 2450, not "2,450".
   • Lines starting with // are notes for you. The website ignores them.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. SETTINGS — general shop information
   --------------------------------------------------------------------- */
const SETTINGS = {
  // Your shop name. Shown in the logo, the hero and the order message.
  shopName: "Fia",

  // A short line under the shop name on the home page.
  tagline: "Soft, feminine fashion & accessories — made to be loved every day.",

  // Your Facebook Page username, the part after facebook.com/
  // Example: if your page is facebook.com/fia.fashion, write "fia.fashion".
  // The order buttons open https://m.me/<this username>
  messengerPage: "fiawomensfashion",

  // Colour theme for the whole site. Choose one: "rose", "peach" or "mauve".
  theme: "rose",

  // Currency symbol shown before every price.
  currency: "৳",

  // A short note shown at the bottom of every page.
  footerNote: "Order through Facebook Messenger. Cash on delivery available all over Bangladesh."
};


/* ---------------------------------------------------------------------
   2. OFFERS — shown on the home page above the products
   ---------------------------------------------------------------------
   Each offer has:
     title : the headline of the offer
     text  : one or two short sentences explaining it
     badge : a small label in the corner, e.g. "10% OFF" or "NEW"
     ends  : (optional) last day of the offer as "YYYY-MM-DD".
             The offer hides automatically after that day.
             Write ends: "" (or leave it out) for an offer with no end date.
   To remove an offer, delete its whole { ... }, block.
   --------------------------------------------------------------------- */
const OFFERS = [
  {
    title: "Winter Festive Edit",
    text: "Up to 20% off selected kurtis and bags. Prices already reduced — just order on Messenger.",
    badge: "Up to 20% OFF",
    ends: "2027-01-15"
  },
  {
    title: "Free delivery in Dhaka",
    text: "Free home delivery inside Dhaka on any order of ৳3,000 or more.",
    badge: "FREE DELIVERY",
    ends: ""
  }
];


/* ---------------------------------------------------------------------
   3. PRODUCTS — every item in the catalogue
   ---------------------------------------------------------------------
   TO ADD A PRODUCT: copy one whole block from { to }, (including the
   comma), paste it below the last product, and change the values.

   Each product has:
     id          : a unique product code, e.g. "FIA-105". Never reuse a code.
                   Customers send this code in their order message.
     name        : the product name.
     category    : the category name, e.g. "Clothing" or "Accessories".
                   Categories (and their tabs) are created automatically.
                   Spell it exactly the same way for every product in it.
     price       : the current price as a plain number, e.g. 2450
     oldPrice    : (optional) the original price before a discount.
                   When set, the old price is crossed out and a "% off"
                   badge appears. Use null (or delete the line) if no discount.
     images      : a list of photo file names from the /images folder.
                   The first photo is the main one. Example:
                   ["kurti-1.jpg", "kurti-2.jpg"]
                   If a photo is missing, a soft pink placeholder is shown.
     description : a few sentences about the product.
     details     : a list of "Label": "Value" pairs shown on the product page,
                   e.g. "Size": "M, L, XL". Add or remove lines freely.
     inStock     : true if available, false to show "Sold out"
                   (the order button is then disabled).
     featured    : true to show this product first in the catalogue.
   --------------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "FIA-101",
    name: "Rose Blush Embroidered Kurti",
    category: "Clothing",
    price: 2450,
    oldPrice: 2950,
    images: ["kurti-rose-1.jpg", "kurti-rose-2.jpg"],
    description: "A soft dusty-rose cotton kurti with delicate white thread embroidery on the neckline and sleeves. Light, breathable and pretty enough for family gatherings.",
    details: {
      "Size": "S, M, L, XL",
      "Colours": "Dusty rose",
      "Fabric": "100% cotton",
      "Length": "42 inches",
      "Care": "Gentle hand wash in cold water, dry in shade"
    },
    inStock: true,
    featured: true
  },
  {
    id: "FIA-102",
    name: "Ivory Flutter Maxi Dress",
    category: "Clothing",
    price: 3200,
    oldPrice: null,
    images: ["maxi-ivory-1.jpg"],
    description: "A flowing ivory maxi dress with flutter sleeves and a tie waist that you can adjust for the perfect fit. Easy, elegant and cool on warm days.",
    details: {
      "Size": "M, L",
      "Colours": "Ivory",
      "Fabric": "Cotton voile with lining",
      "Care": "Machine wash cold, gentle cycle"
    },
    inStock: false,
    featured: false
  },
  {
    id: "FIA-201",
    name: "Pearl Drop Earrings",
    category: "Accessories",
    price: 850,
    images: ["earrings-pearl-1.jpg"],
    description: "Dainty gold-tone drop earrings finished with freshwater pearls. A gentle sparkle for every day, and a lovely gift.",
    details: {
      "Material": "Gold-plated brass, freshwater pearl",
      "Length": "3 cm",
      "Closure": "Hook",
      "Care": "Keep dry and store in the pouch provided"
    },
    inStock: true,
    featured: true
  },
  {
    id: "FIA-202",
    name: "Woven Straw Tote Bag",
    category: "Accessories",
    price: 1650,
    oldPrice: 1950,
    images: ["tote-straw-1.jpg"],
    description: "A roomy hand-woven straw tote with soft tan handles. Fits your phone, wallet, scarf and more — perfect for shopping days and outings.",
    details: {
      "Size": "38 × 30 × 12 cm",
      "Colours": "Natural straw with tan handles",
      "Material": "Woven straw, faux leather handles",
      "Care": "Wipe with a dry cloth"
    },
    inStock: true,
    featured: false
  }
];
