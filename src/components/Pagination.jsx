"use client";

import Link from "next/link";
export default function Pagination({ currentPage, totalPages, basePath }) {
  return (
    <div className="pagination-container">
      {currentPage > 0 && (
        <Link
          href={`${basePath}/${currentPage - 1}`}
          className="pagination-button"
        >
          ⬅ Previous
        </Link>
      )}
      <span className="pagination-info">
        Page {currentPage + 1} of {totalPages}
      </span>
      {currentPage < totalPages - 1 && (
        <Link
          href={`${basePath}/${currentPage + 1}`}
          className="pagination-button"
        >
          Next ➡
        </Link>
      )}
    </div>
  );
}
