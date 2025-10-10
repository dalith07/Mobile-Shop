/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState, } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Star, Filter, Grid, List, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { ARTICLE_PER_PAGE } from "@/lib/constants"
import { ProductsWithAll } from "@/lib/utils"
import Link from "next/link"
import { useCart } from "@/lib/cart_context"

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  pageSize: number
}

export default function MarketplacePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem } = useCart()

  const [products, setProducts] = useState<ProductsWithAll[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1, totalPages: 1, totalCount: 0, pageSize: ARTICLE_PER_PAGE,
  })
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  // const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [categories, setCategories] = useState<string[]>(["all"])
  const [categoryFilter, setCategoryFilter] = useState("all")


  // const [modelFilter, setModelFilter] = useState("all")

  const currentPage = Number.parseInt(searchParams.get("page") || "1")

  // Fetch products
  useEffect(() => {
    fetchProducts()
  }, [currentPage, categoryFilter, searchQuery])

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        pageNumber: currentPage.toString(),
        ...(searchQuery && { searchText: searchQuery }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
      })

      const response = await fetch(`/api/MarketPlace?${params}`)
      const result = await response.json()

      if (result.success) {
        setProducts(result.data)
        setPagination(result.pagination)
      } else {
        toast.error("Failed to fetch products")
      }
    } catch (error: any) {
      // console.error("Error fetching products:", error)
      toast.error("Failed to fetch products", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/dashboard/categories")
      // console.log(categories)
      const result = await response.json()

      if (result.success) {
        const categoryNames = result.data.map((cat: any) => cat.name)
        setCategories(["all", ...categoryNames])
      }
    } catch (error: any) {
      // console.error("Error fetching categories:", error)
      toast.error("Error fetching categories:", error)
    }
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`/MarketPlace?${params.toString()}`)
  }

  // Handle search
  // const handleSearch = (value: string) => {
  //   setSearchQuery(value)
  //   const params = new URLSearchParams(searchParams.toString())
  //   if (value) {
  //     params.set("search", value)
  //   } else {
  //     params.delete("search")
  //   }
  //   params.set("page", "1") // Reset to first page
  //   router.push(`/marketplace?${params.toString()}`)
  // }
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim())
    } else {
      params.delete("search")
    }
    params.set("page", "1") // reset to first page
    router.push(`/marketplace?${params.toString()}`)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    params.set("page", "1") // Reset to first page
    router.push(`/MarketPlace?${params.toString()}`)
  }

  const filteredItems = products.filter(
    (item) => categoryFilter === "all" || item.category.name === categoryFilter
  )

  // console.log(products)

  // Transform products for display
  const displayProducts = filteredItems.map((product) => ({
    id: product.id,
    name: product.title,
    description: product.description,
    price: product.price,
    category: product.category.name,
    model: product.model.name,
    discount: product.discount,
    quantity: product.quantity,
    rating: 4.8,
    reviews: 124,
    // inStock: true,
    inStock: product.quantity > 0,
    image: product.images?.[0]?.imageUrl,
    seller: "TechCorp",
    tags: ["premium", "durable", "advanced"],
    startDate: product.createdAt, // Replace with actual date if available
    expectedCompletion: "2024-01-25", // Replace with actual date if available
  }))

  // Sort products
  const sortedProducts = [...displayProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const ProductCard = ({ product }: { product: (typeof displayProducts)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/production/appel/appel_iphone_13_1.png"}
            alt={product.name}
            width={"100"}
            height={"100"}
            className="w-3/5 h-48 object-cover group-hover:scale-125 transition-transform duration-200 m-auto"
          />
          {!product.inStock && <Badge className="absolute top-2 right-2 text-white bg-red-500">Out of Stock</Badge>}
          <Badge className="absolute top-2 left-2" variant="secondary">
            {product.category}
          </Badge>
          <Badge className="absolute bottom-2 left-2 bg-primary/90 text-white">{product.model}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{product.description}</CardDescription>
          <div className="flex items-center gap-2">
            <div className="flex items-center">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">{product.price.toFixed(3)} DT</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {/* <Button className="flex-1 text-white" disabled={!product.inStock}
              onClick={handleAddToCartButtonClick}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button> */}

            <Button
              className="flex-1 text-white"
              disabled={!product.inStock}
              onClick={(e) => {
                e.preventDefault()
                addItem({
                  id: product.id,
                  title: product.name,
                  price: product.price,
                  discount: product.discount,
                  image: product.image,
                  category: product.category,
                  model: product.model,
                  maxQuantity: product.quantity,
                })
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Link href={`MarketPlace/${product.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ProductListItem = ({ product }: { product: (typeof displayProducts)[0] }) => (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-lg"
            />
            {!product.inStock && <Badge className="absolute -top-2 -right-2 bg-red-500 text-xs">Out of Stock</Badge>}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </div>
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
                <span className="text-sm text-muted-foreground ml-1">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm" disabled={!product.inStock}
                  onClick={(e) => {
                    e.preventDefault()
                    addItem({
                      id: product.id,
                      title: product.name,
                      price: product.price,
                      discount: product.discount,
                      image: product.image,
                      category: product.category,
                      model: product.model,
                      maxQuantity: product.quantity,
                    })
                  }}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Market<span className="text-yellow-500">place</span>
          </h1>
        </div>
      </section>

      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />

                  <Button type="submit" className="text-white hover:cursor-pointer">Search</Button>
                </form>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {sortedProducts.length} of {pagination.totalCount} products
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading products...</span>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter("all")
                  router.push("/marketplace")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {sortedProducts.map((product) =>
                  viewMode === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  ),
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 pt-8 border-t">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="text-sm text-muted-foreground text-center">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="flex items-center gap-2 bg-transparent px-6"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </Button>

                      <div className="flex items-center gap-2 px-4">
                        <span className="text-lg font-semibold">{pagination.currentPage}</span>
                        <span className="text-muted-foreground">of</span>
                        <span className="text-lg font-semibold">{pagination.totalPages}</span>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="flex items-center gap-2 bg-transparent px-6"
                      >
                        Next
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
