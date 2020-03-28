const express = require('express');
const SubTasks = require('../../models/SubTask');

const router = express.Router();

router.post('/new/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newTask = new SubTasks({ ...req.body, task: id })

    await SubTasks.create(newTask);

    res.redirect(`/task/detail/${id}`);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;