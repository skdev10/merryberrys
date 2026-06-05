const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { STOCK_IMAGES: productImages, PLACEHOLDER_IMAGE } = require('../lib/productImages.cjs');
const { HERO_SLIDES, PRODUCT_NAMES } = require('../lib/catalogData.cjs');

const prisma = new PrismaClient();

// Categories structure
const categories = [
  // Men's Lower
  { name: 'Baggy Jeans', slug: 'baggy-jeans', parent: 'Men - Lower' },
  { name: 'Cargo Jeans', slug: 'cargo-jeans', parent: 'Men - Lower' },
  { name: 'Straight Fit', slug: 'straight-fit', parent: 'Men - Lower' },
  { name: 'Tracksuit', slug: 'tracksuit', parent: 'Men - Lower' },
  { name: 'Trouser', slug: 'trouser', parent: 'Men - Lower' },
  
  // Men's Upper
  { name: 'Basic T Shirt', slug: 'basic-t-shirt', parent: 'Men - Upper' },
  { name: 'Polo', slug: 'polo', parent: 'Men - Upper' },
  { name: 'Over Sized', slug: 'over-sized', parent: 'Men - Upper' },
  { name: 'Graphic Tee', slug: 'graphic-tee', parent: 'Men - Upper' },
  { name: 'Formal Shirt', slug: 'formal-shirt', parent: 'Men - Upper' },
  
  // Women & Kids
  { name: 'Long Shirt', slug: 'long-shirt', parent: 'Women & Kids' },
  { name: 'Night Suit', slug: 'night-suit', parent: 'Women & Kids' },
  { name: 'Kids Jeans', slug: 'kids-jeans', parent: 'Women & Kids' },
  { name: 'Kids T Shirts', slug: 'kids-t-shirts', parent: 'Women & Kids' },
  
  // Winter Collection
  { name: 'Denim Jacket', slug: 'denim-jacket', parent: 'Winter Collection' },
  { name: 'Hoodie', slug: 'hoodie', parent: 'Winter Collection' },
  { name: 'Puffer Jacket', slug: 'puffer-jacket', parent: 'Winter Collection' },
  { name: 'Zipper', slug: 'zipper', parent: 'Winter Collection' },
];

// Generate products for each category
function generateProducts(categorySlug, categoryName, imageKeys) {
  const products = [];
  const sizes = JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']);
  const colors = JSON.stringify(['Black', 'Navy', 'Grey', 'White', 'Olive']);
  const names = PRODUCT_NAMES[categorySlug] || [];
  
  for (let i = 1; i <= 10; i++) {
    const imageKey = imageKeys[(i - 1) % imageKeys.length];
    const pool = productImages[imageKey] || productImages.basicTshirt;
    const primary = pool[(i - 1) % pool.length] || PLACEHOLDER_IMAGE;
    const secondary = pool[i % pool.length] || primary;
    const images = JSON.stringify([primary, secondary]);
    const realName = names[i - 1] || `${categoryName} ${String.fromCharCode(65 + i - 1)}`;
    
    products.push({
      name: realName,
      slug: `${categorySlug}-${i}`,
      description: `Premium quality ${categoryName.toLowerCase()} crafted with attention to detail. Features comfortable fit and durable construction.`,
      price: Math.floor(Math.random() * (8000 - 1500) + 1500),
      images,
      sizes,
      colors,
      inStock: true,
      stockQuantity: Math.floor(Math.random() * (80 - 15) + 15),
    });
  }
  
  return products;
}

async function syncHeroSlides() {
  await prisma.heroSlide.deleteMany();
  await prisma.heroSlide.createMany({ data: HERO_SLIDES });
  console.log(`Synced ${HERO_SLIDES.length} hero slides`);
}

async function syncProductNames() {
  let updated = 0;
  for (const [slug, names] of Object.entries(PRODUCT_NAMES)) {
    const products = await prisma.product.findMany({
      where: { slug: { startsWith: `${slug}-` } },
      orderBy: { slug: 'asc' },
    });
    for (let i = 0; i < products.length && i < names.length; i++) {
      if (products[i].name !== names[i]) {
        await prisma.product.update({
          where: { id: products[i].id },
          data: { name: names[i] },
        });
        updated += 1;
      }
    }
  }
  console.log(`Synced product names (${updated} updated)`);
}

async function ensureAdminUser() {
  const adminEmail = 'admin@merryberry.com';
  const adminPassword = 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminExists = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: passwordHash,
        role: 'admin',
      },
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword}`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: passwordHash, role: 'admin' },
    });
    console.log(`Admin ready: ${adminEmail} / ${adminPassword}`);
  }
}

async function main() {
  console.log('Start seeding...');

  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log(`Database already has ${existingProducts} products — syncing catalog.`);
    await syncHeroSlides();
    await syncProductNames();
    await ensureAdminUser();
    return;
  }

  // Clear existing data (fresh seed only)
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.heroSlide.deleteMany();
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
  const categoryProducts = {
    'baggy-jeans': ['baggyJeans'],
    'cargo-jeans': ['cargoJeans'],
    'straight-fit': ['straightFit'],
    'tracksuit': ['tracksuit'],
    'trouser': ['trouser'],
    'basic-t-shirt': ['basicTshirt'],
    'polo': ['polo'],
    'over-sized': ['oversized'],
    'graphic-tee': ['graphicTee'],
    'formal-shirt': ['formalShirt'],
    'long-shirt': ['longShirt'],
    'night-suit': ['nightSuit'],
    'kids-jeans': ['kidsJeans'],
    'kids-t-shirts': ['kidsTshirts'],
    'denim-jacket': ['denimJacket'],
    'hoodie': ['hoodie'],
    'puffer-jacket': ['puffer'],
    'zipper': ['zipper'],
  };

  for (const [slug, imageKeys] of Object.entries(categoryProducts)) {
    const category = createdCategories[slug];
    if (!category) continue;
    
    const products = generateProducts(slug, category.name, imageKeys);
    
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

  await prisma.heroSlide.createMany({ data: HERO_SLIDES });
  console.log('Created hero slides');

  await ensureAdminUser();

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
