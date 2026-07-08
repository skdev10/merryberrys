import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';
import { formatAdminProduct, slugify } from '@/lib/adminProduct';

// GET all products
export async function GET(request) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Parse JSON fields
        const formattedProducts = products.map((product) => formatAdminProduct(product));

        return NextResponse.json({ products: formattedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { message: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST new product
export async function POST(request) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const data = await request.json();

        const name = String(data.name || '').trim();
        const slug = slugify(data.slug || name);
        if (!name || !slug) {
            return NextResponse.json({ message: 'Product name is required' }, { status: 400 });
        }
        if (!data.categoryId) {
            return NextResponse.json({ message: 'Category is required' }, { status: 400 });
        }
        
        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description: String(data.description || '').trim(),
                price: parseFloat(data.price),
                images: JSON.stringify(data.images || []),
                sizes: JSON.stringify(data.sizes || ['S', 'M', 'L', 'XL']),
                colors: JSON.stringify(data.colors || ['Black', 'White']),
                categoryId: data.categoryId,
                inStock: data.inStock ?? true,
                stockQuantity: Math.max(0, parseInt(data.stockQuantity ?? 100, 10) || 0)
            },
            include: { category: true },
        });

        return NextResponse.json({ product: formatAdminProduct(product) }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { message: 'Failed to create product' },
            { status: 500 }
        );
    }
}
