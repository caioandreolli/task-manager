const mongoose = require('mongoose');
const { Schema } = mongoose;

const subTaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, required: true, enum: ['TODO', 'ONGOING', 'DONE', 'CANCELED'] },
  creationDate: { type: Date, required: true, default: new Date() },
  dueDate: { type: Date, required: true },
  task: { type: mongoose.Types.ObjectId, ref: 'Task', required: true },
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;