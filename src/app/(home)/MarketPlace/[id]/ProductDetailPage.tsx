"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ShoppingCart,
    Heart,
    Share2,
    Star,
    ChevronLeft,
    Truck,
    Shield,
    RefreshCw,
    AlertCircle,
    Check,
    Minus,
    Plus,
} from "lucide-react"
import { toast } from "sonner"
import { ProductsWithAll } from "@/lib/utils"
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart_context"

interface ProductPageProps {
    product: ProductsWithAll
}

export default function ProductDetailPage({ product }: ProductPageProps) {
    const router = useRouter()
    const { addItem } = useCart()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isFavorite, setIsFavorite] = useState(false)

    const handleQuantityChange = (action: "increase" | "decrease") => {
        if (action === "increase" && product && quantity < product.quantity) {
            setQuantity(quantity + 1)
        } else if (action === "decrease" && quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            image: product.images[0]?.imageUrl || "",
            category: product.category.name,
            model: product.model.name,
            maxQuantity: product.quantity,
        })

        toast.success(`Added ${quantity} ${product.title} to cart!`)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.title,
                text: product?.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        }
    }

    const calculateDiscount = () => {
        if (!product || !product.discount) return null
        const discountedPrice = product.price * (1 - product.discount / 100)
        return discountedPrice
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
        ))
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                    <p className="text-muted-foreground mb-4">The product youre looking for doesnt exist.</p>
                    <Button asChild>
                        <Link href="/MarketPlace">Back to Marketplace</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const discountedPrice = calculateDiscount()
    const inStock = product.quantity > 0 && product.status !== "Out of Stock"

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <section className="py-4 px-4 border-b">
                <div className="container mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/MarketPlace" className="hover:text-foreground transition-colors">
                            Marketplace
                        </Link>
                        <span>/</span>
                        <Link
                            href={`/MarketPlace?category=${product.category.name}`}
                            className="hover:text-foreground transition-colors"
                        >
                            {product.category.name}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground font-medium truncate">{product.title}</span>
                    </div>
                </div>
            </section>

            {/* Product Details */}
            <section className="py-8 px-4">
                <div className="container mx-auto">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-6">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={product.images[selectedImage]?.imageUrl || "/placeholder.svg"}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                        {product.discount > 0 && (
                                            <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg">
                                                -{product.discount}%
                                            </Badge>
                                        )}
                                        {!inStock && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <Badge className="bg-red-500 text-white text-lg py-2 px-4">Out of Stock</Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? "border-primary ring-2 ring-primary/20" : "border-muted"
                                                }`}
                                        >
                                            <Image
                                                src={image.imageUrl || "/placeholder.svg"}
                                                alt={`${product.title} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1">{renderStars(4.8)}</div>
                                            <span className="text-sm text-muted-foreground">4.8 (128 reviews)</span>
                                            <span className="text-sm text-muted-foreground">•</span>
                                            <span className="text-sm text-muted-foreground">256 sold</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsFavorite(!isFavorite)}
                                            className={isFavorite ? "text-red-500 border-red-500" : ""}
                                        >
                                            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={handleShare}>
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="secondary" className="text-sm">
                                        {product.category.name}
                                    </Badge>
                                    <Badge variant="outline" className="text-sm">
                                        {product.model.name}
                                    </Badge>
                                    <Badge
                                        className={`text-sm ${inStock
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "bg-red-100 text-red-800 hover:bg-red-100"
                                            }`}
                                    >
                                        {inStock ? `In Stock (${product.quantity})` : "Out of Stock"}
                                    </Badge>
                                </div>

                                <div className="flex items-baseline gap-3 mb-6">
                                    {discountedPrice ? (
                                        <>
                                            <span className="text-4xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                                            <span className="text-2xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                                            <Badge variant="destructive" className="text-sm">
                                                Save ${(product.price - discountedPrice).toFixed(2)}
                                            </Badge>
                                        </>
                                    ) : (
                                        <span className="text-4xl font-bold">{product.price.toFixed(3)} DT</span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Quantity Selector */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Quantity</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border rounded-lg">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange("decrease")}
                                                disabled={quantity <= 1 || !inStock}
                                                className="rounded-r-none"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="px-6 py-2 font-semibold min-w-[60px] text-center">{quantity}</div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange("increase")}
                                                disabled={quantity >= product.quantity || !inStock}
                                                className="rounded-l-none"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {inStock && <span className="text-sm text-muted-foreground">{product.quantity} available</span>}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <Button size="lg" className="flex-1 text-lg" onClick={handleAddToCart} disabled={!inStock}>
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {inStock ? "Add to Cart" : "Out of Stock"}
                                    </Button>
                                    <Button size="lg" variant="outline" className="flex-1 text-lg bg-transparent" disabled={!inStock}>
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm font-medium">Free Shipping</p>
                                        <p className="text-xs text-muted-foreground">On orders over $50</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm font-medium">Warranty</p>
                                        <p className="text-xs text-muted-foreground">1 year guarantee</p>
                                    </CardContent>
                                </Card>
                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <RefreshCw className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-sm font-medium">Easy Returns</p>
                                        <p className="text-xs text-muted-foreground">30 days return</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs */}
                    <Tabs defaultValue="description" className="mb-12">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews (128)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Description</CardTitle>
                                </CardHeader>
                                <CardContent className="prose max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                                    <h3 className="text-lg font-semibold mt-6 mb-3">Key Features:</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Premium quality materials and construction</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Advanced technology for superior performance</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Sleek and modern design that fits any style</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Energy efficient and environmentally friendly</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="specifications" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Technical Specifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Category</span>
                                                <span className="text-muted-foreground">{product.category.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Model</span>
                                                <span className="text-muted-foreground">{product.model.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Status</span>
                                                <Badge variant="outline">{product.status}</Badge>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Product ID</span>
                                                <span className="text-muted-foreground font-mono text-xs">{product.id}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Availability</span>
                                                <span className="text-muted-foreground">{product.quantity} in stock</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Weight</span>
                                                <span className="text-muted-foreground">1.2 kg</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Dimensions</span>
                                                <span className="text-muted-foreground">15 x 10 x 5 cm</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Warranty</span>
                                                <span className="text-muted-foreground">1 Year</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="reviews" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Reviews</CardTitle>
                                    <CardDescription>See what our customers are saying about this product</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Review Summary */}
                                        <div className="flex items-center gap-8 p-6 bg-muted/50 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold mb-2">4.8</div>
                                                <div className="flex items-center gap-1 mb-1">{renderStars(4.8)}</div>
                                                <p className="text-sm text-muted-foreground">Based on 128 reviews</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {[5, 4, 3, 2, 1].map((rating) => (
                                                    <div key={rating} className="flex items-center gap-3">
                                                        <span className="text-sm w-12">{rating} star</span>
                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400"
                                                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground w-12 text-right">
                                                            {rating === 5 ? "96" : rating === 4 ? "25" : "7"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Sample Reviews */}
                                        <div className="space-y-6">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-semibold">John Doe</span>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    Verified Purchase
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">{renderStars(5)}</div>
                                                                <span className="text-sm text-muted-foreground">2 days ago</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-muted-foreground">
                                                        Excellent product! The quality exceeded my expectations. Fast shipping and great customer
                                                        service. Highly recommended!
                                                    </p>
                                                    <Separator />
                                                </div>
                                            ))}
                                        </div>

                                        <Button variant="outline" className="w-full bg-transparent">
                                            Load More Reviews
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Related Products */}
                    {/* <div>
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="group hover:shadow-lg transition-all">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                            <Image
                                                src={`/product_placeholder.png?height=300&width=300&text=Product ${i}`}
                                                alt={`Related product ${i}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold mb-2 line-clamp-1">Related Product {i}</h3>
                                        <div className="flex items-center gap-1 mb-2">{renderStars(4.5)}</div>
                                        <p className="text-lg font-bold">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div> */}
                </div>
            </section>
        </div>
    )
}
