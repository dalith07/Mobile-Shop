"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchProductsInput = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ searchText });
    router.push(`/MarketPlace/search?searchText=${searchText}`);
  };

  return (<>
    <div className="relative">
      <Search className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <form className=" flex space-x-2" onSubmit={formSubmitHandler}>
        <Input
          // placeholder="Search productions by name, description, or tags..."
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search productions by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="pl-10 bg-transparent"
        />
        <Button type="submit" className="text-white hover:cursor-pointer">Search</Button>
      </form>
    </div></>

  );
};

export default SearchProductsInput;
