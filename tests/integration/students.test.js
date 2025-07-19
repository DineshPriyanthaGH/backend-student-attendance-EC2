const request = require('supertest');
const app = require('../../app');
require('../setup');

describe('Student Routes Integration Tests', () => {
  let testGrade, testClass;

  beforeEach(async () => {
    // Create test grade and class for use in student tests
    testGrade = await createTestGrade('Test Grade');
    testClass = await createTestClass('Test Class', testGrade.id);
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
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Name is required',
          path: 'name'
        })
      );
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
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Class ID is required',
          path: 'classId'
        })
      );
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
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Grade ID is required',
          path: 'gradeId'
        })
      );
    });

    it('should return validation error for empty name', async () => {
      const response = await request(app)
        .post('/students')
        .send({
          name: '',
          classId: testClass.id,
          gradeId: testGrade.id
        })
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Name is required');
    });

    it('should return validation error for name too long', async () => {
      const longName = 'a'.repeat(101); // 101 characters
      
      const response = await request(app)
        .post('/students')
        .send({
          name: longName,
          classId: testClass.id,
          gradeId: testGrade.id
        })
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Name must be between 1 and 100 characters'
        })
      );
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

    it('should return conflict error for duplicate student in same class', async () => {
      const studentData = {
        name: 'John Doe',
        classId: testClass.id,
        gradeId: testGrade.id
      };
      
      // Create first student
      await request(app)
        .post('/students')
        .send(studentData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/students')
        .send(studentData)
        .expect(409);

      expect(response.body.error).toBe('Student exists in class.');
    });

    it('should allow duplicate student names in different classes', async () => {
      const secondClass = await createTestClass('Class B', testGrade.id);
      
      const studentData1 = {
        name: 'John Doe',
        classId: testClass.id,
        gradeId: testGrade.id
      };
      const studentData2 = {
        name: 'John Doe',
        classId: secondClass.id,
        gradeId: testGrade.id
      };

      await request(app)
        .post('/students')
        .send(studentData1)
        .expect(201);

      await request(app)
        .post('/students')
        .send(studentData2)
        .expect(201);
    });

    it('should trim whitespace from student name', async () => {
      const studentData = {
        name: '  John Doe  ',
        classId: testClass.id,
        gradeId: testGrade.id
      };

      const response = await request(app)
        .post('/students')
        .send(studentData)
        .expect(201);

      expect(response.body.name).toBe('John Doe');
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
      await createTestStudent('John Doe', testClass.id, testGrade.id);
      await createTestStudent('Jane Smith', testClass.id, testGrade.id);

      const response = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('classId', testClass.id);
      expect(response.body[0]).toHaveProperty('gradeId', testGrade.id);
    });

    it('should return validation error for empty classId', async () => {
      await request(app)
        .get('/students/class/')
        .expect(404); // Express returns 404 for malformed routes
    });

    it('should return only students for the specified class', async () => {
      const secondClass = await createTestClass('Class B', testGrade.id);
      
      await createTestStudent('John Doe', testClass.id, testGrade.id);
      await createTestStudent('Jane Smith', secondClass.id, testGrade.id);

      const response = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].classId).toBe(testClass.id);
      expect(response.body[0].name).toBe('John Doe');
    });
  });

  describe('PUT /students/:id', () => {
    it('should update an existing student', async () => {
      const testStudent = await createTestStudent('Original Name', testClass.id, testGrade.id);
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(testStudent.id);
      expect(response.body.name).toBe(updateData.name);
    });

    it('should return validation error for missing name in update', async () => {
      const testStudent = await createTestStudent('Test Student', testClass.id, testGrade.id);

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    it('should return validation error for empty name in update', async () => {
      const testStudent = await createTestStudent('Test Student', testClass.id, testGrade.id);

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send({ name: '' })
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Name is required');
    });

    it('should return validation error for name too long in update', async () => {
      const testStudent = await createTestStudent('Test Student', testClass.id, testGrade.id);
      const longName = 'a'.repeat(101);

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send({ name: longName })
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: 'Name must be between 1 and 100 characters'
        })
      );
    });

    it('should trim whitespace when updating student name', async () => {
      const testStudent = await createTestStudent('Test Student', testClass.id, testGrade.id);
      const updateData = { name: '  Updated Name  ' };

      const response = await request(app)
        .put(`/students/${testStudent.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
    });
  });

  describe('DELETE /students/:id', () => {
    it('should delete an existing student', async () => {
      const testStudent = await createTestStudent('Test Student', testClass.id, testGrade.id);

      await request(app)
        .delete(`/students/${testStudent.id}`)
        .expect(204);
    });

    it('should return validation error for empty ID', async () => {
      await request(app)
        .delete('/students/')
        .expect(404); // Express returns 404 for malformed routes
    });
  });
});
