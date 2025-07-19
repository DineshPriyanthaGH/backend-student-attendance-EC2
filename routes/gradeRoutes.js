const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gradeController');
const { handleValidationErrors } = require('../middleware/validation');
const { validationSchemas } = require('../middleware/validationSchemas');

router.post('/', validationSchemas.createGrade, handleValidationErrors, ctrl.createGrade);
router.get('/', ctrl.getGrades);
router.put('/:id', validationSchemas.updateGrade, handleValidationErrors, ctrl.updateGrade);
router.delete('/:id', validationSchemas.gradeId, handleValidationErrors, ctrl.deleteGrade);

module.exports = router;
