'use client'
import React from 'react';
import { useFormStatus } from 'react-dom';

export const FormSubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button type='submit' className='mt-5 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-1 sm:px-4 border-b-04 border-blue-700 hover:border-blue-500 rounded cursor-pointer'>
      {pending ? (
        <div className='flex flex-row items-center'>
          Generating
          <svg className='ml-1 size-5 animate-spin stroke-white' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <circle cx='12' cy='12' fill='none' r='10' strokeWidth='2' stroke='#E387FF' strokeDasharray='20 40' strokeLinecap='round' />
          </svg>
        </div>
      ) : 'Generate Blog'}
    </button>
  );
}