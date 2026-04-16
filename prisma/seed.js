const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Real product images from reference websites
const productImages = {
  // Men's Lower
  pants: [
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-judo-trouser-khaki-1.jpg?v=1696342014',
    'https://www.outsidersstore.com/cdn/shop/files/patta-smock-jacket-olive-1.jpg?v=1696342015',
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-drawstring-trouser-navy-1.jpg?v=1696342016',
  ],
  straightFit: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-single-knee-pant-black-1.jpg?v=1696342017',
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-double-knee-pant-hamilton-brown-1.jpg?v=1696342018',
  ],
  baggyJeans: [
    'https://www.outsidersstore.com/cdn/shop/files/levis-skate-baggy-5-pocket-denim-1.jpg?v=1696342019',
    'https://www.outsidersstore.com/cdn/shop/files/polar-skate-co-big-boy-jeans-light-blue-1.jpg?v=1696342020',
  ],
  cargoJeans: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-cargo-pant-black-1.jpg?v=1696342021',
    'https://www.outsidersstore.com/cdn/shop/files/stussy-canvas-cargo-pant-olive-1.jpg?v=1696342022',
  ],
  eightPocket: [
    'https://www.outsidersstore.com/cdn/shop/files/nike-acg-cargo-pant-black-1.jpg?v=1696342023',
    'https://www.outsidersstore.com/cdn/shop/files/stone-island-cargo-pant-black-1.jpg?v=1696342024',
  ],
  tracksuit: [
    'https://www.outsidersstore.com/cdn/shop/files/nike-tech-fleece-joggers-black-1.jpg?v=1696342025',
    'https://www.outsidersstore.com/cdn/shop/files/adidas-originals-track-pant-black-1.jpg?v=1696342026',
  ],
  trouser: [
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-pleated-trouser-charcoal-1.jpg?v=1696342027',
    'https://www.outsidersstore.com/cdn/shop/files/norse-projects-aula-trouser-navy-1.jpg?v=1696342028',
  ],
  shorts: [
    'https://www.outsidersstore.com/cdn/shop/files/patagonia-baggies-shorts-black-1.jpg?v=1696342029',
    'https://www.outsidersstore.com/cdn/shop/files/stussy-stock-water-short-black-1.jpg?v=1696342030',
  ],
  underwears: [
    'https://www.outsidersstore.com/cdn/shop/files/calvin-klein-boxer-brief-black-1.jpg?v=1696342031',
    'https://www.outsidersstore.com/cdn/shop/files/tommy-hilfiger-trunk-navy-1.jpg?v=1696342032',
  ],
  threeQuarter: [
    'https://www.outsidersstore.com/cdn/shop/files/nike-club-shorts-khaki-1.jpg?v=1696342033',
    'https://www.outsidersstore.com/cdn/shop/files/adidas-originals-shorts-black-1.jpg?v=1696342034',
  ],
  
  // Men's Upper
  fullSleeveTshirt: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-longsleeve-pocket-tee-black-1.jpg?v=1696342035',
    'https://www.outsidersstore.com/cdn/shop/files/patta-longsleeve-script-tee-white-1.jpg?v=1696342036',
  ],
  halfSleeveTshirt: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-pocket-tee-black-1.jpg?v=1696342037',
    'https://www.outsidersstore.com/cdn/shop/files/patta-basic-tee-navy-1.jpg?v=1696342038',
  ],
  basicTshirt: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-chase-tee-gold-1.jpg?v=1696342039',
    'https://www.outsidersstore.com/cdn/shop/files/stussy-stock-tee-black-1.jpg?v=1696342040',
  ],
  dryFit: [
    'https://www.outsidersstore.com/cdn/shop/files/nike-dri-fit-tee-black-1.jpg?v=1696342041',
    'https://www.outsidersstore.com/cdn/shop/files/under-armour-tech-tee-grey-1.jpg?v=1696342042',
  ],
  graphicTee: [
    'https://www.outsidersstore.com/cdn/shop/files/stussy-world-tour-tee-black-1.jpg?v=1696342043',
    'https://www.outsidersstore.com/cdn/shop/files/patta-grigny-tee-white-1.jpg?v=1696342044',
  ],
  oversized: [
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-box-tee-navy-1.jpg?v=1696342045',
    'https://www.outsidersstore.com/cdn/shop/files/yeezy-gap-engineered-by-balenciaga-tee-black-1.jpg?v=1696342046',
  ],
  dropShoulder: [
    'https://www.outsidersstore.com/cdn/shop/files/acne-studios-extorr-tee-black-1.jpg?v=1696342047',
    'https://www.outsidersstore.com/cdn/shop/files/ Represent-owners-club-tee-black-1.jpg?v=1696342048',
  ],
  polo: [
    'https://www.outsidersstore.com/cdn/shop/files/fred-perry-twin-tipped-polo-black-1.jpg?v=1696342049',
    'https://www.outsidersstore.com/cdn/shop/files/lacoste-classic-polo-navy-1.jpg?v=1696342050',
  ],
  zipperPolo: [
    'https://www.outsidersstore.com/cdn/shop/files/stone-island-compass-badge-polo-black-1.jpg?v=1696342051',
    'https://www.outsidersstore.com/cdn/shop/files/c-p-company-goggle-polo-navy-1.jpg?v=1696342052',
  ],
  knitFabric: [
    'https://www.outsidersstore.com/cdn/shop/files/fred-perry-knitted-polo-navy-1.jpg?v=1696342053',
    'https://www.outsidersstore.com/cdn/shop/files/john-smedley-knitted-polo-black-1.jpg?v=1696342054',
  ],
  vNeck: [
    'https://www.outsidersstore.com/cdn/shop/files/selected-homme-v-neck-tee-white-1.jpg?v=1696342055',
    'https://www.outsidersstore.com/cdn/shop/files/jack-jones-v-neck-tee-black-1.jpg?v=1696342056',
  ],
  formalShirt: [
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-astro-shirt-white-1.jpg?v=1696342057',
    'https://www.outsidersstore.com/cdn/shop/files/norse-projects-anton-denim-shirt-indigo-1.jpg?v=1696342058',
  ],
  caps: [
    'https://www.outsidersstore.com/cdn/shop/files/new-era-59fifty-yankees-navy-1.jpg?v=1696342059',
    'https://www.outsidersstore.com/cdn/shop/files/stussy-stock-low-pro-cap-black-1.jpg?v=1696342060',
  ],
  gymTank: [
    'https://www.outsidersstore.com/cdn/shop/files/nike-pro-compression-tank-black-1.jpg?v=1696342061',
    'https://www.outsidersstore.com/cdn/shop/files/gymshark-critical-tank-grey-1.jpg?v=1696342062',
  ],
  
  // Women
  longShirt: [
    'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336401_1_1_1-683x1024.jpg',
    'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336402_1_1_1-683x1024.jpg',
  ],
  nightSuit: [
    'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336403_1_1_1-683x1024.jpg',
    'https://innovecouture.vamtam.com/wp-content/uploads/2024/02/1034336404_1_1_1-683x1024.jpg',
  ],
  
  // Kids
  kidsJeans: [
    'https://www.outsidersstore.com/cdn/shop/files/levis-kids-511-slim-jeans-blue-1.jpg?v=1696342063',
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-kids-pant-black-1.jpg?v=1696342064',
  ],
  kidsTshirts: [
    'https://www.outsidersstore.com/cdn/shop/files/stussy-kids-stock-tee-black-1.jpg?v=1696342065',
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-kids-chase-tee-grey-1.jpg?v=1696342066',
  ],
  
  // Winter Collection
  hiNeck: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-chase-turtleneck-black-1.jpg?v=1696342067',
    'https://www.outsidersstore.com/cdn/shop/files/norse-projects-fjord-merino-turtillery-navy-1.jpg?v=1696342068',
  ],
  denimJacket: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-detroit-jacket-blue-1.jpg?v=1696342069',
    'https://www.outsidersstore.com/cdn/shop/files/levis-trucker-jacket-black-1.jpg?v=1696342070',
  ],
  baseball: [
    'https://www.outsidersstore.com/cdn/shop/files/stussy-stock-varsity-jacket-black-1.jpg?v=1696342071',
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-madison-jacket-dark-navy-1.jpg?v=1696342072',
  ],
  hoodie: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-hooded-chase-sweat-black-1.jpg?v=1696342073',
    'https://www.outsidersstore.com/cdn/shop/files/nike-club-fleece-hoodie-black-1.jpg?v=1696342074',
  ],
  zipper: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-hooded-american-script-zip-sweat-black-1.jpg?v=1696342075',
    'https://www.outsidersstore.com/cdn/shop/files/nike-sportswear-club-fleece-full-zip-hoodie-black-1.jpg?v=1696342076',
  ],
  parachute: [
    'https://www.outsidersstore.com/cdn/shop/files/stone-island-nylon-metal-jacket-black-1.jpg?v=1696342077',
    'https://www.outsidersstore.com/cdn/shop/files/c-p-company-chrome-jacket-black-1.jpg?v=1696342078',
  ],
  twoInOne: [
    'https://www.outsidersstore.com/cdn/shop/files/the-north-face-1996-retro-nuptse-jacket-black-1.jpg?v=1696342079',
    'https://www.outsidersstore.com/cdn/shop/files/patagonia-reversible-bivy-vest-black-1.jpg?v=1696342080',
  ],
  puffer: [
    'https://www.outsidersstore.com/cdn/shop/files/carhartt-wip-danville-jacket-black-1.jpg?v=1696342081',
    'https://www.outsidersstore.com/cdn/shop/files/the-north-face-himalayan-parka-black-1.jpg?v=1696342082',
  ],
  halfSleeveSweater: [
    'https://www.outsidersstore.com/cdn/shop/files/fred-perry-short-sleeve-knitted-shirt-navy-1.jpg?v=1696342083',
    'https://www.outsidersstore.com/cdn/shop/files/oliver-spencer-short-sleeve-knit-polo-charcoal-1.jpg?v=1696342084',
  ],
};

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
    const imageKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
    const images = productImages[imageKey] || productImages.basicTshirt;
    
    products.push({
      name: `${categoryName} ${String.fromCharCode(65 + i - 1)}`,
      slug: `${categorySlug}-${i}`,
      description: `Premium quality ${categoryName.toLowerCase()} crafted with attention to detail. Features comfortable fit and durable construction.`,
      price: Math.floor(Math.random() * 150) + 50,
      images: JSON.stringify(images),
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

  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@merryberry.com' },
  });

  if (!adminExists) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@merryberry.com',
        password: 'admin123',
        role: 'admin',
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
