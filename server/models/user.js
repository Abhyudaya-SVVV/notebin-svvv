const { Schema, model, mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    accountType: {
      type: String,
      enum: ['student', 'faculty'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    enrollmentNo: {
      type: String,
      validate: {
        validator: function(v) {
          return this.accountType === 'student' ? v != null : true;
        },
        message: 'Enrollment number is required for students'
      }
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
    },
    otp: {
      type: String
    },
    otpExpires: {
      type: Date
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);