const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../../models/db', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../../app');

describe('Student Routes - Simple Tests', () => {
  const mockFirestore = require('../mocks/mockFirestore');
  let testGrade, testClass;

  beforeEach(async () => {
    mockFirestore.reset();
    // Create test grade and class for use in student tests
    const gradeCollection = mockFirestore.collection('grades');
    testGrade = await gradeCollection.add({ name: 'Test Grade' });
    
    const classCollection = mockFirestore.collection('classes');
    testClass = await classCollection.add({ name: 'Test Class', gradeId: testGrade.id });
  });

  describe('POST /students', () => {
    it('should create a new student with valid data', async () => {
      const studentData = {
        name: 'John Doe',
        classId: testClass.id,
        gradeId: testGrade.id
      };

      const response = await request(app)
        .post('/students')
        .send(studentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(studentData.name);
      expect(response.body.classId).toBe(studentData.classId);
      expect(response.body.gradeId).toBe(studentData.gradeId);
    });

    it('should return validation error for missing name', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          classId: testClass.id,
          gradeId: testGrade.id
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.some(error => error.msg === 'Name is required')).toBe(true);
    });

    it('should return validation error for missing classId', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          name: 'John Doe',
          gradeId: testGrade.id
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.some(error => error.msg === 'Class ID is required')).toBe(true);
    });

    it('should return validation error for missing gradeId', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          name: 'John Doe',
          classId: testClass.id
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.errors.some(error => error.msg === 'Grade ID is required')).toBe(true);
    });

    it('should return error for non-existent grade', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          name: 'John Doe',
          classId: testClass.id,
          gradeId: 'non-existent-grade'
        })
        .expect(404);

      expect(response.body.error).toBe('Grade not found.');
    });

    it('should return error for non-existent class', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          name: 'John Doe',
          classId: 'non-existent-class',
          gradeId: testGrade.id
        })
        .expect(404);

      expect(response.body.error).toBe('Class not found.');
    });
  });

  describe('GET /students/class/:classId', () => {
    it('should return empty array when no students exist for class', async () => {
      const response = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return all students for a specific class', async () => {
      // Create test students
      const studentCollection = mockFirestore.collection('students');
      await studentCollection.add({ name: 'John Doe', classId: testClass.id, gradeId: testGrade.id });
      await studentCollection.add({ name: 'Jane Smith', classId: testClass.id, gradeId: testGrade.id });

      const response = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('classId', testClass.id);
      expect(response.body[0]).toHaveProperty('gradeId', testGrade.id);
    });
  });

  describe('PUT /students/:id', () => {
    it('should update an existing student', async () => {
      const studentCollection = mockFirestore.collection('students');
      const testStudent = await studentCollection.add({ 
        name: 'Original Name', 
        classId: testClass.id, 
        gradeId: testGrade.id 
      });
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(testStudent.id);
      expect(response.body.name).toBe(updateData.name);
    });
  });

  describe('DELETE /students/:id', () => {
    it('should delete an existing student', async () => {
      const studentCollection = mockFirestore.collection('students');
      const testStudent = await studentCollection.add({ 
        name: 'Test Student', 
        classId: testClass.id, 
        gradeId: testGrade.id 
      });

      await request(app)
        .delete(`/students/${testStudent.id}`)
        .expect(204);
    });
  });
});
