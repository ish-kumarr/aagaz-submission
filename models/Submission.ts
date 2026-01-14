import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  contact: {
    type: String,
    required: [true, 'Please provide a contact number.'],
    maxlength: [20, 'Contact number cannot be more than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address.'],
    maxlength: [100, 'Email cannot be more than 100 characters'],
    unique: true, // Assuming emails should be unique
    match: [/^.+@.+\..+$/, 'Please enter a valid email address'], // Basic email regex validation
  },
  state: {
    type: String,
    required: [true, 'Please provide a state.'],
    maxlength: [60, 'State cannot be more than 60 characters'],
  },
  visitorType: {
    type: String,
    required: [true, 'Please specify visitor type.'],
    enum: ['ib', 'visitor'],
  },
  interest: {
    type: String,
    required: [true, 'Please specify interest.'],
    enum: ['trading', 'fixed_returns'],
  },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);