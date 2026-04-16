const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

/** Pexels photo IDs — fashion / apparel (pexels.com license) */
const PEXELS_IDS = [
  '1040945', '1926764', '1346187', '1536619', '5701645', '1484822', '1462637', '1188750', '1927256',
];

function pexelsImg(id, w = 1200) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

function productImagePair(seed) {
  const a = PEXELS_IDS[seed % PEXELS_IDS.length];
  const b = PEXELS_IDS[(seed + 3) % PEXELS_IDS.length];
  return JSON.stringify([pexelsImg(a), pexelsImg(b)]);
}

// Categories structure
const categories = [
  // Men's Lower
  { name: 'Pants', slug: 'pants', parent: 'Men - Lower' },
  { name: 'Straight Fit', slug: 'straight-fit', parent: 'Men - Lower' },
  { name: 'Baggy Jeans', slug: 'baggy-jeans', parent: 'Men - Lower' },
  { name: 'Cargo Jeans', slug: 'cargo-jeans', parent: 'Men - Lower' },
  { name: 'Eight Pocket Jeans', slug: 'eight-pocket-jeans', parent: 'Men - Lower' },
  { name: 'Tracksuit', slug: 'tracksuit', parent: 'Men - Lower' },
  { name: 'Trouser', slug: 'trouser', parent: 'Men - Lower' },
  { name: 'Shorts', slug: 'shorts', parent: 'Men - Lower' },
  { name: 'Under Wears', slug: 'under-wears', parent: 'Men - Lower' },
  { name: 'Three Quater Shorts', slug: 'three-quater-shorts', parent: 'Men - Lower' },
  
  // Men's Upper
  { name: 'Full Sleevee T-Shirt', slug: 'full-sleevee-tshirt', parent: 'Men - Upper' },
  { name: 'Half Sleeve T-Shirt', slug: 'half-sleeve-tshirt', parent: 'Men - Upper' },
  { name: 'Basic T Shirt', slug: 'basic-t-shirt', parent: 'Men - Upper' },
  { name: 'Dry Fit T-Shirt', slug: 'dry-fit-tshirt', parent: 'Men - Upper' },
  { name: 'Grapic Tee', slug: 'grapic-tee', parent: 'Men - Upper' },
  { name: 'Over Sized', slug: 'over-sized', parent: 'Men - Upper' },
  { name: 'Droup Shoulder', slug: 'droup-shoulder', parent: 'Men - Upper' },
  { name: 'Polo', slug: 'polo', parent: 'Men - Upper' },
  { name: 'Zipper Polo', slug: 'zipper-polo', parent: 'Men - Upper' },
  { name: 'Knit Fibric', slug: 'knit-fibric', parent: 'Men - Upper' },
  { name: 'V Neck Tee', slug: 'v-neck-tee', parent: 'Men - Upper' },
  { name: 'Formal Shirt', slug: 'formal-shirt', parent: 'Men - Upper' },
  { name: 'Caps', slug: 'caps', parent: 'Men - Upper' },
  { name: 'Gym Tank Top', slug: 'gym-tank-top', parent: 'Men - Upper' },
  
  // Women
  { name: 'Long Shirt', slug: 'long-shirt', parent: 'Women' },
  { name: 'Night Suit', slug: 'night-suit', parent: 'Women' },
  
  // Kids
  { name: 'Kids Jeans', slug: 'kids-jeans', parent: 'Kids' },
  { name: 'Kids T Shirts', slug: 'kids-t-shirts', parent: 'Kids' },
  
  // Winter Collection
  { name: 'Hi Neck', slug: 'hi-neck', parent: 'Winter Collection' },
  { name: 'Denim Jacket', slug: 'denim-jacket', parent: 'Winter Collection' },
  { name: 'Base Ball', slug: 'base-ball', parent: 'Winter Collection' },
  { name: 'Hoddie', slug: 'hoddie', parent: 'Winter Collection' },
  { name: 'Zipper', slug: 'zipper', parent: 'Winter Collection' },
  { name: 'Parachute Jacket', slug: 'parachute-jacket', parent: 'Winter Collection' },
  { name: 'Two In One Jacket', slug: 'two-in-one-jacket', parent: 'Winter Collection' },
  { name: 'Puffer Jacket', slug: 'puffer-jacket', parent: 'Winter Collection' },
  { name: 'Half Seelve Sweater', slug: 'half-seelve-sweater', parent: 'Winter Collection' },
];

// Generate products for each category (prices in PKR)
function generateProducts(categorySlug, categoryName) {
  const products = [];
  const sizes = JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']);
  const colors = JSON.stringify(['Black', 'Navy', 'Grey', 'White', 'Olive']);

  for (let i = 1; i <= 10; i++) {
    const seed =
      categorySlug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17 + i * 31;
    const images = productImagePair(seed);
    const pricePkr = Math.floor(Math.random() * 12000) + 3999;

    products.push({
      name: `${categoryName} ${String.fromCharCode(65 + i - 1)}`,
      slug: `${categorySlug}-${i}`,
      description: `Premium quality ${categoryName.toLowerCase()} crafted with attention to detail. Comfortable fit and durable construction.`,
      price: pricePkr,
      images,
      sizes,
      colors,
      inStock: true,
    });
  }

  return products;
}

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const createdCategories = {};
  
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: cat,
    });
    createdCategories[cat.slug] = category;
    console.log(`Created category: ${cat.name}`);
  }

  // Create products for each category
  for (const cat of categories) {
    const category = createdCategories[cat.slug];
    if (!category) continue;

    const products = generateProducts(cat.slug, cat.name);
    
    for (const product of products) {
      await prisma.product.create({
        data: {
          ...product,
          categoryId: category.id,
        },
      });
    }
    
    console.log(`Created ${products.length} products for ${category.name}`);
  }

  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@merryberry.com' },
  });

  if (!adminExists) {
    const hashed = await bcrypt.hash('admin123', 12);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@merryberry.com',
        password: hashed,
        role: 'admin',
        preferences: '{}',
      },
    });
    console.log('Created admin user: admin@merryberry.com / admin123');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
