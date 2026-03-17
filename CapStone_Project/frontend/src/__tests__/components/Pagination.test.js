import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../components/common/Pagination";

const defaultProps = {
  page:       1,
  totalPages: 3,
  totalItems: 25,
  startIndex: 1,
  endIndex:   10,
  hasNext:    true,
  hasPrev:    false,
  next:       jest.fn(),
  prev:       jest.fn(),
  goTo:       jest.fn(),
};

describe("Pagination component", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders nothing when totalPages is 1", () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  test("renders nothing when totalPages is 0", () => {
    const { container } = render(<Pagination {...defaultProps} totalPages={0} />);
    expect(container.firstChild).toBeNull();
  });

  test("shows the items range text", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText(/showing 1.10 of 25/i)).toBeInTheDocument();
  });

  test("renders page number buttons", () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  test("prev button is disabled on the first page", () => {
    render(<Pagination {...defaultProps} hasPrev={false} />);
    const prevBtn = screen.getByRole("button", { name: "‹" });
    expect(prevBtn).toBeDisabled();
  });

  test("next button is disabled on the last page", () => {
    render(<Pagination {...defaultProps} page={3} hasNext={false} hasPrev={true} />);
    const nextBtn = screen.getByRole("button", { name: "›" });
    expect(nextBtn).toBeDisabled();
  });

  test("clicking next calls the next() prop", () => {
    const next = jest.fn();
    render(<Pagination {...defaultProps} next={next} />);
    fireEvent.click(screen.getByRole("button", { name: "›" }));
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("clicking prev calls the prev() prop", () => {
    const prev = jest.fn();
    render(<Pagination {...defaultProps} hasPrev={true} page={2} prev={prev} />);
    fireEvent.click(screen.getByRole("button", { name: "‹" }));
    expect(prev).toHaveBeenCalledTimes(1);
  });

  test("clicking a page number calls goTo() with that number", () => {
    const goTo = jest.fn();
    render(<Pagination {...defaultProps} goTo={goTo} />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(goTo).toHaveBeenCalledWith(2);
  });

  test("clicking the current page button calls goTo() with page 1", () => {
    const goTo = jest.fn();
    render(<Pagination {...defaultProps} goTo={goTo} />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(goTo).toHaveBeenCalledWith(1);
  });
});