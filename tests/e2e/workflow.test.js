const request = require('supertest');
const app = require('../../app');
require('../setup');

describe('End-to-End Workflow Tests', () => {
  describe('Complete School Management Workflow', () => {
    it('should create grade, class, and student in sequence', async () => {
      // Step 1: Create a grade
      const gradeResponse = await request(app)
        .post('/grades')
        .send({ name: 'Grade 5' })
        .expect(201);

      expect(gradeResponse.body).toHaveProperty('id');
      expect(gradeResponse.body.name).toBe('Grade 5');
      const gradeId = gradeResponse.body.id;

      // Step 2: Create a class in the grade
      const classResponse = await request(app)
        .post('/classes')
        .send({ 
          name: 'Class A',
          gradeId: gradeId 
        })
        .expect(201);

      expect(classResponse.body).toHaveProperty('id');
      expect(classResponse.body.name).toBe('Class A');
      expect(classResponse.body.gradeId).toBe(gradeId);
      const classId = classResponse.body.id;

      // Step 3: Create a student in the class
      const studentResponse = await request(app)
        .post('/students')
        .send({
          name: 'Alice Johnson',
          classId: classId,
          gradeId: gradeId
        })
        .expect(201);

      expect(studentResponse.body).toHaveProperty('id');
      expect(studentResponse.body.name).toBe('Alice Johnson');
      expect(studentResponse.body.classId).toBe(classId);
      expect(studentResponse.body.gradeId).toBe(gradeId);

      // Step 4: Verify relationships - get classes by grade
      const classesResponse = await request(app)
        .get(`/classes/grade/${gradeId}`)
        .expect(200);

      expect(classesResponse.body).toHaveLength(1);
      expect(classesResponse.body[0].id).toBe(classId);

      // Step 5: Verify relationships - get students by class
      const studentsResponse = await request(app)
        .get(`/students/class/${classId}`)
        .expect(200);

      expect(studentsResponse.body).toHaveLength(1);
      expect(studentsResponse.body[0].id).toBe(studentResponse.body.id);
      expect(studentsResponse.body[0].name).toBe('Alice Johnson');
    });

    it('should handle multiple grades, classes, and students', async () => {
      // Create two grades
      const grade1Response = await request(app)
        .post('/grades')
        .send({ name: 'Grade 1' })
        .expect(201);

      const grade2Response = await request(app)
        .post('/grades')
        .send({ name: 'Grade 2' })
        .expect(201);

      // Create classes for each grade
      const class1AResponse = await request(app)
        .post('/classes')
        .send({ name: 'Class A', gradeId: grade1Response.body.id })
        .expect(201);

      const class1BResponse = await request(app)
        .post('/classes')
        .send({ name: 'Class B', gradeId: grade1Response.body.id })
        .expect(201);

      const class2AResponse = await request(app)
        .post('/classes')
        .send({ name: 'Class A', gradeId: grade2Response.body.id })
        .expect(201);

      // Create students in different classes
      await request(app)
        .post('/students')
        .send({
          name: 'John Doe',
          classId: class1AResponse.body.id,
          gradeId: grade1Response.body.id
        })
        .expect(201);

      await request(app)
        .post('/students')
        .send({
          name: 'Jane Smith',
          classId: class1AResponse.body.id,
          gradeId: grade1Response.body.id
        })
        .expect(201);

      await request(app)
        .post('/students')
        .send({
          name: 'Bob Johnson',
          classId: class1BResponse.body.id,
          gradeId: grade1Response.body.id
        })
        .expect(201);

      await request(app)
        .post('/students')
        .send({
          name: 'Alice Brown',
          classId: class2AResponse.body.id,
          gradeId: grade2Response.body.id
        })
        .expect(201);

      // Verify grade 1 has 2 classes
      const grade1ClassesResponse = await request(app)
        .get(`/classes/grade/${grade1Response.body.id}`)
        .expect(200);

      expect(grade1ClassesResponse.body).toHaveLength(2);

      // Verify grade 2 has 1 class
      const grade2ClassesResponse = await request(app)
        .get(`/classes/grade/${grade2Response.body.id}`)
        .expect(200);

      expect(grade2ClassesResponse.body).toHaveLength(1);

      // Verify class 1A has 2 students
      const class1AStudentsResponse = await request(app)
        .get(`/students/class/${class1AResponse.body.id}`)
        .expect(200);

      expect(class1AStudentsResponse.body).toHaveLength(2);

      // Verify class 1B has 1 student
      const class1BStudentsResponse = await request(app)
        .get(`/students/class/${class1BResponse.body.id}`)
        .expect(200);

      expect(class1BStudentsResponse.body).toHaveLength(1);

      // Verify class 2A has 1 student
      const class2AStudentsResponse = await request(app)
        .get(`/students/class/${class2AResponse.body.id}`)
        .expect(200);

      expect(class2AStudentsResponse.body).toHaveLength(1);
    });

    it('should update entities and maintain relationships', async () => {
      // Create initial data
      const grade = await createTestGrade('Original Grade');
      const testClass = await createTestClass('Original Class', grade.id);
      const student = await createTestStudent('Original Student', testClass.id, grade.id);

      // Update grade name
      const updatedGradeResponse = await request(app)
        .put(`/grades/${grade.id}`)
        .send({ name: 'Updated Grade' })
        .expect(200);

      expect(updatedGradeResponse.body.name).toBe('Updated Grade');

      // Update class name
      const updatedClassResponse = await request(app)
        .put(`/classes/${testClass.id}`)
        .send({ name: 'Updated Class' })
        .expect(200);

      expect(updatedClassResponse.body.name).toBe('Updated Class');

      // Update student name
      const updatedStudentResponse = await request(app)
        .put(`/students/${student.id}`)
        .send({ name: 'Updated Student' })
        .expect(200);

      expect(updatedStudentResponse.body.name).toBe('Updated Student');

      // Verify relationships still work after updates
      const classesResponse = await request(app)
        .get(`/classes/grade/${grade.id}`)
        .expect(200);

      expect(classesResponse.body).toHaveLength(1);
      expect(classesResponse.body[0].name).toBe('Updated Class');

      const studentsResponse = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(studentsResponse.body).toHaveLength(1);
      expect(studentsResponse.body[0].name).toBe('Updated Student');
    });

    it('should delete entities properly', async () => {
      // Create test data
      const grade = await createTestGrade('Test Grade');
      const testClass = await createTestClass('Test Class', grade.id);
      const student = await createTestStudent('Test Student', testClass.id, grade.id);

      // Delete student
      await request(app)
        .delete(`/students/${student.id}`)
        .expect(204);

      // Verify student is deleted
      const studentsResponse = await request(app)
        .get(`/students/class/${testClass.id}`)
        .expect(200);

      expect(studentsResponse.body).toHaveLength(0);

      // Delete class
      await request(app)
        .delete(`/classes/${testClass.id}`)
        .expect(204);

      // Verify class is deleted
      const classesResponse = await request(app)
        .get(`/classes/grade/${grade.id}`)
        .expect(200);

      expect(classesResponse.body).toHaveLength(0);

      // Delete grade
      await request(app)
        .delete(`/grades/${grade.id}`)
        .expect(204);

      // Verify grade is deleted by checking all grades
      const gradesResponse = await request(app)
        .get('/grades')
        .expect(200);

      expect(gradesResponse.body.find(g => g.id === grade.id)).toBeUndefined();
    });
  });

  describe('Error Handling Workflow', () => {
    it('should prevent creation of entities with invalid references', async () => {
      // Try to create class with non-existent grade
      await request(app)
        .post('/classes')
        .send({
          name: 'Test Class',
          gradeId: 'non-existent-grade'
        })
        .expect(404);

      // Try to create student with non-existent class
      await request(app)
        .post('/students')
        .send({
          name: 'Test Student',
          classId: 'non-existent-class',
          gradeId: 'non-existent-grade'
        })
        .expect(404);
    });

    it('should handle validation errors in complex scenarios', async () => {
      // Try to create multiple entities with validation errors
      const responses = await Promise.all([
        request(app).post('/grades').send({ name: '' }),
        request(app).post('/classes').send({ name: 'Valid Class' }), // Missing gradeId
        request(app).post('/students').send({ name: 'Valid Student' }) // Missing classId and gradeId
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Validation failed');
      });
    });
  });
});
