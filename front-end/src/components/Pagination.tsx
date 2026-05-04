import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { memo } from "react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Returns an array of page numbers to display, with `null` representing ellipsis gaps.
 * Always shows first and last page, and a window of pages around the current page.
 */
function getPageRange(
  current: number,
  total: number,
  windowSize = 1,
): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [];
  const start = Math.max(2, current - windowSize);
  const end = Math.min(total - 1, current + windowSize);

  // First page
  pages.push(1);

  // Ellipsis after first
  if (start > 2) {
    pages.push(null);
  }

  // Window around current
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ellipsis before last
  if (end < total - 1) {
    pages.push(null);
  }

  // Last page
  pages.push(total);

  return pages;
}

export const CustomPagination = memo(function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === null ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
});
