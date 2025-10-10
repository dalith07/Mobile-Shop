

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Home, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DOMAIN } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductsWithAll } from "@/lib/utils";
import DeleteProductButton from "./DeleteProductButton";

interface ProductionProps {
    product: ProductsWithAll;
}

interface ImageFileAndProductnWithImagesProps {
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
}

interface Category {
    id: string;
    name: string;
    description?: string;
}

interface Model {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
}

export default function UpdateProductionPage({ product }: ProductionProps) {

    const router = useRouter();
    const [title, setTitle] = useState(product.title);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price);
    const [discount, setDiscount] = useState(product.discount);
    const [status, setStatus] = useState(product.status);
    const [quantity, setQuantity] = useState(product.quantity);
    const [images, setImages] = useState<ImageFileAndProductnWithImagesProps[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [categories, setCategories] = useState<Category[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [filteredModels, setFilteredModels] = useState<Model[]>([]);

    const [loading, setLoading] = useState(true);

    const [selectedCategoryId, setSelectedCategoryId] = useState(product.categoryId || "");
    const [selectedModelId, setSelectedModelId] = useState(product.modelId || "");


    // Mock data for categories and models (replace with real API call in production)
    useEffect(() => {
        const mockCategories: Category[] = [
            { id: "Telephonie", name: "Téléphonie & Tablette" },
            { id: "Informatique", name: "Informatique" },
            { id: "Accessories", name: "Accessories Mobile" },
            { id: "Audio", name: "Audio Devices" },
        ];

        const mockModels: Model[] = [
            { id: "Smartphone", name: "Smartphone", categoryId: "Telephonie" },
            { id: "Tablette", name: "Tablette", categoryId: "Telephonie" },
            { id: "Ipad", name: "IPad", categoryId: "Telephonie" },
            { id: "Pc Portable", name: "Pc Portable", categoryId: "Informatique" },
            { id: "Pc Gamer", name: "Pc Gamer", categoryId: "Informatique" },
            { id: "Boitier Pc Gamer", name: "Boitier Pc Gamer", categoryId: "Informatique" },
            { id: "Ecran", name: "Ecran", categoryId: "Informatique" },
            { id: "Apple Watch", name: "Apple Watch", categoryId: "Accessories" },
            { id: "AirPods", name: "AirPods", categoryId: "Accessories" },
            { id: "Chargeur Mobile", name: "Chargeur Mobile", categoryId: "Accessories" },
            { id: "Computer PC Speakers", name: "Computer PC Speakers", categoryId: "Audio" },
            { id: "FIFINE Gaming", name: "FIFINE Gaming", categoryId: "Audio" },
            { id: "Microphone", name: "Microphone", categoryId: "Audio" },
        ];

        setCategories(mockCategories);
        setModels(mockModels);
        setLoading(false);

        setSelectedCategoryId(product.categoryId);
        setSelectedModelId(product.modelId);
    }, [product]);

    useEffect(() => {
        if (selectedCategoryId) {
            const filtered = models.filter((model) => model.categoryId === selectedCategoryId);
            setFilteredModels(filtered);

            // ✅ Only reset if current model doesn’t belong to this category
            if (!filtered.some((m) => m.id === selectedModelId)) {
                setSelectedModelId("");
            }
        } else {
            setFilteredModels([]);
            setSelectedModelId("");
        }
    }, [selectedCategoryId, models, selectedModelId]);


    // UploadThing hook
    const { startUpload, isUploading: uploadThingLoading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            setImages((prev) => {
                return prev.map((img) => {
                    const uploadedFile = res.find((r) => r.name === img.file.name);
                    return {
                        ...img,
                        uploaded: true,
                        url: uploadedFile?.ufsUrl || uploadedFile?.url,
                    };
                });
            });

            toast.success("Image uploaded successfully");
            setUploadProgress(0);
            setIsUploading(false);
        },
        onUploadError: (error) => {
            toast.error(`Upload failed: ${error.message}`);
            setIsUploading(false);
            setUploadProgress(0);
        },
        onUploadProgress: (progress: number) => {
            setUploadProgress(progress);
        },
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const totalImages = product.images.length + images.length;
            const remainingSlots = 4 - totalImages;

            if (remainingSlots <= 0) {
                toast.warning("Maximum 4 images allowed");
                return;
            }

            const filesToAdd = acceptedFiles.slice(0, remainingSlots);
            const newImages = filesToAdd.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                uploaded: false,
            }));

            setImages((prev) => [...prev, ...newImages]);

            if (acceptedFiles.length > remainingSlots) {
                alert(`Only ${remainingSlots} more images can be added. Maximum 4 images allowed.`);
            }

            setIsUploading(true);
            try {
                await startUpload(filesToAdd, {});
            } catch (error: any) {
                toast.error("Upload failed:", error)
            }
        },
        [images.length, startUpload, product.images.length]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop,
        accept: {
            // "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            "image/*": [".jpeg", ".jpg", ".png",],
        },
        maxFiles: 4 - images.length,
        disabled: images.length >= 4 || isUploading,
        multiple: true,
    });

    const uploadImages = async () => {
        if (images.length === 0) return;

        const filesToUpload = images.filter((img) => !img.uploaded).map((img) => img.file);

        if (filesToUpload.length === 0) {
            alert("All images are already uploaded!");
            return;
        }

        setIsUploading(true);
        try {
            await startUpload(filesToUpload, {});
        } catch (error: any) {
            toast.error("Upload failed:", error)
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async (id: string) => {
        console.log("✅✅✅", id)
        try {
            if (confirm("You Want Delete This Image, Are You Sure?")) {
                await axios.delete(`${DOMAIN}/api/dashboard/products/image/${id}`);
                router.refresh()
                toast.info("Image Deleted");
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data.message);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !price || !selectedCategoryId || !selectedModelId) {
            toast.error("Please fill all required fields");
            return;
        }

        const unuploadedImages = images.filter((img) => !img.uploaded);
        if (unuploadedImages.length > 0) {
            toast.error("Please upload all images before submitting");
            await uploadImages();
            return;
        }

        try {
            // Validate that all images have proper URLs (not blob URLs)
            const invalidImages = images.filter(img => !img.url || img.url.startsWith('blob:'));
            if (invalidImages.length > 0) {
                toast.error("Some images are not properly uploaded. Please try uploading again.");
                return;
            }

            await axios.put(`${DOMAIN}/api/dashboard/products/${product.id}`, {
                title: title,
                description: description,
                price: price,
                discount: discount,
                status: status,
                quantity: quantity,
                categoryName: categories.find((c) => c.id === selectedCategoryId)?.name,
                modelName: models.find((m) => m.id === selectedModelId)?.name,
                image: images.map((img) => ({
                    imageUrl: img.url!,
                })),
            });

            router.refresh();
            toast.success("Update Product");
        } catch (error: any) {
            toast.error(error?.response?.data.message);
        }
    };

    const getDropzoneStyle = () => {
        const baseStyle = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer";

        if (images.length >= 4 || isUploading) {
            return `${baseStyle} border-muted-foreground/25 bg-muted/20 cursor-not-allowed opacity-50`;
        }

        if (isDragAccept) {
            return `${baseStyle} border-green-500 bg-green-50 border-solid`;
        }

        if (isDragReject) {
            return `${baseStyle} border-red-500 bg-red-50 border-solid`;
        }

        if (isDragActive) {
            return `${baseStyle} border-primary bg-primary/5 border-solid scale-105`;
        }

        return `${baseStyle} border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-4 w-4 mr-2 animate-ping" />
                        <span className="text-[12px] md:text-[16px]">Back to Production</span>
                    </Link>
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm md:text-lg font-semibold">Update Production</h1>
                <div className="ml-auto">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 md:mr-2" />
                            <span className="md:block hidden"> Home</span>
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="flex-1 space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-blue-500 text-[16px] md:text-lg">Update Production</CardTitle>
                        <CardDescription className="text-[12px] md:text-[14px]">
                            Update a production item in your inventory. Fill in all the required information below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title - Category - Model */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Production Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter production title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </div>

                                {/* Model */}
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model *</Label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId} disabled={!selectedCategoryId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredModels.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>
                                                    {model.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Status - Quantity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select onValueChange={(value) => setStatus(value)} value={status}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        required
                                        className="w-[180px]"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your production item in detail..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[120px]"
                                    required
                                />
                            </div>

                            {/* Price and Discount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500">$</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={price.toFixed(2)}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="w-[180px] pl-8"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discount">Discount</Label>
                                    <Input
                                        id="discount"
                                        type="number"
                                        placeholder="0"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-[180px]"
                                    />
                                </div>
                            </div>

                            {/* Images Upload with Dropzone */}
                            <div className="space-y-4">
                                <Label>Production Images ({images.length}/4)</Label>

                                {/* Dropzone Area */}
                                <div {...getRootProps()} className={getDropzoneStyle()}>
                                    <input {...getInputProps()} />

                                    {images.length >= 4 ? (
                                        <>
                                            <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Maximum images reached</p>
                                                <p className="text-xs text-muted-foreground">Remove an image to add more</p>
                                            </div>
                                        </>
                                    ) : isUploading ? (
                                        <>
                                            <Loader2 className="h-10 w-10 mx-auto mb-4 text-primary animate-spin" />
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Uploading images...</p>
                                                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                                                <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                                            </div>
                                        </>
                                    ) : isDragActive ? (
                                        isDragAccept ? (
                                            <>
                                                <Upload className="h-10 w-10 mx-auto mb-4 text-green-600" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-green-700">Drop the images here</p>
                                                    <p className="text-xs text-green-600">Release to upload your images</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <X className="h-10 w-10 mx-auto mb-4 text-red-600" />
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-red-700">Invalid file type</p>
                                                    <p className="text-xs text-red-600">Only image files are allowed</p>
                                                </div>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">Drag & drop images here, or click to select</p>
                                                <p className="text-xs text-muted-foreground">
                                                    PNG, JPG, GIF up to 10MB each • Maximum {4 - images.length} more images
                                                </p>
                                            </div>
                                            <Button type="button" variant="outline" className="mt-4 bg-transparent">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choose Files
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Upload Button */}
                                {images.length > 0 && images.some((img) => !img.uploaded) && (
                                    <div className="flex justify-center">
                                        <Button
                                            type="button"
                                            onClick={uploadImages}
                                            disabled={isUploading || uploadThingLoading}
                                            className="w-full max-w-xs"
                                        >
                                            {isUploading || uploadThingLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Images
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {/* Image Preview Grid */}
                                {product?.images?.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="mb-4">Product Images:</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {product.images.map((image, index) => (
                                                <div key={image.id} className="relative group">
                                                    <Image
                                                        src={image.imageUrl}
                                                        alt={`Product image`}
                                                        width={350}
                                                        height={350}
                                                        className="w-[80%] h-full object-cover rounded-lg border shadow-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        variant="destructive"
                                                        className="absolute z-50 -top-2 right-4 h-7 w-7 rounded-full animate-pulse"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                    <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                                                        {index + 1}
                                                    </Badge>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                                                    <h2>{image.id}</h2>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col justify-between sm:flex-row gap-4 pt-6">
                                <div>
                                    <Button type="button" variant="outline" className="bg-transparent">
                                        <Link href="/dashboard/products">Cancel</Link>
                                    </Button>
                                </div>

                                <div className="space-x-4">
                                    <Button
                                        type="submit"
                                        className="text-white flex-1"
                                        disabled={isUploading || images.some((img) => !img.uploaded)}
                                    >
                                        Update Production
                                    </Button>

                                    <DeleteProductButton ProductionId={product.id} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


{/* <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={"Select a category"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
 </Select> */}




// <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
//     <SelectTrigger className="w-full">
//         <SelectValue placeholder="Select a category" />
//     </SelectTrigger>
//     <SelectContent>
//         {categories.map((category) => (
//             <SelectItem key={category.id} value={category.id}>
//                 {category.name}
//             </SelectItem>
//         ))}
//     </SelectContent>
// </Select>