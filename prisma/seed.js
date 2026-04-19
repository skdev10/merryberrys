const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { STOCK_IMAGES: productImages, PLACEHOLDER_IMAGE } = require('../lib/productImages.cjs');

const prisma = new PrismaClient();

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

// Generate products for each category
function generateProducts(categorySlug, categoryName, imageKeys) {
  const products = [];
  const sizes = JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']);
  const colors = JSON.stringify(['Black', 'Navy', 'Grey', 'White', 'Olive']);
  
  for (let i = 1; i <= 10; i++) {
    const imageKey = imageKeys[(i - 1) % imageKeys.length];
    const pool = productImages[imageKey] || productImages.basicTshirt;
    const primary = pool[(i - 1) % pool.length] || PLACEHOLDER_IMAGE;
    const secondary = pool[i % pool.length] || primary;
    const images = JSON.stringify([primary, secondary]);
    
    products.push({
      name: `${categoryName} ${String.fromCharCode(65 + i - 1)}`,
      slug: `${categorySlug}-${i}`,
      description: `Premium quality ${categoryName.toLowerCase()} crafted with attention to detail. Features comfortable fit and durable construction.`,
      price: Math.floor(Math.random() * 150) + 50,
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
    'pants': ['pants'],
    'straight-fit': ['straightFit'],
    'baggy-jeans': ['baggyJeans'],
    'cargo-jeans': ['cargoJeans'],
    'eight-pocket-jeans': ['eightPocket'],
    'tracksuit': ['tracksuit'],
    'trouser': ['trouser'],
    'shorts': ['shorts'],
    'under-wears': ['underwears'],
    'three-quater-shorts': ['threeQuarter'],
    'full-sleevee-tshirt': ['fullSleeveTshirt'],
    'half-sleeve-tshirt': ['halfSleeveTshirt'],
    'basic-t-shirt': ['basicTshirt'],
    'dry-fit-tshirt': ['dryFit'],
    'grapic-tee': ['graphicTee'],
    'over-sized': ['oversized'],
    'droup-shoulder': ['dropShoulder'],
    'polo': ['polo'],
    'zipper-polo': ['zipperPolo'],
    'knit-fibric': ['knitFabric'],
    'v-neck-tee': ['vNeck'],
    'formal-shirt': ['formalShirt'],
    'caps': ['caps'],
    'gym-tank-top': ['gymTank'],
    'long-shirt': ['longShirt'],
    'night-suit': ['nightSuit'],
    'kids-jeans': ['kidsJeans'],
    'kids-t-shirts': ['kidsTshirts'],
    'hi-neck': ['hiNeck'],
    'denim-jacket': ['denimJacket'],
    'base-ball': ['baseball'],
    'hoddie': ['hoodie'],
    'zipper': ['zipper'],
    'parachute-jacket': ['parachute'],
    'two-in-one-jacket': ['twoInOne'],
    'puffer-jacket': ['puffer'],
    'half-seelve-sweater': ['halfSleeveSweater'],
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

  await prisma.heroSlide.createMany({
    data: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&q=85&auto=format&fit=crop',
        videoUrl: null,
        title: 'Wide silhouettes',
        subtitle: 'New season',
        ctaLabel: 'Shop streetwear',
        ctaHref: '/shop',
        sortOrder: 0,
        active: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1920&q=85&auto=format&fit=crop',
        videoUrl: null,
        title: 'Denim & layers',
        subtitle: 'Everyday uniform',
        ctaLabel: 'View jeans',
        ctaHref: '/shop',
        sortOrder: 1,
        active: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=1920&q=85&auto=format&fit=crop',
        videoUrl: null,
        title: 'Build the fit',
        subtitle: 'Capsule staples',
        ctaLabel: 'Collections',
        ctaHref: '/collections',
        sortOrder: 2,
        active: true,
      },
    ],
  });
  console.log('Created hero slides');

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
    console.log(`Updated admin password: ${adminEmail} / ${adminPassword}`);
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
