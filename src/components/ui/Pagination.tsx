import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ← Prev
      </button>

      {getPageNumbers().map((p, idx) =>
        typeof p === 'number' ? (
          <button
            key={idx}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="page-info" style={{ padding: '0 4px' }}>
            …
          </span>
        )
      )}

      <button
        className="page-btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next →
      </button>

      <span className="page-info">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
