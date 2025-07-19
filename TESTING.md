# Integration Testing Documentation

This document outlines the comprehensive testing strategy implemented for the School Attendance Management System backend.

## 🧪 Testing Framework

- **Test Runner**: Jest 30.0.4
- **HTTP Testing**: Supertest 7.1.3
- **Mocking**: Custom Firebase Firestore mock
- **Coverage**: Built-in Jest coverage reporting

## 📁 Test Structure

```
tests/
├── setup.js                 # Global test setup and utilities
├── mocks/
│   └── mockFirestore.js     # Firebase Firestore mock implementation
├── unit/
│   └── validation.test.js   # Unit tests for validation middleware
├── integration/
│   ├── grades.test.js       # Grade routes integration tests
│   ├── classes.test.js      # Class routes integration tests
│   └── students.test.js     # Student routes integration tests
└── e2e/
    └── workflow.test.js     # End-to-end workflow tests
```

## 🎯 Test Categories

### 1. Unit Tests (`tests/unit/`)
Tests individual components in isolation:
- **Validation Middleware**: Tests error handling and validation logic
- **Mock Dependencies**: All external dependencies are mocked

### 2. Integration Tests (`tests/integration/`)
Tests API endpoints with mocked database:
- **Grade Routes**: CRUD operations for grades
- **Class Routes**: CRUD operations for classes with grade relationships
- **Student Routes**: CRUD operations for students with class/grade relationships
- **Validation Testing**: Input validation for all endpoints

### 3. End-to-End Tests (`tests/e2e/`)
Tests complete workflows:
- **Full CRUD Workflows**: Creating grades → classes → students
- **Relationship Testing**: Verifying data consistency across entities
- **Error Scenarios**: Testing error handling in complex scenarios

## 🚀 Running Tests

### Using npm scripts:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Using the test runner:
```bash
# Run specific test types
node test-runner.js unit
node test-runner.js integration
node test-runner.js e2e
node test-runner.js all

# Run with coverage
node test-runner.js coverage
node test-runner.js coverage-unit
node test-runner.js coverage-integration

# Run in watch mode
node test-runner.js watch
```

## 📊 Coverage Goals

- **Minimum Coverage**: 70% for branches, functions, lines, and statements
- **Target Areas**: Controllers, Routes, Middleware
- **Reports**: Text, LCOV, and HTML formats

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`):
- **Environment**: Node.js
- **Setup**: Automatic mock setup before each test
- **Timeout**: 10 seconds per test
- **Coverage**: Comprehensive reporting with thresholds

### Mock Implementation:
- **Firebase Firestore**: Complete mock with collections, documents, and queries
- **Data Persistence**: In-memory storage for test duration
- **Reset**: Automatic cleanup between tests

## 📝 Test Coverage Areas

### Grade Endpoints
- ✅ POST /grades - Create grade with validation
- ✅ GET /grades - List all grades  
- ✅ PUT /grades/:id - Update grade with validation
- ✅ DELETE /grades/:id - Delete grade
- ✅ Validation errors and edge cases
- ✅ Duplicate prevention

### Class Endpoints  
- ✅ POST /classes - Create class with grade relationship
- ✅ GET /classes/grade/:gradeId - List classes by grade
- ✅ PUT /classes/:id - Update class with validation
- ✅ DELETE /classes/:id - Delete class
- ✅ Grade reference validation
- ✅ Duplicate prevention within grade

### Student Endpoints
- ✅ POST /students - Create student with class/grade relationships
- ✅ GET /students/class/:classId - List students by class
- ✅ PUT /students/:id - Update student with validation
- ✅ DELETE /students/:id - Delete student
- ✅ Class/Grade reference validation
- ✅ Duplicate prevention within class

### Validation Testing
- ✅ Required field validation
- ✅ Length limit validation
- ✅ Parameter validation
- ✅ Whitespace trimming
- ✅ Error message formatting
- ✅ HTTP status codes

### Error Handling
- ✅ 400 Bad Request for validation errors
- ✅ 404 Not Found for missing references
- ✅ 409 Conflict for duplicates
- ✅ Structured error responses

## 🎨 Test Utilities

### Global Helper Functions:
```javascript
// Create test entities quickly
await createTestGrade('Grade Name');
await createTestClass('Class Name', gradeId);
await createTestStudent('Student Name', classId, gradeId);
```

### Mock Database:
- **Collections**: grades, classes, students
- **Operations**: add, get, update, delete, where queries
- **Relationships**: Maintains referential integrity
- **Reset**: Clean state for each test

## 🔍 Test Examples

### Basic CRUD Test:
```javascript
it('should create a new grade with valid data', async () => {
  const gradeData = { name: 'Grade 1' };

  const response = await request(app)
    .post('/grades')
    .send(gradeData)
    .expect(201);

  expect(response.body).toHaveProperty('id');
  expect(response.body.name).toBe(gradeData.name);
});
```

### Validation Test:
```javascript
it('should return validation error for missing name', async () => {
  const response = await request(app)
    .post('/grades')
    .send({})
    .expect(400);

  expect(response.body).toHaveProperty('error', 'Validation failed');
  expect(response.body.errors[0].msg).toBe('Name is required');
});
```

### Relationship Test:
```javascript
it('should return students for specific class only', async () => {
  await createTestStudent('John Doe', testClass.id, testGrade.id);
  await createTestStudent('Jane Smith', otherClass.id, testGrade.id);

  const response = await request(app)
    .get(`/students/class/${testClass.id}`)
    .expect(200);

  expect(response.body).toHaveLength(1);
  expect(response.body[0].name).toBe('John Doe');
});
```

## 📈 Benefits

1. **Comprehensive Coverage**: All endpoints and error scenarios covered
2. **Fast Execution**: In-memory mocking for quick test runs
3. **Isolation**: Each test runs in clean environment
4. **Maintainable**: Organized structure with reusable utilities
5. **CI/CD Ready**: Configured for automated testing pipelines
6. **Documentation**: Clear test descriptions and examples

## 🚦 Running in CI/CD

The tests are configured to work in continuous integration environments:

```yaml
# Example GitHub Actions configuration
- name: Run Tests
  run: npm test

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## 🔄 Test Maintenance

- **Regular Updates**: Tests updated when API changes
- **Coverage Monitoring**: Maintain minimum coverage thresholds  
- **Performance**: Tests should complete within reasonable time
- **Documentation**: Keep test docs updated with new features
