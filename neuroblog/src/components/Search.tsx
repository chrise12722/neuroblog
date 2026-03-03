'use client'
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { usePathname } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export const Search = ({ search }: { search?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState(search ? search : '');
  const [query] = useDebounce(text, 750);
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (!query) {
      router.push(`${pathname}`);
    }
    else {
      router.push(`${pathname}?search=${text}`);
    }
  }, [query]);

  return (
    <div className='relative rounded-md shadow-sm'>
      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
        <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
      </div>
      <input
        name='search-input'
        value={text}
        placeholder={'Search Blogs'}
        onChange={e => setText(e.target.value)}
        className='block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300
        placeholder:text-gray-400 focus:ring02 focus:ring-sky-600 sm:text-sm sm:leading-6'
        suppressHydrationWarning
      />
    </div>
  );
}
export default Search