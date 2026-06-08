/** CommonJS export for prisma/seed.js */
const pools = require('./productImagePools.json');

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80';

const STOCK_IMAGES = pools;

function buildImagePool(imageKeys) {
  const pool = [];
  for (const key of imageKeys) {
    const arr = STOCK_IMAGES[key];
    if (Array.isArray(arr)) pool.push(...arr);
  }
  return pool.length ? pool : STOCK_IMAGES.basicTshirt || [PLACEHOLDER_IMAGE];
}

function pickProductImages(imageKeys, productIndex) {
  const pool = buildImagePool(imageKeys);
  const primary = pool[productIndex % pool.length];
  const secondaryIdx = (productIndex + Math.floor(pool.length / 2)) % pool.length;
  const secondary = pool[secondaryIdx] === primary ? pool[(productIndex + 1) % pool.length] : pool[secondaryIdx];
  return JSON.stringify([primary, secondary]);
}

module.exports = { STOCK_IMAGES, PLACEHOLDER_IMAGE, buildImagePool, pickProductImages };
