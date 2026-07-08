import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';
import { buildProductUpdateData, formatAdminProduct } from '@/lib/adminProduct';

// GET single product
export async function GET(request, context) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const { id } = await context.params;
        
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!product) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product: formatAdminProduct(product) });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { message: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT update product (full)
export async function PUT(request, context) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const { id } = await context.params;
        const data = await request.json();

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const updateData = buildProductUpdateData(
            {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                stockQuantity: data.stockQuantity,
                inStock: data.inStock,
                images: data.images,
                sizes: data.sizes,
                colors: data.colors,
            },
            existing
        );

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { category: true },
        });

        return NextResponse.json({ product: formatAdminProduct(product) });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update product' },
            { status: error.message?.includes('required') ? 400 : 500 }
        );
    }
}

// PATCH — partial update (name, price, stock, images, etc.)
export async function PATCH(request, context) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const { id } = await context.params;
        const data = await request.json();

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const updateData = buildProductUpdateData(data, existing);
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { category: true },
        });

        return NextResponse.json({ product: formatAdminProduct(product) });
    } catch (error) {
        console.error('Error patching product:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to update product' },
            { status: error.message?.includes('required') ? 400 : 500 }
        );
    }
}

// DELETE product
export async function DELETE(request, context) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const { id } = await context.params;
        
        await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { message: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
