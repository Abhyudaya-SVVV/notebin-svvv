const express = require('express');
const { getCurrentUser, login, signup, sendOtp, resetPasswordfromOtp } = require('../controllers/userController');
const app = express.Router();

// Login
app.post("/login", login);

// Signup
app.post("/signup",signup);

// Get Current User (Protected Route)
app.get("/me/:token", getCurrentUser);

// Send OTP for password reset
app.post("/forgot-password", sendOtp);

// Reset password using OTP
app.post("/reset-password", resetPasswordfromOtp);

module.exports = app;