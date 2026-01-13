// Global test setup
// This file runs before each test file

// Set NODE_ENV to test to prevent server from listening
process.env.NODE_ENV = 'test';

// Increase timeout for integration tests
jest.setTimeout(10000);
