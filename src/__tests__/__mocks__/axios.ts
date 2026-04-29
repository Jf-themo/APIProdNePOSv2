const mockAxios: any = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => mockAxios)
};

export default mockAxios;
export const axios = mockAxios;
export const Axios = mockAxios;