const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/classController');
const { handleValidationErrors } = require('../middleware/validation');
const { validationSchemas } = require('../middleware/validationSchemas');

router.post('/', validationSchemas.createClass, handleValidationErrors, ctrl.createClass);
router.get('/grade/:gradeId', validationSchemas.getClassesByGrade, handleValidationErrors, ctrl.getClassesByGrade);
router.put('/:id', validationSchemas.updateClass, handleValidationErrors, ctrl.updateClass);
router.delete('/:id', validationSchemas.classId, handleValidationErrors, ctrl.deleteClass);

module.exports = router;
