"use client";
import { cn, generatePagination, updateURLParams } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  queryString?: string;
};

const Pagination = ({
  currentPage = 1,
  totalPages = 10,
  queryString = "",
}: PaginationProps) => {
  const pages = generatePagination(currentPage, totalPages);
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    return updateURLParams(
      searchParams,
      {
        page: pageNumber.toString(),
        query: queryString?.trim() || null,
      },
      "/user-dashboard/explore"
    );
  };

  const navigateToPage = (pageNumber: number) => {
    if (
      !Number.isFinite(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > totalPages
    )
      return;
    router.push(createPageUrl(pageNumber));
  };

  return (
    <section className="flex justify-between items-center py-5 gap-5 border-t border-light/20 dark:border-dark/20">
      <Button
        variant={"outline"}
        onClick={() => navigateToPage(currentPage - 1)}
        className={cn("flex items-center gap-2 cursor-pointer", {
          "pointer-events-none opacity-50": currentPage === 1,
        })}
        disabled={currentPage === 1}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="size-5" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              className="text-muted-foreground px-2"
              key={`ellipsis-${index}`}
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => navigateToPage(page as number)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-600",
                currentPage === (page as number)
                  ? "bg-primary"
                  : "bg-background"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <Button
        variant={"outline"}
        onClick={() => navigateToPage(currentPage + 1)}
        className={cn("lex items-center gap-2 cursor-pointer", {
          "pointer-events-none opacity-50": currentPage === totalPages,
        })}
        disabled={currentPage === totalPages}
        aria-disabled={currentPage === totalPages}
      >
        Next
        <ChevronRightIcon className="size-5" />
      </Button>
    </section>
  );
};

export default Pagination;
