import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCircleUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { MdHome, MdFileUpload, MdDelete, MdMenu } from "react-icons/md";

import Footer from '@/components/Footer';
import Upload from '@/components/Upload';
import UserProfile from '@/components/UserProfile';
import { BASE_URL } from '@/constants/data';

const UploadNotes = () => {
  const [showRequests, setShowRequests] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    setShowRequests(true);
    setShowUpload(false);
    setMobileMenuOpen(false);
  };

  const handleUploadClick = () => {
    setShowUpload(true);
    setShowRequests(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = jsCookie.get('token');
      const response = await axios.get(`${BASE_URL}api/v1/file/userfiles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    jsCookie.remove('token');
    window.location.href = '/';
  };

  const handleDelete = async (noteId) => {
    try {
      const token = jsCookie.get('token');
      await axios.delete(`${BASE_URL}api/v1/file/delete/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#093A3E] text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notebin</h1>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <MdMenu size={24} />
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className={`
          ${mobileMenuOpen ? 'block' : 'hidden'} 
          md:block 
          bg-[#093A3E] text-white
          w-full md:w-20 
          fixed md:relative 
          inset-0 md:inset-auto 
          z-20 md:z-auto
          overflow-y-auto
        `}>
          <div className="flex flex-col items-center py-4 space-y-6 ">
            <div className='w-10 h-10 overflow-hidden rounded-full hidden md:block'>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg" alt="" className='w-full h-full' />
            </div>
            <Link href="/" className="flex gap-1 p-2 hover:bg-[#0c4c52] rounded"><MdHome size={25} /> <span className="block lg:hidden">HOME</span></Link>
            <button onClick={handleUploadClick} className=" flex gap-1 p-2 hover:bg-[#0c4c52] rounded"><MdFileUpload size={25} /> <span className="block lg:hidden">UPLOAD</span></button>
            <button onClick={handleAdminClick} className="flex gap-1 p-2 hover:bg-[#0c4c52] rounded"><FaCircleUser  size={24} /> <span className="block lg:hidden">PROFILE</span></button>
            <button onClick={handleLogout} className="flex gap-1 p-2 hover:bg-[#0c4c52] rounded"><IoLogOut size={25} /> <span className="block lg:hidden">LOGOUT</span></button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:flex">
          {/* Notes List */}
          <div className='w-full md:w-1/3 lg:w-1/4 mb-4 md:mb-0 md:mr-4'>
            <h2 className='text-2xl text-[#093A3E] font-semibold mb-4'>All Notes</h2>
            <div className='bg-white rounded-lg shadow overflow-hidden'>
              <div className='max-h-[70vh] overflow-y-auto p-4'>
                {loading ? (
                  <p className="text-center">Loading notes...</p>
                ) : notes.length === 0 ? (
                  <p className="text-center">No notes found.</p>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className='flex justify-between bg-[#093A3E] text-white p-2 rounded mb-2 items-center'>
                      <span className="truncate flex-1 mr-2">{note.title}</span>
                      <div className="flex items-center">
                        <Link href={note.fileUrl} className="mr-2 hover:underline">
                          <small>Download</small>
                        </Link>
                        <button onClick={() => handleDelete(note._id)} className="text-red-400 hover:underline">
                          <small>Delete</small>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upload or User Profile */}
          <div className='flex-1 bg-white rounded-lg shadow p-4'>
            {showRequests ? <UserProfile /> : showUpload ? <Upload onUploadSuccess={fetchNotes} /> : null}
          </div>
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default UploadNotes;