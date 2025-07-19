const request = require('supertest');
const app = require('../../app');
require('../setup');

describe('Class Routes Integration Tests', () => {
  let testGrade;

  beforeEach(async () => {
    // Create a test grade for use in class tests
    testGrade = await createTestGrade('Test Grade');
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
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Name is required',
          path: 'name'
        })
      );
    });

    it('should return validation error for missing gradeId', async () => {
      const response = await request(app)
        .post('/classes')
        .send({ name: 'Class A' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Grade ID is required',
          path: 'gradeId'
        })
      );
    });

    it('should return validation error for empty name', async () => {
      const response = await request(app)
        .post('/classes')
        .send({ name: '', gradeId: testGrade.id })
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Name is required');
    });

    it('should return validation error for name too long', async () => {
      const longName = 'a'.repeat(51);
      
      const response = await request(app)
        .post('/classes')
        .send({ name: longName, gradeId: testGrade.id })
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Name must be between 1 and 50 characters'
        })
      );
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

    it('should return conflict error for duplicate class in same grade', async () => {
      const classData = { 
        name: 'Class A',
        gradeId: testGrade.id 
      };
      
      // Create first class
      await request(app)
        .post('/classes')
        .send(classData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/classes')
        .send(classData)
        .expect(409);

      expect(response.body.error).toBe('Class exists in grade.');
    });

    it('should allow duplicate class names in different grades', async () => {
      const secondGrade = await createTestGrade('Grade 2');
      
      const classData1 = { name: 'Class A', gradeId: testGrade.id };
      const classData2 = { name: 'Class A', gradeId: secondGrade.id };

      await request(app)
        .post('/classes')
        .send(classData1)
        .expect(201);

      await request(app)
        .post('/classes')
        .send(classData2)
        .expect(201);
    });

    it('should trim whitespace from class name', async () => {
      const classData = { 
        name: '  Class A  ',
        gradeId: testGrade.id 
      };

      const response = await request(app)
        .post('/classes')
        .send(classData)
        .expect(201);

      expect(response.body.name).toBe('Class A');
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
      await createTestClass('Class A', testGrade.id);
      await createTestClass('Class B', testGrade.id);

      const response = await request(app)
        .get(`/classes/grade/${testGrade.id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('gradeId', testGrade.id);
    });

    it('should return validation error for empty gradeId', async () => {
      await request(app)
        .get('/classes/grade/')
        .expect(404); // Express returns 404 for malformed routes
    });

    it('should return only classes for the specified grade', async () => {
      const secondGrade = await createTestGrade('Grade 2');
      
      await createTestClass('Class A', testGrade.id);
      await createTestClass('Class B', secondGrade.id);

      const response = await request(app)
        .get(`/classes/grade/${testGrade.id}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].gradeId).toBe(testGrade.id);
    });
  });

  describe('PUT /classes/:id', () => {
    it('should update an existing class', async () => {
      const testClass = await createTestClass('Original Class', testGrade.id);
      const updateData = { name: 'Updated Class' };

      const response = await request(app)
        .put(`/classes/${testClass.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(testClass.id);
      expect(response.body.name).toBe(updateData.name);
    });

    it('should return validation error for missing name in update', async () => {
      const testClass = await createTestClass('Test Class', testGrade.id);

      const response = await request(app)
        .put(`/classes/${testClass.id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should trim whitespace when updating class name', async () => {
      const testClass = await createTestClass('Test Class', testGrade.id);
      const updateData = { name: '  Updated Class  ' };

      const response = await request(app)
        .put(`/classes/${testClass.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Class');
    });
  });

  describe('DELETE /classes/:id', () => {
    it('should delete an existing class', async () => {
      const testClass = await createTestClass('Test Class', testGrade.id);

      await request(app)
        .delete(`/classes/${testClass.id}`)
        .expect(204);
    });

    it('should return validation error for empty ID', async () => {
      await request(app)
        .delete('/classes/')
        .expect(404); // Express returns 404 for malformed routes
    });
  });
});
