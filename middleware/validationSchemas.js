const { body, param } = require('express-validator');

// Common validation rules
const commonValidations = {
  // ID parameter validation
  id: param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isLength({ min: 1 })
    .withMessage('ID must be valid'),

  // Name field validation
  name: body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail() // Stop on first error
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters')
    .trim(),

  // Short name validation (for grades, classes)
  shortName: body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail() // Stop on first error
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters')
    .trim(),

  // Grade ID validation
  gradeId: body('gradeId')
    .notEmpty()
    .withMessage('Grade ID is required')
    .isLength({ min: 1 })
    .withMessage('Grade ID must be valid'),

  // Class ID validation
  classId: body('classId')
    .notEmpty()
    .withMessage('Class ID is required')
    .isLength({ min: 1 })
    .withMessage('Class ID must be valid'),

  // Parameter validations
  gradeIdParam: param('gradeId')
    .notEmpty()
    .withMessage('Grade ID is required')
    .isLength({ min: 1 })
    .withMessage('Grade ID must be valid'),

  classIdParam: param('classId')
    .notEmpty()
    .withMessage('Class ID is required')
    .isLength({ min: 1 })
    .withMessage('Class ID must be valid')
};

// Validation schemas for different operations
const validationSchemas = {
  // Grade validations
  createGrade: [commonValidations.shortName],
  updateGrade: [commonValidations.id, commonValidations.shortName],
  gradeId: [commonValidations.id],

  // Class validations
  createClass: [commonValidations.shortName, commonValidations.gradeId],
  updateClass: [commonValidations.id, commonValidations.shortName],
  classId: [commonValidations.id],
  getClassesByGrade: [commonValidations.gradeIdParam],

  // Student validations
  createStudent: [commonValidations.name, commonValidations.classId, commonValidations.gradeId],
  updateStudent: [commonValidations.id, commonValidations.name],
  studentId: [commonValidations.id],
  getStudentsByClass: [commonValidations.classIdParam]
};

module.exports = { commonValidations, validationSchemas };
