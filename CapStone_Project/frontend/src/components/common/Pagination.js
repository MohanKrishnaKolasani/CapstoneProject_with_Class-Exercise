import React from "react";

const BRAND_COLOR = "#7e0404";

function Pagination(
  { page, totalPages, totalItems, startIndex, endIndex,
    hasNext, hasPrev, next, prev, goTo }
) {

  if (totalPages <= 1)
    return null;

  const pages = [];
  const add = (n) => { if (n >= 1 && n <= totalPages && !pages.includes(n)) pages.push(n); };
  add(1);
  add(page - 1); add(page); add(page + 1);
  add(totalPages);
  pages.sort((a, b) => a - b);

  const withGaps = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) withGaps.push("...");
    withGaps.push(pages[i]);
  }

  const btnBase = {
    border: "none", borderRadius: "6px", padding: "5px 11px",
    fontSize: "0.8rem", fontWeight: "500", cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    lineHeight: 1.4,
  };

  const activeBtn  = { ...btnBase, background: BRAND_COLOR, color: "#fff" };
  const normalBtn  = { ...btnBase, background: "#f0f0f0",   color: "#444" };
  const disabledBtn = { ...btnBase, background: "#f5f5f5",  color: "#bbb", cursor: "default" };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>

      <span style={{ fontSize: "0.78rem", color: "#888" }}>
        Showing {startIndex}–{endIndex} of {totalItems}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>

        <button style={hasPrev ? normalBtn : disabledBtn} disabled={!hasPrev} onClick={prev}
          onMouseEnter={e => { if (hasPrev) e.currentTarget.style.background = "#e0e0e0"; }}
          onMouseLeave={e => { if (hasPrev) e.currentTarget.style.background = "#f0f0f0"; }}>
          ‹
        </button>

        {withGaps.map((p, i) =>
          p === "..." ? (
            <span key={`gap-${i}`} style={{ padding: "5px 4px", fontSize: "0.8rem", color: "#aaa" }}>…</span>
          ) : (
            <button key={p} style={p === page ? activeBtn : normalBtn} onClick={() => goTo(p)}
              onMouseEnter={e => { if (p !== page) e.currentTarget.style.background = "#e0e0e0"; }}
              onMouseLeave={e => { if (p !== page) e.currentTarget.style.background = "#f0f0f0"; }}>
              {p}
            </button>
          )
        )}

        <button style={hasNext ? normalBtn : disabledBtn} disabled={!hasNext} onClick={next}
          onMouseEnter={e => { if (hasNext) e.currentTarget.style.background = "#e0e0e0"; }}
          onMouseLeave={e => { if (hasNext) e.currentTarget.style.background = "#f0f0f0"; }}>
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;
