"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { BASE_URL } from '@/constants/data';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowBack } from "react-icons/io";

const Signin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    accountType: 'student',
    name: '',
    email: '',
    enrollmentNo: '',
    mobileNo: '',
    password: '',
    semester: '',
    secretKey: ''
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    } else if (!hasNumber.test(password)) {
      return "Password must contain at least one number";
    } else if (!hasUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter";
    } else if (!hasLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter";
    } else if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const validateMobileNumber = (mobileNo) => {
    const isNumeric = /^\d+$/.test(mobileNo);
    if (!isNumeric) {
      return "Mobile number must be numeric";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    // console.log(formData);
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    const mobileNumberError = validateMobileNumber(formData.mobileNo);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (mobileNumberError) {
      toast.error(mobileNumberError);
      return;
    }

    dispatch(loginStart());
    try {
      const res = await axios.post(`${BASE_URL}api/v1/user/signup`, formData);
      const { token, user } = res.data;
      Cookies.set('token', token, { expires: 1 });
      dispatch(loginSuccess({ token, user }));
      router.push('/');
      toast.success('User registered successfully');
    } catch (err) {
      dispatch(loginFailure(err.response.data.msg));
      toast.error(err.response.data.msg || 'An error occurred');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md shadow-xl py-6 px-4 sm:px-6 md:px-8 bg-tertiary rounded-lg">
        <div className='flex justify-between'><p className='text-sm font-semibold'>Welcome to <span className='text-primary/50'>Abhyudaya Club</span></p>
        <Link href="/" className=' flex items-center text-sm font-semibold text-primary'> <IoIosArrowBack />
         Home</Link></div>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2'>Sign up</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="accountType" className='text-sm font-medium text-gray-700'>Account Type</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                required
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className='text-sm font-medium text-gray-700'>Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder='Email Address' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
            </div>

            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
              <div className='flex-1'>
                <label htmlFor="name" className='text-sm font-medium text-gray-700'>Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder='Name' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
              </div>
              <div className='flex-1'>
                <label htmlFor="mobileNo" className='text-sm font-medium text-gray-700'>Mobile Number</label>
                <input type="tel" id="mobileNo" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder='Mobile Number' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
              </div>
            </div>

            {formData.accountType === 'student' && (
              <>
                <div>
                  <label htmlFor="enrollmentNo" className='text-sm font-medium text-gray-700'>Enrollment Number</label>
                  <input type="text" id="enrollmentNo" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} placeholder='Enrollment Number' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
                </div>

                <div>
                  <label htmlFor="semester" className='text-sm font-medium text-gray-700'>Semester / Year <span className='text-xs text-gray-400'>(optional)</span></label>
                  <input type="text" id="semester" name="semester" value={formData.semester} onChange={handleChange} placeholder='Semester / Year' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' />
                </div>
              </>
            )}

            {formData.accountType === 'faculty' && (
              <div>
                <label htmlFor="secretKey" className='text-sm font-medium text-gray-700'>Secret Key</label>
                <input type="password" id="secretKey" name="secretKey" value={formData.secretKey} onChange={handleChange} placeholder='Secret Key' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
              </div>
            )}

            <div>
              <label htmlFor="password" className='text-sm font-medium text-gray-700'>Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder='Password' className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary' required />
              {/* <Link href="/forgot" className='text-xs text-primary hover:underline flex justify-end mt-1'>Forgot Password?</Link> */}
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6'>
              <Link href="/login" className='w-full sm:w-auto text-center text-sm font-medium border-2 border-primary py-2 px-4 rounded-md text-primary hover:bg-primary hover:text-white transition-colors duration-300'>Login</Link>
              <button type="submit" className='w-full sm:w-auto text-sm font-medium bg-primary py-2 px-4 rounded-md text-white hover:bg-primary/80 transition-colors duration-300'>Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;