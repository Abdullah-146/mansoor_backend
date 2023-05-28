import mongoose from 'mongoose';
import { encrypt } from '../utils/index.js';

/*
  Defining User Schema
  along with validations
  and middlewares
*/
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
      if (!regex.test(value)) throw new Error('Incorrect email format.');
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: (value) => {
      const passwordRegex = new RegExp(
        '(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$'
      );
      if (!passwordRegex.test(value))
        throw new Error(
          'Password must be at least 8 characters long including atleast 1 special character, 1 number and 1 Capital Letter'
        );
    },
  },
  profileImageUrl: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/2102/2102647.png',
  },
  role: {
    type: String,
    enum: ['admin', 'default', 'photographer', 'caterer'],
    default: 'default',
  },
  yearOfExperience: {
    type: Number,
  },
  serviceCharges: {
    type: Number,
  },
});

// Adding document level middlewares
UserSchema.pre('save', async function (next) {
  // We want to make sure, when user registers we should encrypt the password
  const encryptedPassword = await encrypt(this.password);
  if (encryptedPassword !== '') {
    this.password = encryptedPassword;
    next();
  } else {
    throw new Error('Failed to encrypt password');
  }
});

export default new mongoose.model('User', UserSchema);
