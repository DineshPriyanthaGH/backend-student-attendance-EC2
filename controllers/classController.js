const db = require('../models/db');

exports.createClass = async (req, res, next) => {
  try {
    const { gradeId, name } = req.body;
    const gradeRef = db.collection('grades').doc(gradeId);
    if (!(await gradeRef.get()).exists) return res.status(404).json({ error: 'Grade not found.' });
    // Duplicate check
    const classSnap = await db.collection('classes')
      .where('gradeId', '==', gradeId)
      .where('name', '==', name)
      .get();
    if (!classSnap.empty) return res.status(409).json({ error: 'Class exists in grade.' });
    const newClass = await db.collection('classes').add({ name, gradeId });
    res.status(201).json({ id: newClass.id, name, gradeId });
  } catch (err) { next(err); }
};

exports.getClassesByGrade = async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const classSnap = await db.collection('classes').where('gradeId', '==', gradeId).get();
    const classes = classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(classes);
  } catch (err) { next(err); }
};

exports.updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.collection('classes').doc(id).update({ name });
    res.json({ id, name });
  } catch (err) { next(err); }
};

exports.deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('classes').doc(id).delete();
    res.status(204).send();
  } catch (err) { next(err); }
};
