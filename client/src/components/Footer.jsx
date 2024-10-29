import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-primary text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='py-6 md:flex md:items-center md:justify-between'>
          <div className="logo text-2xl text-center font-bold tracking-[1px] mb-4 md:mb-0">
            Notebin
          </div>
          <nav className='flex flex-wrap justify-center md:justify-end gap-4 md:gap-6'>
            <Link href="/" className='hover:text-gray-300 transition-colors'>Home</Link>
            <Link href="/notes" className='hover:text-gray-300 transition-colors'>Notes</Link>
            <Link href="#" className='hover:text-gray-300 transition-colors'>Help</Link>
            <Link href="https://www.linkedin.com/in/mandeepyadav27/" target="_blank" className='hover:text-gray-300 transition-colors'>Contact</Link>
          </nav>
        </div>
        <div className='border-t border-zinc-600 py-4 text-sm text-center'>
          <p>&copy; {new Date().getFullYear()} Abhyudaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer