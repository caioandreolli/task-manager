const express = require('express');
const Tasks = require('../../models/Task');
const SubTasks = require('../../models/SubTask');

const router = express.Router();

router.get('/', (req, res) => {
  const { loggedUser } = req.session;

  Tasks.find({ user: loggedUser._id })
    .then(tasks => {
      res.render('private/tasks', { tasks });
    })
    .catch((err) => {
      throw new Error(err);
    });
});

router.get('/new', (req, res) => {
  res.render('private/new-task');
});

router.post('/new', (req, res) => {
  const { loggedUser } = req.session;
  const { title, description, status, dueDate } = req.body;

  const task = new Tasks({ title, description, status, dueDate, user: loggedUser._id });

  Tasks.create(task)
    .then(() => {
      res.redirect('/task');
    })
    .catch((err) => {
      throw new Error(err);
    });
});

router.get('/detail/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Tasks.findOne({ _id: id });
    const subTasks = await SubTasks.find({ task: id });

    res.render('private/task-detail', { task, subTasks });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = router;