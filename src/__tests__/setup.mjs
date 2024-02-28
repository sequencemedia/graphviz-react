global.ResizeObserver = jest.fn().mockImplementation(() => {
  return {
    observe: jest.fn(),
    unobserve: jest.fn()
  }
})
