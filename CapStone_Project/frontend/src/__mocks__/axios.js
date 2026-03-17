const mockAxios = {
  create: jest.fn(function() { return mockAxios; }),
  get:     jest.fn(),
  post:    jest.fn(),
  put:     jest.fn(),
  delete:  jest.fn(),
  patch:   jest.fn(),
  interceptors: {
    request:  { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: { headers: { common: {} } },
};

module.exports = mockAxios;
module.exports.default = mockAxios;