import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
  query?: string;
}

export default function Pagination({
  page,
  totalPages,
  basePath,
  query,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="pagination__item">
          Previous
        </Link>
      ) : (
        <span className="pagination__item pagination__item--disabled">
          Previous
        </span>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={hrefFor(n)}
          className={`pagination__item ${
            n === page ? "pagination__item--active" : ""
          }`}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </Link>
      ))}
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="pagination__item">
          Next
        </Link>
      ) : (
        <span className="pagination__item pagination__item--disabled">
          Next
        </span>
      )}
    </nav>
  );
}
