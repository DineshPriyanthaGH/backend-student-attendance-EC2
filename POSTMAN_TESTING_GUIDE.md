# 🚀 Postman Testing Guide - School Attendance Management System

This guide provides step-by-step instructions to test all API endpoints using Postman.

## 🔧 Initial Setup

### 1. Start the Server
```bash
npm start
```
The server should be running on `http://localhost:3000`

### 2. Postman Setup
- Base URL: `http://localhost:3000`
- Content-Type: `application/json` (for POST/PUT requests)

## 📋 API Endpoints Testing

### 1. Health Check
**Test server status first**

- **Method**: `GET`
- **URL**: `http://localhost:3000/health`
- **Expected Response**:
```json
{
  "status": "OK",
  "message": "School Attendance Management System API is running",
  "timestamp": "2025-07-19T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🎓 GRADES Management

### 2. Create Grade
- **Method**: `POST`
- **URL**: `http://localhost:3000/grades`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Grade 1"
}
```
- **Expected Response**:
```json
{
  "id": "generated-grade-id",
  "name": "Grade 1",
  "createdAt": "2025-07-19T10:30:00.000Z"
}
```

### 3. Create Multiple Grades (for testing)
Repeat the above with different names:
```json
{"name": "Grade 2"}
{"name": "Grade 3"}
{"name": "Grade 4"}
{"name": "Grade 5"}
```

### 4. Get All Grades
- **Method**: `GET`
- **URL**: `http://localhost:3000/grades`
- **Expected Response**:
```json
[
  {
    "id": "grade-id-1",
    "name": "Grade 1",
    "createdAt": "2025-07-19T10:30:00.000Z"
  },
  {
    "id": "grade-id-2",
    "name": "Grade 2",
    "createdAt": "2025-07-19T10:31:00.000Z"
  }
]
```

### 5. Update Grade
- **Method**: `PUT`
- **URL**: `http://localhost:3000/grades/{grade-id}`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Grade 1A"
}
```
- **Expected Response**:
```json
{
  "id": "grade-id",
  "name": "Grade 1A",
  "updatedAt": "2025-07-19T10:35:00.000Z"
}
```

### 6. Delete Grade
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/grades/{grade-id}`
- **Expected Response**:
```json
{
  "message": "Grade deleted successfully"
}
```

---

## 🏫 CLASSES Management

### 7. Create Class
- **Method**: `POST`
- **URL**: `http://localhost:3000/classes`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Class A",
  "gradeId": "your-grade-id-here"
}
```
- **Expected Response**:
```json
{
  "id": "generated-class-id",
  "name": "Class A",
  "gradeId": "grade-id",
  "createdAt": "2025-07-19T10:40:00.000Z"
}
```

### 8. Create Multiple Classes (for testing)
```json
{"name": "Class B", "gradeId": "grade-id-1"}
{"name": "Class C", "gradeId": "grade-id-1"}
{"name": "Class A", "gradeId": "grade-id-2"}
```

### 9. Get Classes by Grade
- **Method**: `GET`
- **URL**: `http://localhost:3000/classes/grade/{grade-id}`
- **Expected Response**:
```json
[
  {
    "id": "class-id-1",
    "name": "Class A",
    "gradeId": "grade-id",
    "createdAt": "2025-07-19T10:40:00.000Z"
  },
  {
    "id": "class-id-2",
    "name": "Class B",
    "gradeId": "grade-id",
    "createdAt": "2025-07-19T10:41:00.000Z"
  }
]
```

### 10. Update Class
- **Method**: `PUT`
- **URL**: `http://localhost:3000/classes/{class-id}`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Class A1"
}
```

### 11. Delete Class
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/classes/{class-id}`
- **Expected Response**:
```json
{
  "message": "Class deleted successfully"
}
```

---

## 👥 STUDENTS Management

