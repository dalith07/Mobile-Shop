/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DOMAIN } from '@/lib/constants'
import axios from 'axios'
import { Heart, MoveRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ProductsWithAll } from '@/lib/utils'


const SectionApplePage = () => {
    const [products, setProducts] = useState<ProductsWithAll[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [fade, setFade] = useState(false)


    useEffect(() => {
        async function fetchProduction() {
            try {
                const res = await axios.get(`${DOMAIN}/api/dashboard/production`)
                setProducts(res.data)
                console.log("Fetched products:", res.data)
            } catch (error: any) {
                // toast.error(error?.response?.data?.message)
            }
        }
        fetchProduction()
    }, [])

    useEffect(() => {
        if (products.length > 4) {
            const interval = setInterval(() => {
                setFade(true) // start fade out
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 4) % products.length)
                    setFade(false) // fade in
                }, 500) // half second fade
            }, 4000)

            return () => clearInterval(interval)
        }
    }, [products])

    const visibleProducts = products.slice(currentIndex, currentIndex + 4)
    const displayedProducts =
        visibleProducts.length < 4
            ? [...visibleProducts, ...products.slice(0, 4 - visibleProducts.length)]
            : visibleProducts

    return (
        <section className="bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8">
            <div className="w-[95%] mx-auto">
                <div className="py-4">
                    <div className="md:flex md:items-center md:justify-between mb-4">
                        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
                            <h1 className="text-2xl font-bold sm:text-2xl">
                                Apple Phone
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Check out the latest apple phone
                            </p>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/MarketPlace"
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 animate-pulse"
                            >
                                Store The collection
                                <span aria-hidden="true">
                                    <MoveRight className="ml-1 w-5 h-5 font-medium inline-flex" />
                                </span>
                            </Link>
                        </div>
                    </div>

                    <div
                        className={`w-full grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-2 sm:gap-x-8 md:gap-y-10 lg:gap-x-4 transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"
                            }`}
                    >
                        {displayedProducts.map((product, index) => (
                            <div
                                key={`${product.id}-${index}`}   // ✅ always unique
                                className="rounded-xl border text-card-foreground shadow bg-muted/100"
                            >
                                <div className="border-2 overflow-hidden rounded-2xl w-full h-full">
                                    <h2 className="m-2 text-sm text-gray-300">
                                        {product.category.name}
                                    </h2>

                                    <Link href={""} className='cursor-pointer group/main visible animate-in fade-in-5'>
                                        <div className='border-2 overflow-hidden rounded-2xl bg-slate-50'>
                                            <div className='relative w-full h-full'>
                                                <Image
                                                    src={product.images[0].imageUrl}
                                                    alt={`Product image`}
                                                    width={256}
                                                    height={256}
                                                    className="transition-all duration-1000 ease-in-out md:hover:scale-150 opacity-100"
                                                />
                                            </div>
                                        </div>
                                    </Link>

                                    <div className='flex mt-2 m-2 items-center justify-between'>
                                        <h1 className='font-bold mb-2'>{product.title}</h1>
                                        <Heart className='w-7 h-7 hover:cursor-pointer' />
                                    </div>

                                    <div className='mt-1 m-2 flex items-center justify-between'>
                                        <div className='ml-2'>
                                            <div className='flex items-center gap-4'>
                                                <h2 className='font-extrabold'>{product.price}DT</h2>
                                            </div>
                                        </div>

                                        <div className='relative group rounded-full p-1  text-gray-600 cursor-pointer '>
                                            <Button className='text-white'>
                                                <ShoppingCart className='animate-pulse' />
                                                Add To Cart
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section >
    )
}

export default SectionApplePage

// "use client";

// import { ProductnWithImages } from "@/lib/utils";
// import { MoveRight } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface SectionApplePageProps {
//     products: ProductnWithImages[];
// }

// const SectionApplePage = ({ products }: SectionApplePageProps) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [fade, setFade] = useState(false);

//     useEffect(() => {
//         if (products.length > 4) {
//             const interval = setInterval(() => {
//                 setFade(true); // Start fade out
//                 setTimeout(() => {
//                     setCurrentIndex((prevIndex) => (prevIndex + 4) % products.length);
//                     setFade(false); // Fade in
//                 }, 500); // Half-second fade
//             }, 4000); // Change every 4 seconds

//             return () => clearInterval(interval); // Cleanup
//         }
//     }, [products]);

//     const visibleProducts = products.slice(currentIndex, currentIndex + 4);
//     const displayedProducts =
//         visibleProducts.length < 4
//             ? [...visibleProducts, ...products.slice(0, 4 - visibleProducts.length)]
//             : visibleProducts;

//     return (
//         <section className="bg-muted/50 border-2 rounded-2xl border-slate-500 w-[97%] mx-auto my-8">
//             <div className="w-[95%] mx-auto">
//                 <div className="py-4">
//                     <div className="md:flex md:items-center md:justify-between mb-4">
//                         <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
//                             <h1 className="text-2xl font-bold sm:text-2xl">Apple Phone</h1>
//                             <p className="mt-2 text-sm text-muted-foreground">
//                                 Check out the latest apple phone
//                             </p>
//                         </div>
//                         <div className="text-center">
//                             <Link
//                                 href="/MarketPlace"
//                                 className="text-sm font-medium text-blue-600 hover:text-blue-500 animate-pulse"
//                             >
//                                 Store The collection
//                                 <span aria-hidden="true">
//                                     <MoveRight className="ml-1 w-5 h-5 font-medium inline-flex" />
//                                 </span>
//                             </Link>
//                         </div>
//                     </div>

//                     <div
//                         className={`w-full grid p-2 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-y-4 gap-2 sm:gap-x-8 md:gap-y-10 lg:gap-x-4 transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"
//                             }`}
//                     >
//                         {displayedProducts.map((product) => (
//                             <div
//                                 key={product.id}
//                                 className="rounded-xl border text-card-foreground shadow bg-muted/100"
//                             >
//                                 <div className="relative w-full h-[300px]">
//                                     {product.images && product.images.length > 0 ? (
//                                         <Image
//                                             src={product.images[0].imageUrl}
//                                             alt="Product image"
//                                             fill
//                                             sizes="(max-width: 768px) 100vw, 33vw"
//                                             className="rounded-t-xl object-cover"
//                                             unoptimized
//                                         />
//                                     ) : (
//                                         <div className="flex items-center justify-center h-full bg-gray-200">
//                                             No image available
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default SectionApplePage;