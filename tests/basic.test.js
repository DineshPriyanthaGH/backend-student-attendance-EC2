const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../models/db', () => {
  const mockFirestore = require('./mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../app');

describe('Basic App Tests', () => {
  beforeEach(() => {
    // Reset mock database before each test
    const mockFirestore = require('./mocks/mockFirestore');
    mockFirestore.reset();
  });

  it('should respond to health check', async () => {
    // Test a simple GET request to ensure the app is working
    const response = await request(app)
      .get('/grades')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should handle POST with validation', async () => {
    const response = await request(app)
      .post('/grades')
      .send({ name: 'Test Grade' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Grade');
  });
});
