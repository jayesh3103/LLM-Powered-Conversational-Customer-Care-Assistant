"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState,useEffect } from 'react';

const Nav = () => {
  const [toggleDropdown,setToggleDropdown]=useState(false);
  return (
    <nav className='flex-between w-full mb-16 pt-3 z-50 relative' >
        <Link href="/" className='flex gap-2 flex-center group'>
            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-neon-violet/50 group-hover:border-neon-cyan/50 transition-colors duration-300">
                <Image 
                src="/images/logo.png"
                alt="SahAIta Logo"
                fill
                className='object-cover'
                />
            </div>
            <p className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-violet to-neon-cyan tracking-wide group-hover:to-fuchsia-500 transition-all duration-300'>
            SahAIta
            </p>
        </Link>

        {/*Desktop Naviagtion */}
        <div className='sm:flex hidden'>
        <div className='flex gap-3 md:gap-5 items-center'>
              <Link href="/product-chat"
              className='px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10'>
                Product Chat 
              </Link>
              <Link href="/customer-care"
              className='px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10'>
                Customer Care 
              </Link>
              <Link href=""
              className='px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/10'>
                Dashboard
              </Link>
              <button type='button'  className='px-5 py-2 rounded-full text-sm font-medium text-neon-violet border border-neon-violet/50 hover:bg-neon-violet hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]'>
                Sign Out
              </button>
              
        </div>
          <div className='flex gap-5 md:gap-7 ml-4'>
              <Link href="">
                <div className="relative w-[37px] h-[37px] rounded-full overflow-hidden border border-white/20 hover:border-neon-cyan transition-colors duration-300">
                    <Image src="/images/user.jpeg"
                    fill
                    className='object-cover'
                    alt="profile"
                    />
                </div>
              </Link>
          </div>
          
        </div>
    </nav>
)
}

export default Nav
