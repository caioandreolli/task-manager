const express = require('express');
const Tasks = require('../models/Task');
const SubTasks = require('../models/SubTask');

const router = express.Router();

router.get('/', (req, res) => {
  Tasks.find()
    .then(tasks => {
      res.render('home', { tasks });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

router.get('/task/new', (req, res) => {
  res.render('new-task');
});

router.post('/task/new', (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = new Tasks({ title, description, status, dueDate });

  Tasks.create(task)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      throw new Error(err);
    });
});

router.get('/task/detail/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Tasks.findOne({ _id: id });
    const subTasks = await SubTasks.find({ task: id });

    res.render('task-detail', { task, subTasks });
  } catch (error) {
    throw new Error(error);
  }
});

router.post('/sub-task/new/:id', async (req, res) => {
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
