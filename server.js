#!/usr/bin/env node

/**
 * Development server script with enhanced error handling
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Enhanced error handling for server startup
const server = app.listen(PORT, () => {
  console.log('🚀 School Attendance Management System API');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌟 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('📋 Available endpoints:');
  console.log('   GET    /health           - Health check');
  console.log('   POST   /grades           - Create grade');
  console.log('   GET    /grades           - List grades');
  console.log('   PUT    /grades/:id       - Update grade');
  console.log('   DELETE /grades/:id       - Delete grade');
  console.log('   POST   /classes          - Create class');
  console.log('   GET    /classes/grade/:id - List classes by grade');
  console.log('   POST   /students         - Create student');
  console.log('   GET    /students/class/:id - List students by class');
  console.log('');
  console.log('💡 Test the API: curl http://localhost:' + PORT + '/health');
  console.log('🧪 Run tests: npm test');
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      console.log('💡 Try using a different port: PORT=3001 npm start');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
