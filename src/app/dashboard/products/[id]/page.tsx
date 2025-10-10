import React from 'react'
import { getSingleProducts } from '@/apiCalls/productsApiCall';
import UpdateProductionPage from './UpdateProductionPage';

interface PageProps {
    params: Promise<{ id: string }>;
}
const ProductionByIdPage = async ({ params }: PageProps) => {
    const products = await getSingleProducts((await params).id);
    console.log(products)

    return (
        <UpdateProductionPage product={products} />
    )
}

export default ProductionByIdPage
