const db = require('../models/db');

exports.createStudent = async (req, res, next) => {
  try {
    const { name, classId, gradeId } = req.body;
    // Validate references
    if (!(await db.collection('grades').doc(gradeId).get()).exists)
      return res.status(404).json({ error: 'Grade not found.' });
    if (!(await db.collection('classes').doc(classId).get()).exists)
      return res.status(404).json({ error: 'Class not found.' });
    // Duplicate check
    const studentSnap = await db.collection('students')
      .where('name', '==', name)
      .where('classId', '==', classId)
      .get();
    if (!studentSnap.empty) return res.status(409).json({ error: 'Student exists in class.' });
    const newStudent = await db.collection('students').add({ name, classId, gradeId });
    res.status(201).json({ id: newStudent.id, name, classId, gradeId });
  } catch (err) { next(err); }
};

exports.getStudentsByClass = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const students = await db.collection('students').where('classId', '==', classId).get();
    res.json(students.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) { next(err); }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.collection('students').doc(id).update({ name });
    res.json({ id, name });
  } catch (err) { next(err); }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('students').doc(id).delete();
    res.status(204).send();
  } catch (err) { next(err); }
};
