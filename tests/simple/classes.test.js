const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../../models/db', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../../app');

describe('Class Routes - Simple Tests', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  let testGrade;

  beforeEach(async () => {
    mockFirestore.reset();
    // Create a test grade for use in class tests
    const gradeCollection = mockFirestore.collection('grades');
    testGrade = await gradeCollection.add({ name: 'Test Grade' });
  });

  describe('POST /classes', () => {
    it('should create a new class with valid data', async () => {
      const classData = { 
        name: 'Class A',
        gradeId: testGrade.id 
      };

      const response = await request(app)
        .post('/classes')
        .send(classData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(classData.name);
      expect(response.body.gradeId).toBe(classData.gradeId);
    });

    it('should return validation error for missing name', async () => {
      const response = await request(app)
        .post('/classes')
        .send({ gradeId: testGrade.id })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.some(error => error.msg === 'Name is required')).toBe(true);
    });

    it('should return validation error for missing gradeId', async () => {
      const response = await request(app)
        .post('/classes')
        .send({ name: 'Class A' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.some(error => error.msg === 'Grade ID is required')).toBe(true);
    });

    it('should return error for non-existent grade', async () => {
      const response = await request(app)
        .post('/classes')
        .send({ 
          name: 'Class A',
          gradeId: 'non-existent-grade'
        })
        .expect(404);

      expect(response.body.error).toBe('Grade not found.');
    });
  });

  describe('GET /classes/grade/:gradeId', () => {
    it('should return empty array when no classes exist for grade', async () => {
      const response = await request(app)
        .get(`/classes/grade/${testGrade.id}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all classes for a specific grade', async () => {
      // Create test classes
      const classCollection = mockFirestore.collection('classes');
      await classCollection.add({ name: 'Class A', gradeId: testGrade.id });
      await classCollection.add({ name: 'Class B', gradeId: testGrade.id });

      const response = await request(app)
        .get(`/classes/grade/${testGrade.id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('gradeId', testGrade.id);
    });
  });

  describe('PUT /classes/:id', () => {
    it('should update an existing class', async () => {
      const classCollection = mockFirestore.collection('classes');
      const testClass = await classCollection.add({ name: 'Original Class', gradeId: testGrade.id });
      const updateData = { name: 'Updated Class' };

      const response = await request(app)
        .put(`/classes/${testClass.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(testClass.id);
      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /classes/:id', () => {
    it('should delete an existing class', async () => {
      const classCollection = mockFirestore.collection('classes');
      const testClass = await classCollection.add({ name: 'Test Class', gradeId: testGrade.id });

      await request(app)
        .delete(`/classes/${testClass.id}`)
        .expect(204);
    });
  });
});
