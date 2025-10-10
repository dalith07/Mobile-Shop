/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { DOMAIN } from "@/lib/constants";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteImageIdButtonProps {
    ImageId: string;
}
const DeleteImageProduct = ({ ImageId }: DeleteImageIdButtonProps) => {
    const router = useRouter();
    console.log("ImageId", ImageId);

    const deleteImageHandler = async () => {
        console.log(ImageId)
        try {
            if (confirm("You Want Delete This Image, Are You Sure?")) {
                await axios.delete(`${DOMAIN}/api/dashboard/products/image/${ImageId}`);
                router.refresh()
                toast.info("Image Deleted");
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message);
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            onClick={deleteImageHandler}
            variant="destructive"
            className="absolute z-50 -top-2 right-4 h-7 w-7 rounded-full animate-pulse"
        >
            <X className="h-3 w-3" />
        </Button>
    );
};

export default DeleteImageProduct;
