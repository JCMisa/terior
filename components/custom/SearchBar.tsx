"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("query", value.trim());
      params.set("page", "1"); // reset to first page
    } else {
      params.delete("query");
      params.set("page", "1");
    }
    router.push(`/user-dashboard/explore?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2 max-w-md mx-auto w-full"
    >
      <Input
        type="text"
        placeholder="Search rooms..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1"
      />
      <Button
        type="submit"
        variant="default"
        className="text-white cursor-pointer"
      >
        <Search className="w-4 h-4 mr-1" />
        Search
      </Button>
    </form>
  );
}
