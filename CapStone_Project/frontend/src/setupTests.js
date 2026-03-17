import "@testing-library/jest-dom";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning:") ||
       args[0].includes("ReactDOM.render") ||
       args[0].includes("act(") ||
       args[0].includes("not wrapped in act"))
    ) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });

const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key) => store[key] ?? null,
    setItem:    (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

window.HTMLMediaElement.prototype.play  = jest.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = jest.fn();
window.HTMLMediaElement.prototype.load  = jest.fn();