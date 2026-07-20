import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
