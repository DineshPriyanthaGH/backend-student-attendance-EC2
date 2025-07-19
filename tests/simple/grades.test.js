const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../../models/db', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../../app');

describe('Grade Routes - Simple Tests', () => {
  const mockFirestore = require('../mocks/mockFirestore');

  beforeEach(() => {
    mockFirestore.reset();
  });

  describe('POST /grades', () => {
    it('should create a new grade with valid data', async () => {
      const gradeData = { name: 'Grade 1' };

      const response = await request(app)
        .post('/grades')
        .send(gradeData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(gradeData.name);
    });

    it('should return validation error for missing name', async () => {
      const response = await request(app)
        .post('/grades')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.length).toBeGreaterThan(0);
      expect(response.body.errors.some(error => error.msg === 'Name is required')).toBe(true);
    });

    it('should return validation error for empty name', async () => {
      const response = await request(app)
        .post('/grades')
        .send({ name: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors[0].msg).toBe('Name is required');
    });
  });

  describe('GET /grades', () => {
    it('should return empty array when no grades exist', async () => {
      const response = await request(app)
        .get('/grades')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all grades', async () => {
      // Create test grades directly using mock
      const gradeCollection = mockFirestore.collection('grades');
      await gradeCollection.add({ name: 'Grade 1' });
      await gradeCollection.add({ name: 'Grade 2' });

      const response = await request(app)
        .get('/grades')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[1]).toHaveProperty('id');
      expect(response.body[1]).toHaveProperty('name');
    });
  });

  describe('PUT /grades/:id', () => {
    it('should update an existing grade', async () => {
      // Create a test grade
      const gradeCollection = mockFirestore.collection('grades');
      const grade = await gradeCollection.add({ name: 'Original Grade' });
      const updateData = { name: 'Updated Grade' };

      const response = await request(app)
        .put(`/grades/${grade.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(grade.id);
      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /grades/:id', () => {
    it('should delete an existing grade', async () => {
      // Create a test grade
      const gradeCollection = mockFirestore.collection('grades');
      const grade = await gradeCollection.add({ name: 'Test Grade' });

      await request(app)
        .delete(`/grades/${grade.id}`)
        .expect(204);
    });
  });
});
