"use client";
import React, { useState, useRef, useEffect } from "react";
import { GoRocket } from "react-icons/go";
import { MdGroups } from "react-icons/md";
import { RiFolderSharedFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes } from '../slices/notesSlice'; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const Page = () => {
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.items);
  const status = useSelector((state) => state.notes.status);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  const filteredNotes = searchTerm
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;

  return (
    <main className="bg-[#093A3E] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow text-white py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl sm:text-3xl font-bold mainf tracking-tight mb-2">
          Your Centralized Academic Repository
        </h1>
        <p className="text-center text-zinc-300 text-sm sm:text-base mb-6">
          Here you can find all semester study material
        </p>

        <div className="flex justify-center relative mb-2" ref={searchRef}>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="border border-zinc-200 bg-white px-4 py-2 w-full text-black text-sm outline-none rounded-l transition-all duration-300 focus:ring-2 focus:ring-[#008985]"
              placeholder="Search notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setModal(true)}
            />
            
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          <button className="px-4 py-2 bg-[#008985] text-sm rounded-r hover:bg-[#007975] transition-colors duration-300">
            Search
          </button>
        </div>

        {modal && (
          <div
            className="flex-col overflow-y-auto w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] shadow-lg absolute left-1/2 border -translate-x-1/2 mx-auto max-h-[60vh] bg-white text-black rounded mt-2"
            ref={modalRef}
          >
            <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b">
              <h3 className="text-base font-semibold">Search Results</h3>
            </div>
            <div className="p-3">
              {status === 'loading' && <div className="text-center py-2 text-sm">Loading...</div>}
              {status === 'succeeded' && filteredNotes.length > 0 ? (
                filteredNotes.map((note, index) => (
                  <div
                    key={note._id}
                    className={`text-xs sm:text-sm mb-1 flex w-full p-2 items-center justify-between rounded ${
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <div className="mr-2 flex-grow">{highlightText(note.title, searchTerm)}</div>
                    {note.fileUrl ? (
                      <Link
                        href={note.fileUrl}
                        className="bg-[#093A3E] text-white px-2 py-1 text-xs rounded hover:bg-[#0c4e54] transition-colors duration-300"
                      >
                        Download
                      </Link>
                    ) : (
                      <span className="bg-gray-300 text-gray-600 px-2 py-1 text-xs rounded">
                        No link
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-sm text-gray-500">No results found</div>
              )}
              {status === 'failed' && (
                <div className="text-center py-3 text-sm text-red-500">Failed to load notes</div>
              )}
            </div>
          </div>
        )}

        <p className="text-center text-xs sm:text-sm mb-8">
          Popular searches:{" "}
          <span className="bg-[#326262] px-2 py-1 text-xs rounded-full text-white mr-2 inline-block mt-2">
            DLCD
          </span>
          <span className="bg-[#326262] px-2 py-1 text-xs rounded-full text-white mr-2 inline-block mt-2">
            Maths
          </span>
          <span className="bg-[#326262] px-2 py-1 text-xs rounded-full text-white inline-block mt-2">
            Physics
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded flex flex-col gap-4 text-black items-center justify-center p-6">
            <GoRocket size={60} color="#008985" />
            <Link href="/notes" className="mainf text-xl font-semibold">
              Find Notes
            </Link>
            <p className="text-center text-zinc-600 text-sm">
              Easily search and access a wide range of study materials for all your courses.
            </p>
          </div>
          <div className="bg-white rounded flex flex-col gap-4 text-black items-center justify-center p-6">
            <MdGroups size={70} color="#008985" />
            <a href="#" className="mainf text-xl font-semibold">
              Centralized Hub
            </a>
            <p className="text-center text-zinc-600 text-sm">
              A single platform to manage and organize all your academic resources efficiently.
            </p>
          </div>
          <div className="bg-white rounded flex flex-col gap-4 text-black items-center justify-center p-6">
            <RiFolderSharedFill size={60} color="#008985" />
            <Link href="/uploadNotes" className="mainf text-xl font-semibold">
              Upload Materials
            </Link>
            <p className="text-center text-zinc-600 text-sm">
              Contribute to the community by sharing your notes and study materials with others.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Page;