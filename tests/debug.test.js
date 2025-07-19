const request = require('supertest');

// Mock the database module before requiring the app
jest.mock('../models/db', () => {
  const mockFirestore = require('./mocks/mockFirestore');
  return mockFirestore;
});

const app = require('../app');

describe('Debug Tests', () => {
  const mockFirestore = require('./mocks/mockFirestore');

  beforeEach(() => {
    mockFirestore.reset();
  });

  it('should debug grade creation and class reference validation', async () => {
    // Create a grade first
    const gradeData = { name: 'Test Grade' };
    const gradeResponse = await request(app)
      .post('/grades')
      .send(gradeData)
      .expect(201);

    console.log('Grade created:', gradeResponse.body);

    // Now try to create a class
    const classData = {
      name: 'Test Class',
      gradeId: gradeResponse.body.id
    };

    console.log('Attempting to create class with data:', classData);

    // Check if the grade exists in our mock
    const gradeCollection = mockFirestore.collection('grades');
    const gradeDoc = gradeCollection.doc(gradeResponse.body.id);
    const gradeSnapshot = await gradeDoc.get();
    console.log('Grade exists check:', gradeSnapshot.exists);

    const classResponse = await request(app)
      .post('/classes')
      .send(classData);

    console.log('Class creation response status:', classResponse.status);
    console.log('Class creation response body:', classResponse.body);
  });
});
