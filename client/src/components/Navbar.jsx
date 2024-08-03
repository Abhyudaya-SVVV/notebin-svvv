"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [token, setToken] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const tokenFromCookie = Cookie.get('token');
    setToken(tokenFromCookie);
  }, []);

  const handleLogout = () => {
    Cookie.remove('token');
    setToken(null);
    window.location.href = '/';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='bg-[#093A3E] text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className="logo text-2xl font-bold tracking-[1px]">
              Notebin
            </div>
          </div>
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              <Link href="/" className='hover:bg-[#0D5C63] px-3 py-2 rounded-md text-sm font-medium'>Home</Link>
              <Link href="/notes" className='hover:bg-[#0D5C63] px-3 py-2 rounded-md text-sm font-medium'>Notes</Link>
              <Link href="https://www.linkedin.com/in/mandeepyadav27/" target="_blank" className='hover:bg-[#0D5C63] px-3 py-2 rounded-md text-sm font-medium'>Contact</Link>
              {token ? (
                <button onClick={handleLogout} className='border-white border text-white px-4 py-1 rounded-full hover:bg-white hover:text-[#093A3E]'>Logout</button>
              ) : (
                <Link href="/signin" className='border-white border text-white px-4 py-1 rounded-full hover:bg-white hover:text-[#093A3E]'>Sign in</Link>
              )}
            </div>
          </div>
          <div className='-mr-2 flex md:hidden'>
            <button
              onClick={toggleMenu}
              type="button"
              className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-[#0D5C63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#093A3E] focus:ring-white'
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block" size={18} aria-hidden="true" />
              ) : (
                <FaBars className="block" size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className='hover:bg-[#0D5C63] block px-3 py-2 rounded-md text-base font-medium'>Home</Link>
            <Link href="/notes" className='hover:bg-[#0D5C63] block px-3 py-2 rounded-md text-base font-medium'>Notes</Link>
            <Link href="https://www.linkedin.com/in/mandeepyadav27/" target="_blank" className='hover:bg-[#0D5C63] block px-3 py-2 rounded-md text-base font-medium'>Contact</Link>
            {token ? (
              <button onClick={handleLogout} className='block w-full text-left hover:bg-[#0D5C63] px-3 py-2 rounded-md text-base font-medium'>Logout</button>
            ) : (
              <Link href="/signin" className='hover:bg-[#0D5C63] block px-3 py-2 rounded-md text-base font-medium'>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;