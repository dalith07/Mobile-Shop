"use client";
import { Button } from "@/components/ui/button";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOMAIN } from "@/lib/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from "sonner";

interface DeleteCategoryIdButtonProps {
  UsersId: string;
}
const DeleteUsersButton = ({ UsersId }: DeleteCategoryIdButtonProps) => {
  const router = useRouter();
  const deleteArticleHandler = async () => {
    try {
      if (confirm("You Want Delete This Users, Are You Sure?")) {
        await axios.delete(`${DOMAIN}/api/dashboard/users/${UsersId}`);
        router.refresh();
        toast.warning("User Deleted");
      }
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };
  return (
    <Button
      onClick={deleteArticleHandler}
      variant="destructive"
    >
      <RiDeleteBin6Fill className="w-8 h-8" />
    </Button>
  );
};

export default DeleteUsersButton;
