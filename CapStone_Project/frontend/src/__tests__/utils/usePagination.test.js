import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../../hooks/usePagination";

const makeItems = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1 }));

describe("usePagination", () => {
  describe("initial state", () => {
    test("starts on page 1", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.page).toBe(1);
    });

    test("calculates totalPages correctly for exact multiple", () => {
      const { result } = renderHook(() => usePagination(makeItems(20), 10));
      expect(result.current.totalPages).toBe(2);
    });

    test("calculates totalPages correctly when items don't divide evenly", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.totalPages).toBe(3);
    });

    test("totalPages is 1 for an empty array", () => {
      const { result } = renderHook(() => usePagination([], 10));
      expect(result.current.totalPages).toBe(1);
    });

    test("paged returns only the first pageSize items", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.paged).toHaveLength(10);
      expect(result.current.paged[0].id).toBe(1);
      expect(result.current.paged[9].id).toBe(10);
    });

    test("totalItems reflects the full array length", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.totalItems).toBe(25);
    });
  });

  describe("hasPrev / hasNext flags", () => {
    test("hasPrev is false on page 1", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.hasPrev).toBe(false);
    });

    test("hasNext is true when not on the last page", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.hasNext).toBe(true);
    });

    test("hasNext is false on the last page", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.goTo(3));
      expect(result.current.hasNext).toBe(false);
    });

    test("hasPrev is true when past the first page", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.next());
      expect(result.current.hasPrev).toBe(true);
    });
  });

  describe("navigation", () => {
    test("next() advances to page 2", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.next());
      expect(result.current.page).toBe(2);
    });

    test("next() shows correct items on page 2", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.next());
      expect(result.current.paged[0].id).toBe(11);
      expect(result.current.paged[9].id).toBe(20);
    });

    test("prev() moves back from page 2 to page 1", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.page).toBe(1);
    });

    test("next() does not go beyond the last page", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.goTo(3));
      act(() => result.current.next());
      expect(result.current.page).toBe(3);
    });

    test("prev() does not go below page 1", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.prev());
      expect(result.current.page).toBe(1);
    });

    test("goTo() jumps to a specific page", () => {
      const { result } = renderHook(() => usePagination(makeItems(50), 10));
      act(() => result.current.goTo(4));
      expect(result.current.page).toBe(4);
    });

    test("last page has the correct remaining items", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.goTo(3));
      expect(result.current.paged).toHaveLength(5);
    });
  });

  describe("startIndex and endIndex", () => {
    test("startIndex is 1 on the first page", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.startIndex).toBe(1);
    });

    test("endIndex is 10 on the first page with pageSize 10", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      expect(result.current.endIndex).toBe(10);
    });

    test("startIndex is 11 on page 2", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.next());
      expect(result.current.startIndex).toBe(11);
    });

    test("endIndex on the last page equals total items", () => {
      const { result } = renderHook(() => usePagination(makeItems(25), 10));
      act(() => result.current.goTo(3));
      expect(result.current.endIndex).toBe(25);
    });
  });

  describe("page resets when items change", () => {
    test("resets to page 1 when the items array shrinks", () => {
      let items = makeItems(25);
      const { result, rerender } = renderHook(
        ({ items, pageSize }) => usePagination(items, pageSize),
        { initialProps: { items, pageSize: 10 } }
      );
      act(() => result.current.next());
      expect(result.current.page).toBe(2);

      rerender({ items: makeItems(5), pageSize: 10 });
      expect(result.current.page).toBe(1);
    });
  });
});