export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatAdminProduct(product) {
  if (!product) return null;
  return {
    ...product,
    images: JSON.parse(product.images || '[]'),
    sizes: JSON.parse(product.sizes || '[]'),
    colors: JSON.parse(product.colors || '[]'),
  };
}

export function buildProductUpdateData(body, existing = null) {
  const data = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) throw new Error('Product name is required');
    data.name = name;
    if (body.slug !== undefined) {
      data.slug = slugify(body.slug) || slugify(name);
    } else if (body.autoSlug) {
      data.slug = slugify(name);
    }
  } else if (body.slug !== undefined) {
    data.slug = slugify(body.slug);
  }

  if (body.description !== undefined) {
    const description = String(body.description).trim();
    if (!description) throw new Error('Description is required');
    data.description = description;
  }

  if (body.price !== undefined) {
    const price = parseFloat(body.price);
    if (Number.isNaN(price) || price < 0) throw new Error('Valid price is required');
    data.price = price;
  }

  if (body.categoryId !== undefined) {
    if (!body.categoryId) throw new Error('Category is required');
    data.categoryId = body.categoryId;
  }

  if (body.stockQuantity !== undefined) {
    data.stockQuantity = Math.max(0, parseInt(body.stockQuantity, 10) || 0);
  }

  if (body.inStock !== undefined) {
    data.inStock = !!body.inStock;
  }

  if (body.images !== undefined) {
    if (!Array.isArray(body.images)) throw new Error('images must be an array');
    data.images = JSON.stringify(body.images.map((s) => String(s).trim()).filter(Boolean));
  }

  if (body.sizes !== undefined) {
    const sizes = Array.isArray(body.sizes)
      ? body.sizes
      : String(body.sizes).split(',').map((s) => s.trim()).filter(Boolean);
    data.sizes = JSON.stringify(sizes);
  }

  if (body.colors !== undefined) {
    const colors = Array.isArray(body.colors)
      ? body.colors
      : String(body.colors).split(',').map((s) => s.trim()).filter(Boolean);
    data.colors = JSON.stringify(colors);
  }

  return data;
}
