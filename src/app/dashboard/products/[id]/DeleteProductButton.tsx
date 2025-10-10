/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { DOMAIN } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteCategoryIdButtonProps {
    ProductionId: string;
}
const DeleteProductButton = ({ ProductionId }: DeleteCategoryIdButtonProps) => {
    const router = useRouter();

    const deleteProductHandler = async () => {
        try {
            if (confirm("You Want Delete This Product, Are You Sure?")) {
                await axios.delete(`${DOMAIN}/api/dashboard/products/${ProductionId}`);
                router.push("/dashboard/products")
                toast.info("Product Deleted");
            }
        } catch (error: any) {
            toast.error(error?.response?.data.message);
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            onClick={deleteProductHandler}
            variant="destructive"
            className="flex-1"
        >
            Delete
        </Button>
    );
};

export default DeleteProductButton;
