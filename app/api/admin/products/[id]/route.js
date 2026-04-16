import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET single product
export async function GET(request, { params }) {
    try {
        const { id } = params;
        
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

        // Parse JSON fields
        const formattedProduct = {
            ...product,
            images: JSON.parse(product.images || '[]'),
            sizes: JSON.parse(product.sizes || '[]'),
            colors: JSON.parse(product.colors || '[]')
        };

        return NextResponse.json({ product: formattedProduct });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { message: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT update product
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const data = await request.json();
        
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: parseFloat(data.price),
                images: JSON.stringify(data.images || []),
                sizes: JSON.stringify(data.sizes || ['S', 'M', 'L', 'XL']),
                colors: JSON.stringify(data.colors || ['Black', 'White']),
                categoryId: data.categoryId,
                inStock: data.inStock
            }
        });

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { message: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE product
export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        
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
