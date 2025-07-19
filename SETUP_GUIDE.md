# 🚀 School Attendance Management System - Setup & Running Guide

## ✅ Problem Fixed: Firebase Configuration

The `Cannot find module '../serviceAccountKey.json'` error has been resolved by updating the database configuration to use environment variables instead of a service account file.

## 🔧 What Was Changed

### 1. **Updated `models/db.js`**
- Now uses environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`)
- Supports multiple Firebase authentication methods
- Provides helpful error messages and logging

### 2. **Updated `app.js`**
- Added `require('dotenv').config()` to load environment variables
- Updated main entry point in `package.json`

### 3. **Added Scripts to `package.json`**
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🚀 How to Run the Application

### Method 1: Using npm scripts (Recommended)
```bash
# Start the server
npm start

# Start with automatic restart on file changes (requires nodemon)
npm run dev

# Run tests
npm test
```

### Method 2: Direct Node.js execution
```bash
node app.js
```

## 🔍 Expected Output
When you run the application, you should see:
```
Firebase initialized successfully with environment variables
Server running on 3000
```

## 🛠️ Troubleshooting

### If you see Firebase initialization warnings:
1. **Check your `.env` file** - Ensure it contains:
   ```
   FIREBASE_PROJECT_ID=school-atendance-12089
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@school-atendance-12089.iam.gserviceaccount.com
   PORT=3000
   ```

2. **Verify Firebase project** - Make sure your Firebase project ID is correct

3. **Check private key format** - Ensure newlines in the private key are properly escaped as `\\n`

### Common Issues:

#### Issue 1: "Firebase not initialized"
**Solution**: Check that all three Firebase environment variables are set correctly in `.env`

#### Issue 2: "Invalid private key"
**Solution**: Ensure the private key includes the full PEM format with headers and footers

#### Issue 3: "Project not found"
**Solution**: Verify the project ID matches your Firebase project

## 📡 Testing the API

Once the server is running, you can test the endpoints:

### Using curl:
```bash
# Create a grade
curl -X POST http://localhost:3000/grades -H "Content-Type: application/json" -d '{"name":"Grade 1"}'

# Get all grades
curl http://localhost:3000/grades

# Create a class (replace GRADE_ID with actual grade ID)
curl -X POST http://localhost:3000/classes -H "Content-Type: application/json" -d '{"name":"Class A","gradeId":"GRADE_ID"}'
```

### Using a REST client (Postman, Insomnia, etc.):
- **Base URL**: `http://localhost:3000`
- **Endpoints**:
  - `POST /grades` - Create grade
  - `GET /grades` - List grades
  - `PUT /grades/:id` - Update grade
  - `DELETE /grades/:id` - Delete grade
  - `POST /classes` - Create class
  - `GET /classes/grade/:gradeId` - List classes by grade
  - `POST /students` - Create student
  - `GET /students/class/:classId` - List students by class

## 🧪 Running Tests

The comprehensive test suite can be run with:

```bash
# Run all tests
npm test

# Run specific test files
npm test -- tests/simple/grades.test.js
npm test -- tests/simple/classes.test.js
npm test -- tests/simple/students.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🔐 Security Notes

1. **Environment Variables**: Your `.env` file contains sensitive Firebase credentials. Never commit this to version control.

2. **Firebase Rules**: Ensure your Firestore security rules are properly configured for production.

3. **CORS**: For frontend integration, you may need to add CORS middleware.

## 🚀 Next Steps

1. **Start the server**: Run `npm start` or `node app.js`
2. **Test endpoints**: Use curl or a REST client to test the API
3. **Run tests**: Execute `npm test` to verify everything works
4. **Frontend integration**: Connect your frontend application to these endpoints

## 📞 Support

If you encounter any issues:
1. Check the Firebase console for project settings
2. Verify all environment variables in `.env`
3. Check the server logs for detailed error messages
4. Run the test suite to verify functionality
