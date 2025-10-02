"use client";

import React from "react";
import IconCaretLeft from "../icons/IconCaretLeft";
import IconCaretRight from "../icons/IconCaretRight";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
};

const Pagination = ({ pagination }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination) return null;

  const { page, totalPages } = pagination;

  const updatePage = (nextPage: number) => {
    // Clamp to valid bounds
    const target = Math.max(1, Math.min(totalPages, nextPage));

    // Build a fresh query object from current params to preserve filters/sorts
    const params = new URLSearchParams(searchParams.toString());

    if (target === 1) {
      // Don’t pollute the URL with ?page=1
      params.delete("page");
    } else {
      params.set("page", String(target));
    }

    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;

    // Use Next’s router so useSearchParams() stays reactive
    router.replace(href, { scroll: false });
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;
  let pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages > 5) {
    if (page <= 3) {
      // console.log("First 3 pages");
      pageNumbers = [1, 2, 3, 4, totalPages];
    } else if (page >= totalPages - 2) {
      // console.log("Last 3 pages");
      pageNumbers = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // console.log("Middle pages");
      pageNumbers = [1, page - 1, page, page + 1, totalPages];
    }
  }
  console.log("Pagination render:", { pageNumbers });

  return (
    <div className="flex-row-between w-full">
      <button
        type="button"
        className="btn btn-pagination group transition-300 w-10 aspect-square md:w-auto md:aspect-auto"
        disabled={!canPrev}
        aria-disabled={!canPrev}
        aria-label="Previous page"
        onClick={() => updatePage(page - 1)}
      >
        <IconCaretLeft />
        <p className="text-grey-900 group-hover:text-white transition-300 hidden md:block">Prev</p>
      </button>
      {/* Mobile Pagination */}
      <div className="flex items-center gap-2 md:hidden">
        {pageNumbers.map((num, idx) => {
          // Show ellipsis on mobile for skipped pages
          const isEllipsis =
            totalPages > 5 &&
            ((page <= 2 && idx === 3) ||
              (page >= totalPages - 1 && (idx === 1 || idx === 2)) ||
              (page >= 3 && page < totalPages - 1 && (idx === 1 || idx === 3)) ||
              (page === totalPages && idx === totalPages - 4));

          const isHidden =
            (page <= 1 && idx === 1) ||
            (page <= 2 && idx === 2) ||
            (page >= totalPages - 1 && idx === 2) ||
            (page === totalPages && (idx === 2 || idx === 3));

          if (isHidden) {
            return null;
          }

          // Only show ellipsis on mobile screens
          if (isEllipsis) {
            return (
              <span key={`ellipsis-${idx}`} className=" px-2 text-grey-600" aria-hidden="true">
                ...
              </span>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              className={`btn btn-pagination aspect-square w-10 h-10 ${
                num === page ? "bg-grey-900 text-white hover:bg-beige-600" : ""
              } transition-300 `}
              onClick={() => updatePage(num)}
              aria-current={num === page ? "page" : undefined}
              aria-label={num === page ? `Page ${num}, current page` : `Go to page ${num}`}
            >
              {num}
            </button>
          );
        })}
      </div>
      {/* Desktop Pagination */}
      <div className=" items-center gap-2 hidden md:flex">
        {pageNumbers.map((num, idx) => (
          // Show all page numbers on desktop
          <div key={idx} className="flex items-center gap-2">
            <button
              type="button"
              className={`btn btn-pagination h-10 w-10 aspect-square ${
                num === page ? "bg-grey-900 text-white hover:bg-beige-600" : ""
              } transition-300 `}
              onClick={() => updatePage(num)}
              aria-current={num === page ? "page" : undefined}
              aria-label={num === page ? `Page ${num}, current page` : `Go to page ${num}`}
            >
              {num}
            </button>
            {totalPages > 5 && idx < pageNumbers.length - 1 && num < pageNumbers[idx + 1] - 1 && (
              <span className=" px-2 text-grey-600" aria-hidden="true">
                ...
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-pagination group transition-300 w-10 aspect-square md:w-auto md:aspect-auto"
        disabled={!canNext}
        aria-disabled={!canNext}
        aria-label="Next page"
        onClick={() => updatePage(page + 1)}
      >
        <p className="text-grey-900 group-hover:text-white transition-300 hidden md:block">Next</p>
        <IconCaretRight />
      </button>
    </div>
  );
};

export default Pagination;