### 12. Create Student
- **Method**: `POST`
- **URL**: `http://localhost:3000/students`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "John Doe",
  "classId": "your-class-id-here",
  "gradeId": "your-grade-id-here"
}
```
- **Expected Response**:
```json
{
  "id": "generated-student-id",
  "name": "John Doe",
  "classId": "class-id",
  "gradeId": "grade-id",
  "createdAt": "2025-07-19T10:45:00.000Z"
}
```

### 13. Create Multiple Students (for testing)
```json
{"name": "Jane Smith", "classId": "class-id-1", "gradeId": "grade-id-1"}
{"name": "Bob Wilson", "classId": "class-id-1", "gradeId": "grade-id-1"}
{"name": "Alice Brown", "classId": "class-id-2", "gradeId": "grade-id-1"}
```

### 14. Get Students by Class
- **Method**: `GET`
- **URL**: `http://localhost:3000/students/class/{class-id}`
- **Expected Response**:
```json
[
  {
    "id": "student-id-1",
    "name": "John Doe",
    "classId": "class-id",
    "gradeId": "grade-id",
    "createdAt": "2025-07-19T10:45:00.000Z"
  },
  {
    "id": "student-id-2",
    "name": "Jane Smith",
    "classId": "class-id",
    "gradeId": "grade-id",
    "createdAt": "2025-07-19T10:46:00.000Z"
  }
]
```

### 15. Update Student
- **Method**: `PUT`
- **URL**: `http://localhost:3000/students/{student-id}`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "John Smith"
}
```

### 16. Delete Student
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/students/{student-id}`
- **Expected Response**:
```json
{
  "message": "Student deleted successfully"
}
```

---

## 🧪 Testing Validation Errors

### Invalid Data Tests

#### 1. Create Grade with Empty Name
- **Method**: `POST`
- **URL**: `http://localhost:3000/grades`
- **Body**:
```json
{
  "name": ""
}
```
- **Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

#### 2. Create Class without Grade ID
- **Method**: `POST`
- **URL**: `http://localhost:3000/classes`
- **Body**:
```json
{
  "name": "Test Class"
}
```
- **Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "gradeId",
      "message": "Grade ID is required"
    }
  ]
}
```

#### 3. Create Student with Invalid Data
- **Method**: `POST`
- **URL**: `http://localhost:3000/students`
- **Body**:
```json
{
  "name": "",
  "classId": "",
  "gradeId": ""
}
```
- **Expected Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "classId",
      "message": "Class ID is required"
    },
    {
      "field": "gradeId",
      "message": "Grade ID is required"
    }
  ]
}
```

---

## 📝 Testing Workflow

### Complete Testing Sequence

1. **Health Check** - Verify server is running
2. **Create Grade** - Create at least 2 grades
3. **Get All Grades** - Verify grades were created
4. **Create Classes** - Create 2-3 classes for each grade
5. **Get Classes by Grade** - Verify classes were created
6. **Create Students** - Create 3-5 students for each class
7. **Get Students by Class** - Verify students were created
8. **Update Records** - Test updating grades, classes, and students
9. **Delete Records** - Test deleting in reverse order (students → classes → grades)
10. **Validation Tests** - Test with invalid data

### Notes for Testing:
- Save the IDs returned from creation requests to use in subsequent tests
- Test both valid and invalid data scenarios
- Pay attention to the relationships between entities (Grade → Class → Student)
- All POST/PUT requests require `Content-Type: application/json` header
- The server validates all input data according to the validation schemas

### Postman Collection
Consider creating a Postman Collection with all these requests organized in folders:
```
📁 School Attendance API
  📁 Health
    ✅ Health Check
  📁 Grades
    ✅ Create Grade
    ✅ Get All Grades
    ✅ Update Grade
    ✅ Delete Grade
  📁 Classes
    ✅ Create Class
    ✅ Get Classes by Grade
    ✅ Update Class
    ✅ Delete Class
  📁 Students
    ✅ Create Student
    ✅ Get Students by Class
    ✅ Update Student
    ✅ Delete Student
  📁 Validation Tests
    ❌ Invalid Grade
    ❌ Invalid Class
    ❌ Invalid Student
```

This comprehensive guide should help you test all functionality of your School Attendance Management System API!
