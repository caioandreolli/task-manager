const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  status: { type: String, required: true, enum: ['TODO', 'ONGOING', 'DONE', 'CANCELED'] },
  creationDate: { type: Date, required: true, default: new Date() },
  dueDate: { type: Date, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
