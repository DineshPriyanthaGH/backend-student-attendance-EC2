require('dotenv').config();
const express = require('express');
const app = express();
const gradeRoutes = require('./routes/gradeRoutes');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School Attendance Management System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/grades', gradeRoutes);
app.use('/classes', classRoutes);
app.use('/students', studentRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Export the app for testing
module.exports = app;

// Only start server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}
