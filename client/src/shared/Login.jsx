'use client';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { BASE_URL } from '@/constants/data';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(`${BASE_URL}api/v1/user/login`, formData);
      const { token, user } = res.data;
      Cookies.set('token', token, { expires: 1 });
      dispatch(loginSuccess({ token, user }));
      toast.success('User logged in successfully');
      router.push('/');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.msg || 'An error occurred'));
      toast.error(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-primary to-primary/80 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md shadow-xl py-6 px-4 sm:px-6 md:px-8 bg-tertiary rounded-lg">
      <div className='flex justify-between'><p className='text-sm font-semibold'>Welcome to <span className='text-primary/50'>Abhyudaya Club</span></p>
        <Link href="/" className=' flex items-center text-sm font-semibold text-primary'> <IoIosArrowBack />
         Home</Link></div>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary mt-2'>Log In</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className='text-sm font-medium text-gray-700'>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Email Address'
              className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              required
            />
          </div>
          <div>
            <label htmlFor="password" className='text-sm font-medium text-gray-700'>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              className='mt-1 w-full px-3 py-2 bg-tertiary border border-gray-500 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'
              required
            />
            <Link href="/forgot" className='text-xs text-primary hover:underline flex justify-end mt-1'>Forgot Password?</Link>
          </div>
          <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6'>
            <Link href="/signin" className='w-full sm:w-auto text-center text-sm font-medium border-2 border-primary py-2 px-4 rounded-md text-primary hover:bg-primary hover:text-white transition-colors duration-300'>Sign up</Link>
            <button type="submit" className='w-full sm:w-auto text-sm font-medium bg-primary py-2 px-4 rounded-md text-white hover:bg-primary/80 transition-colors duration-300'>Login</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;