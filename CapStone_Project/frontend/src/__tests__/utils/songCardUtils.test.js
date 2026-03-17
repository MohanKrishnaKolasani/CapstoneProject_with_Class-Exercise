function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d)) return "N/A";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return null;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

describe("SongCard – formatDate()", () => {
  test("returns N/A for null input", () => {
    expect(formatDate(null)).toBe("N/A");
  });

  test("returns N/A for undefined input", () => {
    expect(formatDate(undefined)).toBe("N/A");
  });

  test("returns N/A for empty string", () => {
    expect(formatDate("")).toBe("N/A");
  });

  test("returns N/A for completely invalid date string", () => {
    expect(formatDate("not-a-date")).toBe("N/A");
  });

  test("returns a formatted string for a valid ISO date string", () => {
    const result = formatDate("2023-06-15T00:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result).not.toBe("N/A");
    expect(result).toContain("2023");
  });

  test("returns a formatted string for a simple date string", () => {
    const result = formatDate("2020-01-01");
    expect(result).not.toBe("N/A");
  });
});

describe("SongCard – duration formatter", () => {
  test("formats 0 seconds correctly", () => {
    expect(formatDuration(0)).toBe("0m 0s");
  });

  test("formats exactly 60 seconds as 1m 0s", () => {
    expect(formatDuration(60)).toBe("1m 0s");
  });

  test("formats 90 seconds as 1m 30s", () => {
    expect(formatDuration(90)).toBe("1m 30s");
  });

  test("formats 3 minutes 45 seconds correctly", () => {
    expect(formatDuration(225)).toBe("3m 45s");
  });

  test("returns null for undefined duration", () => {
    expect(formatDuration(undefined)).toBeNull();
  });
});