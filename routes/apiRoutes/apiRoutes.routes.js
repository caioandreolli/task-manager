const express = require('express');
const SubTasks = require('../../models/SubTask');

const router = express.Router();

router.get('/subtask', async (req, res) => {
  const { id } = req.query;

  try {
    const subtask = await SubTasks.findById(id);

    res.status(200).json(subtask);
  } catch (err) {
    throw new Error(err);
  }
});

router.post('/subtask/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    await SubTasks.updateOne({ _id: id }, { title, description, status, dueDate });

    res.status(200).json({ message: 'OK' });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = router;
