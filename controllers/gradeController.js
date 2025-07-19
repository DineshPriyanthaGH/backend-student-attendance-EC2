const db = require('../models/db');

exports.createGrade = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const gradesSnap = await db.collection('grades').where('name', '==', name).get();
    if (!gradesSnap.empty) return res.status(409).json({ error: 'Grade exists.' });
    const newGrade = await db.collection('grades').add({ name });
    res.status(201).json({ id: newGrade.id, name });
  } catch (err) { next(err); }
};

exports.getGrades = async (req, res, next) => {
  try {
    const snapshot = await db.collection('grades').get();
    const grades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(grades);
  } catch (err) { next(err); }
};

exports.updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.collection('grades').doc(id).update({ name });
    res.json({ id, name });
  } catch (err) { next(err); }
};

exports.deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('grades').doc(id).delete();
    res.status(204).send();
  } catch (err) { next(err); }
};
