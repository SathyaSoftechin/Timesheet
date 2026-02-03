const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const taskSchema = new Schema(
  {
    timesheet: {
      type: ObjectId,
      ref: 'Timesheet',
      required: true,
    },

    assignedBy: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },

    hour: {
      type: Number,
      min: 0,
      max: 23,
      required: true,
    },

    minute: {
      type: Number,
      min: 0,
      max: 59,
      default: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    remarks: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
