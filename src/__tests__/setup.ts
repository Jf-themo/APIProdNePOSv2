process.env.NODE_ENV = "test";
process.env.CLIENT_ID = "test_client_id";
process.env.CLIENT_SECRET = "test_client_secret";
process.env.USER = "test_user";
process.env.PASSWORD = "test_password";
process.env.FACTUS_ENV = "sandbox";

global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};