'use client'
import { useState } from "react";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Navigation = () => {
  const pathname = usePathname();

  const [isClick, setisClick] = useState(false);

  const toggleNavbar = (): void => {
    setisClick(!isClick)
  }
  return (
    <>
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href={'/'}>
                  <Image
                    src="/images/logo.png"
                    alt="Site logo"
                    width={90}
                    height={90}
                  />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="flex max-w-full items-center space-x-4">
                <Link href="/" className={pathname === "/" ? "font-bold mr-8" : "mr-8 text-black hover-text-blue-100 transiton duration-200 hover:scale-105"}>
                  Home
                </Link>
                <Link href="/explore-blogs" className={pathname === "/explore-blogs" ? "font-bold mr-8" : "mr-8 text-black hover-text-blue-100 transiton duration-200 hover:scale-105"}>
                  Explore Blogs
                </Link>
                <Link href="/saved-blogs" className={pathname === "/saved-blogs" ? "font-bold mr-8" : "mr-8 text-black hover-text-blue-100 transiton duration-200 hover:scale-105"}>
                  Saved Blogs
                </Link>
                <Link href="/create-blog" className={pathname === "/create-blog" ? "font-bold mr-8" : "mr-8 text-black hover-text-blue-100 transiton duration-200 hover:scale-105"}>
                  Create Blog
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={toggleNavbar}>
                {isClick ? (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6m6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isClick && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className={`${pathname === "/" ? "font-bold mr-8" : "mr-8 text-black"} block`}>
                Home
              </Link>
              <Link href="/explore-blogs" className={`${pathname === "/explore-blogs" ? "font-bold mr-8" : "mr-8 text-black"} block`}>
                Explore Blogs
              </Link>
              <Link href="/saved-blogs" className={`${pathname === "/saved-blogs" ? "font-bold mr-8" : "mr-8 text-black"} block`}>
                Saved Blogs
              </Link>
              <Link href="/create-blog" className={`${pathname === "/create-blog" ? "font-bold mr-8" : "mr-8 text-black"} block`}>
                Create Blog
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}