const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../../models/db', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../../app');

describe('Grade Routes Integration Tests', () => {
  const mockFirestore = require('../mocks/mockFirestore');

  beforeEach(() => {
    // Reset mock database before each test
    mockFirestore.reset();
  });

  // Helper function to create test grade
  const createTestGrade = async (name = 'Test Grade') => {
    const gradeCollection = mockFirestore.collection('grades');
    return await gradeCollection.add({ name });
  };
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
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0]).toMatchObject({
        msg: 'Name is required',
        path: 'name'
      });
    });

    it('should return validation error for empty name', async () => {
      const response = await request(app)
        .post('/grades')
        .send({ name: '' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors[0].msg).toBe('Name is required');
    });

    it('should return validation error for name too long', async () => {
      const longName = 'a'.repeat(51); // 51 characters
      
      const response = await request(app)
        .post('/grades')
        .send({ name: longName })
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Name must be between 1 and 50 characters');
    });

    it('should return conflict error for duplicate grade name', async () => {
      const gradeData = { name: 'Grade 1' };
      
      // Create first grade
      await request(app)
        .post('/grades')
        .send(gradeData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/grades')
        .send(gradeData)
        .expect(409);

      expect(response.body.error).toBe('Grade exists.');
    });

    it('should trim whitespace from grade name', async () => {
      const gradeData = { name: '  Grade 1  ' };

      const response = await request(app)
        .post('/grades')
        .send(gradeData)
        .expect(201);

      expect(response.body.name).toBe('Grade 1');
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
      // Create test grades
      await createTestGrade('Grade 1');
      await createTestGrade('Grade 2');

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
      const grade = await createTestGrade('Original Grade');
      const updateData = { name: 'Updated Grade' };

      const response = await request(app)
        .put(`/grades/${grade.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(grade.id);
      expect(response.body.name).toBe(updateData.name);
    });

    it('should return validation error for invalid ID', async () => {
      const response = await request(app)
        .put('/grades/')
        .send({ name: 'Updated Grade' })
        .expect(404); // Express returns 404 for malformed routes
    });

    it('should return validation error for missing name in update', async () => {
      const grade = await createTestGrade();

      const response = await request(app)
        .put(`/grades/${grade.id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should trim whitespace when updating grade name', async () => {
      const grade = await createTestGrade();
      const updateData = { name: '  Updated Grade  ' };

      const response = await request(app)
        .put(`/grades/${grade.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Grade');
    });
  });

  describe('DELETE /grades/:id', () => {
    it('should delete an existing grade', async () => {
      const grade = await createTestGrade();

      await request(app)
        .delete(`/grades/${grade.id}`)
        .expect(204);
    });

    it('should return validation error for empty ID', async () => {
      await request(app)
        .delete('/grades/')
        .expect(404); // Express returns 404 for malformed routes
    });
  });
});
