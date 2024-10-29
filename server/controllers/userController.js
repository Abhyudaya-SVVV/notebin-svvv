const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TryCatch = require('../middlewares/errorHandler.js');
const crypto = require('crypto');
const {sendMail} = require('../utils/email.js');  

// Sign up
const signup = TryCatch(async (req, res) => {
  const { userId, accountType, name, email, enrollmentNo, mobileNo, password, semester, secretKey } = req.body;

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "User already exists" });
  }

  // For students, check if enrollment number is unique
  if (accountType === 'student') {
    user = await User.findOne({ enrollmentNo });
    if (user) {
      return res.status(400).json({ msg: "Enrollment number already in use" });
    }
  }

  // For faculty, verify secret key
  if (accountType === 'faculty') {
    if (secretKey !== process.env.FACULTY_SECRET_KEY) {
      return res.status(400).json({ msg: "Invalid secret key for faculty signup" });
    }
  }

  // Create a new user
  user = new User({
    userId,
    accountType,
    name,
    email,
    enrollmentNo: accountType === 'student' ? enrollmentNo : null,
    mobileNo,
    password,
    semester: accountType === 'student' ? semester : undefined,
  });

  // Password Hashing
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Save the user in the database
  await user.save();

  // Return JWT
  const payload = {
    user: {
      id: user.id,
      accountType: user.accountType,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.SECURITY,
        sameSite: "Lax",
      });
      res.json({ token });
    }
  );
});

// Login
const login = TryCatch(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not Found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  // Return JWT
  const payload = {
    user: {
      id: user.id,
      username: user.username,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "Lax",
      });
      res.json({ msg: "Login Successful", token });
    }
  );
});

// Get User Info
const getCurrentUser = TryCatch(async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// Send OTP to forgot password through email
const sendOtp = TryCatch(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'This email is not registered' });
  }

  const otp = crypto.randomBytes(3).toString('hex'); // Generate 6-digit OTP
  user.otp = otp;
  user.otpExpires = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes

  await user.save();

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It is valid for 2 minutes.`
  };

  await sendMail(mailOptions);
  res.status(200).json({ message: 'OTP sent to email' });
});

// Reset password using OTP
const resetPasswordfromOtp = TryCatch(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  //New password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();
  res.status(200).json({ message: 'Password has been reset' });
});

module.exports = { signup, login, getCurrentUser, sendOtp, resetPasswordfromOtp };