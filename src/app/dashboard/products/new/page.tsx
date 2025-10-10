/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Home, Upload, X, Plus, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DOMAIN } from "@/lib/constants";
import Image from "next/image";

interface ImageFile {
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
    uploadedData?: any;
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

export default function NewProductionPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [status, setStatus] = useState("Pending");
    const [quantity, setQuantity] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [images, setImages] = useState<ImageFile[]>([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState<Category[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [filteredModels, setFilteredModels] = useState<Model[]>([]);

    // Mock data (replace with real API call in production)
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
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            setFilteredModels(models.filter((model) => model.categoryId === selectedCategoryId));
            setSelectedModelId(""); // Reset model on category change
        } else {
            setFilteredModels([]);
            setSelectedModelId("");
        }
    }, [selectedCategoryId, models]);

    const { startUpload } = useUploadThing("imageUploader", {

        onClientUploadComplete: (res) => {

            setImages((prev) =>
                prev.map((img) => {
                    // Find the uploaded file by matching file name and size for more reliable matching
                    const uploadedFile = res.find(
                        (r) => r.name === img.file.name && r.size === img.file.size
                    );

                    if (uploadedFile) {
                        return {
                            ...img,
                            uploaded: true,
                            url: uploadedFile.ufsUrl || uploadedFile.url, // Use actual UploadThing URL
                            uploadedData: uploadedFile,
                        };
                    } else {
                        return img; // Keep original image if no match found
                    }
                })
            );

            toast.success("Images uploaded successfully");
            setUploadProgress(0);
        },

        onUploadError: (error) => {
            let errorMessage = "Upload failed. Please try again.";
            if (error.message.includes("File too large")) errorMessage = "File too large. Max 10MB.";
            if (error.message.includes("Invalid file type")) errorMessage = "Invalid file type. Use images only.";
            toast.error(errorMessage);
            setUploadProgress(0);
        },
        onUploadProgress: (progress) => setUploadProgress(progress),
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const remainingSlots = 4 - images.length;
            if (remainingSlots <= 0) {
                toast.error("Maximum 4 images allowed");
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
                toast.warning(`Only ${remainingSlots} more images can be added.`);
            }

            setUploadProgress(0);
            await startUpload(filesToAdd, {}); // Added empty object as second argument
        },
        [images.length, startUpload],
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
        maxFiles: 4 - images.length,
        disabled: images.length >= 4,
        multiple: true,
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    const removeImage = (index: number) => {
        setImages((prev) => {
            const newImages = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index].preview);
            return newImages;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !price.trim() || !selectedCategoryId || !selectedModelId) {
            toast.error("Please fill all required fields");
            return;
        }

        const unuploadedImages = images.filter((img) => !img.uploaded);
        if (unuploadedImages.length > 0) {
            toast.error("Please upload all images before submitting");
            return;
        }

        try {
            // await axios.post(`${DOMAIN}/api/dashboard/production`, {
            //     title: title,
            //     description: description,
            //     price: parseFloat(price),
            //     discount: discount ? parseFloat(discount) : 0,
            //     status: status,
            //     quantity: quantity ? parseInt(quantity) : 0,
            //     image: images.map((img) => ({
            //         imageUrl: img.url!,
            //     })),
            // })

            await axios.post(`${DOMAIN}/api/dashboard/products`, {
                title: title,
                description: description,
                price: parseFloat(price),
                discount: discount ? parseFloat(discount) : 0,
                status: status,
                quantity: quantity ? parseInt(quantity) : 0,
                categoryName: selectedCategoryId,
                modelName: selectedModelId,
                // image: images.map((img) => ({
                //     imageUrl: img.url!,
                // })),
                image: images.map((img) => ({
                    imageUrl: img.uploadedData?.ufsUrl || img.uploadedData?.url,
                })),
            })

            router.refresh()
            toast.success("Products Created Successfully");
        } catch (error: any) {
            // console.log("😭😭😭😭", error)
            toast.error(error?.response?.data?.message);
        }
    };

