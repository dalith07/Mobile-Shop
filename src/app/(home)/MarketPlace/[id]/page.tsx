import { prisma } from '@/lib/prisma';
import { ProductsWithAll } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';
import ProductDetailPage from './ProductDetailPage';

interface SingleProductPageProps {
    params: Promise<{ id: string }>;
}
const page = async ({ params }: SingleProductPageProps) => {

    const products = (await prisma.products.findUnique({
        where: { id: (await params).id },

        include: {
            category: true,
            model: true,
            images: true,
        },
    })) as ProductsWithAll;

    if (!products) {
        toast.error("Product Not Found")
        return notFound();
    }

    return (
        <>
            <ProductDetailPage product={products} />
        </>
    )
}

export default page
