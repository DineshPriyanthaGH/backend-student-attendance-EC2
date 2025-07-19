const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { handleValidationErrors } = require('../middleware/validation');
const { validationSchemas } = require('../middleware/validationSchemas');

router.post('/', validationSchemas.createStudent, handleValidationErrors, ctrl.createStudent);
router.get('/class/:classId', validationSchemas.getStudentsByClass, handleValidationErrors, ctrl.getStudentsByClass);
router.put('/:id', validationSchemas.updateStudent, handleValidationErrors, ctrl.updateStudent);
router.delete('/:id', validationSchemas.studentId, handleValidationErrors, ctrl.deleteStudent);

module.exports = router;
