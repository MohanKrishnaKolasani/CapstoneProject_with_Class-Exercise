import { useState, useEffect, useMemo } from "react";

export const usePagination = (items = [], pageSize = 10) => {
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [items.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goTo   = (n) => setPage(Math.min(Math.max(1, n), totalPages));
  const next   = ()  => goTo(page + 1);
  const prev   = ()  => goTo(page - 1);

  return {
    paged,
    page,
    totalPages,
    totalItems: items.length,
    pageSize,
    goTo,
    next,
    prev,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    startIndex: (page - 1) * pageSize + 1,
    endIndex: Math.min(page * pageSize, items.length),
  };
};