    const getDropzoneStyle = () => {
        const baseStyle = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer";
        return images.length >= 4
            ? `${baseStyle} border-muted-foreground/25 bg-muted/20 cursor-not-allowed opacity-50`
            : isDragAccept
                ? `${baseStyle} border-green-500 bg-green-50 border-solid`
                : isDragReject
                    ? `${baseStyle} border-red-500 bg-red-50 border-solid`
                    : isDragActive
                        ? `${baseStyle} border-primary bg-primary/5 border-solid scale-105`
                        : `${baseStyle} border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20`;
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
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Production
                    </Link>
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">New Production</h1>
                <div className="ml-auto">
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Home
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="flex-1 space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Production</CardTitle>
                        <CardDescription>Add a new production item to your inventory.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Category and Model Selection */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger className="w-[200px]">
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

                                <div className="space-y-2">
                                    <Label htmlFor="model">Model *</Label>
                                    <Select value={selectedModelId} onValueChange={setSelectedModelId} disabled={!selectedCategoryId}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder={selectedCategoryId ? "Select a model" : "Select category first"} />
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

                            {/* Status and Quantity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 " >
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={status} onValueChange={setStatus} >
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sold">quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-[200px]"
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

                            {/* Price and Sold - Side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">DT</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="pl-8"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sold">discount</Label>
                                    <Input
                                        id="sold"
                                        type="number"
                                        placeholder="0"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Production Images ({images.length}/4)</Label>
                                <div {...getRootProps()} className={getDropzoneStyle()}>
                                    <input {...getInputProps()} />
                                    {images.length >= 4 ? (
                                        <>
                                            <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-sm font-medium text-muted-foreground">Maximum images reached</p>
                                        </>
                                    ) : uploadProgress > 0 ? (
                                        <>
                                            <Loader2 className="h-10 w-10 mx-auto mb-4 text-primary animate-spin" />
                                            <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                                            <p className="text-xs text-muted-foreground">{uploadProgress}% complete</p>
                                        </>
                                    ) : isDragActive ? (
                                        isDragAccept ? (
                                            <p className="text-sm font-medium text-green-700">Drop the images here</p>
                                        ) : (
                                            <p className="text-sm font-medium text-red-700">Invalid file type</p>
                                        )
                                    ) : (
                                        <>
                                            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-sm font-medium">Drag & drop or click to select</p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB • Max {4 - images.length} more</p>
                                        </>
                                    )}
                                </div>

                                {images.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Selected Images</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={image.preview}
                                                        alt={`Production image ${index + 1}`}
                                                        width={150}
                                                        height={150}
                                                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        onClick={() => removeImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                    <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                                                        {index + 1}
                                                    </Badge>
                                                    {image.uploaded && (
                                                        <Badge variant="default" className="absolute top-1 left-1 text-xs bg-green-600">
                                                            ✓
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button type="submit" className="flex-1 text-white" disabled={images.some((img) => !img.uploaded)}>
                                    <Plus className="h-4 w-4 mr-2 animate-ping" />
                                    Create Production
                                </Button>
                                <Button type="button" variant="outline" className="flex-1" asChild>
                                    <Link href="/dashboard/products">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {(title || description || price || selectedCategoryId || selectedModelId) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>This is how your production item will appear</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {title && <h3 className="text-xl font-semibold">{title}</h3>}
                                {description && <p className="text-muted-foreground">{description}</p>}
                                <div className="flex flex-wrap gap-2">
                                    {selectedCategoryId && (
                                        <Badge variant="secondary">Category: {categories.find((c) => c.id === selectedCategoryId)?.name}</Badge>
                                    )}
                                    {selectedModelId && (
                                        <Badge variant="outline">Model: {models.find((m) => m.id === selectedModelId)?.name}</Badge>
                                    )}
                                    {price && <Badge variant="secondary">Price: ${price}</Badge>}
                                    {discount && <Badge variant="outline">Discount: {discount}%</Badge>}
                                    {quantity && <Badge variant="outline">Quantity: {quantity}</Badge>}
                                    <Badge
                                        className={
                                            status === "Completed"
                                                ? "bg-green-100 text-green-800"
                                                : status === "In Progress"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                        }
                                    >
                                        {status}
                                    </Badge>
                                    {images.length > 0 && (
                                        <Badge variant="outline">{images.length} image{images.length !== 1 ? "s" : ""}</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div >
    );
}