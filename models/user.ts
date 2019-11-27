import mongoose, { Schema } from 'mongoose';
import * as bcrypt from 'bcryptjs';

const UserSchema: Schema = new Schema({
  fullName: {
    type: String,
      require: true,
      trim: true,
      unique: true,
  },
  emailAddress: {
     type: String,
     require: true,
     trim: true,
     unique: true,
     match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
      type: String,
      require: true
  },
  confirmPassword: {
      type: String,
      require: true
  },
  cityCountry: {
    type: String,
      require: true,
      // trim: true,
      // unique: true,
  },
  dateOfBirth: {
    type: String,
      require: true,
  },
  username: {
    type: String,
      require: true,
  },
  gender: {
      type: String,
      require: true,
  },
  checkbox: {
      type: String,
      require: true
  },
  // facebookProvider: {
  //     type: {
  //           id: String,
  //           token: String
  //     },
  //     select: false
  // },
  selected_interest: [
      {
          type: mongoose.Schema.ObjectId,
          ref: 'My_Interest'
      }
 ],
  created_dt: {
      type: Date,
      default: Date.now,
    require: true
  },
  //  isAdmin:{
  //     type:Boolean,
  //     default:false
  // }
});

UserSchema.statics.hashPassword = function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
};
UserSchema.methods.isValid = function(hashedpassword: string) {
  return bcrypt.compareSync(hashedpassword, this.password);
};

export default mongoose.model('User', UserSchema);
