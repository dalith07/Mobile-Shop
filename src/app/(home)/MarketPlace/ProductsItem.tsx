"use client"

import { ProductsWithAll } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProductItemsProps {
    products: ProductsWithAll[]
}

const ProductsItem = ({ products }: ProductItemsProps) => {

    return (
        <>
            {products.map((item) => {
                return (
                    <Card
                        key={item.id}
                        className="group hover:shadow-lg transition-all duration-200"
                    >
                        <CardHeader className="p-0">
                            <div className="relative overflow-hidden rounded-t-lg">
                                <Image
                                    src={item.images?.[0]?.imageUrl || "/Australia.jpeg"}
                                    alt={item.title}
                                    width={300}
                                    height={300}
                                    className="w-3/5 h-48 object-cover group-hover:scale-125 transition-transform duration-200 m-auto"
                                />
                                <Badge className="absolute top-0 left-2" variant="secondary">
                                    {item.category?.name}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                                <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">{item.price.toFixed(3)} DT</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/products/${item.id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </>
    )
}

export default ProductsItem
