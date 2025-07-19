const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
  // Use environment variables to create service account object
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase initialized successfully with environment variables');
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Use complete service account JSON from environment variable
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase initialized successfully with service account key');
} else if (process.env.FIREBASE_PROJECT_ID) {
  // Use Application Default Credentials (for local development with Firebase CLI)
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
  console.log('Firebase initialized with Application Default Credentials');
} else {
  console.warn('Warning: Firebase not initialized. Please check your environment variables.');
  console.log('Required variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
  process.exit(1);
}

const db = admin.firestore();
module.exports = db;
