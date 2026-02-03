

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 64,
      trim: true,
      required: [true, 'Name can not be empty!'],
    },
    email: {
      type: String,
      minLength: 2,
      maxLength: 256,
      trim: true,
      required: [true, 'Email can not be empty!'],
      unique: true,
    },
    role: {
      type: ObjectId,
      ref: 'Role',
      required: [true, 'Role is required!'],
    },
    reportsTo: {
      type: ObjectId,
      ref: 'User',
      default: null,
    },
    password: {
      type: String,
      maxLength: 256,
      required: [true, 'Password is required!'],
    },
  },
  { timestamps: true }
);

/* 🔐 Hash password */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const SALT = parseInt(process.env.SALT, 10) || 10;
  const salt = await bcryptjs.genSalt(SALT);
  this.password = await bcryptjs.hash(this.password, salt);
});

/* 🔑 Compare password */
userSchema.methods.matchPassword = async function (password) {
  return bcryptjs.compare(password, this.password);
};

/* 🎟️ Generate JWT (FIXED) */
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
    role: {
      roleId: this.role.roleId,
      roleName: this.role.roleName,
    },
  };

  return jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' });
};

const User = mongoose.model('User', userSchema);
module.exports = User;
