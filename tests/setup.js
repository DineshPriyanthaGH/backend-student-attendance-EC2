const mockFirestore = require('./mocks/mockFirestore');

// Mock the Firebase admin SDK
jest.mock('../models/db', () => mockFirestore);

// Global test setup
beforeEach(() => {
  // Reset mock database before each test
  mockFirestore.reset();
});

// Global test utilities
global.createTestGrade = async (name = 'Test Grade') => {
  const gradeCollection = mockFirestore.collection('grades');
  return await gradeCollection.add({ name });
};

global.createTestClass = async (name = 'Test Class', gradeId) => {
  if (!gradeId) {
    const grade = await global.createTestGrade();
    gradeId = grade.id;
  }
  const classCollection = mockFirestore.collection('classes');
  return await classCollection.add({ name, gradeId });
};

global.createTestStudent = async (name = 'Test Student', classId, gradeId) => {
  if (!gradeId) {
    const grade = await global.createTestGrade();
    gradeId = grade.id;
  }
  if (!classId) {
    const testClass = await global.createTestClass('Test Class', gradeId);
    classId = testClass.id;
  }
  const studentCollection = mockFirestore.collection('students');
  return await studentCollection.add({ name, classId, gradeId });
};
