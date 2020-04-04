const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const { Schema } = mongoose;

const userSchema = new Schema({
  facebookId: String,
  name: { type: String, required: true, },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'member'], default: 'member' },
  email: { type: String, required: true, unique: true },
  ativo: { type: Boolean, required: true, default: true },
});

userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = User;
