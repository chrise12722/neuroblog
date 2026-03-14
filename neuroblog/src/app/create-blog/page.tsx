"use client";
import React from 'react';
import { useActionState } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { FormSubmitButton } from '../../components/FormSubmitButton';
import { createCompletion } from '../actions';
import { toast } from 'sonner';


export default function CreateBlog() {
  const [blogContent, setBlogContent] = useState<string>('');
  const [blogImage, setBlogImage] = useState<string>('');

  const [, formAction] = useActionState(action, null);

  async function action(prevState: unknown, formData: FormData) {
    const topic = formData.get('blogTopic');
    const keywords = formData.get('blogKeywords');
    const length = formData.get('blogLength');
    const result = await createCompletion(topic as string, keywords as string, length as string);
    if (result && 'error' in result) {
      toast.error(result.error);
    }

    if (result && Array.isArray(result)) {
      setBlogContent(result[0]?.content || '');
      setBlogImage(result[0].image_url || '');
      toast('Blog has been generated and saved');
    }
  }

  return (
    <div className='mt-10 px-4 sm:px-6 flex flex-col lg:flex-row gap-6 items-start'>
      <div className={`w-full ${blogContent ? 'lg:w-72 lg:shrink-0' : 'lg:max-w-md lg:mx-auto'}`}>
        <h1 className='font-bold text-4xl mb-6'>Create a Blog</h1>
        <form className='flex flex-col gap-4' action={formAction}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='blogTopic' className='text-sm font-medium'>Blog Topic</label>
            <input
              id='blogTopic'
              type='text'
              name='blogTopic'
              required
              placeholder='e.g. The future of AI in healthcare'
              className='border rounded-lg px-3 py-2 bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='blogKeywords' className='text-sm font-medium'>
              Keywords <span className='text-muted-foreground font-normal'>(optional)</span>
            </label>
            <input
              id='blogKeywords'
              type='text'
              name='blogKeywords'
              placeholder='e.g. machine learning, diagnosis, data'
              className='border rounded-lg px-3 py-2 bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='blogLength' className='text-sm font-medium'>Length</label>
            <select
              id='blogLength'
              name='blogLength'
              required
              className='border rounded-lg px-3 py-2 bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition cursor-pointer'
            >
              <option value='short'>Short — under 300 words</option>
              <option value='medium'>Medium — under 600 words</option>
              <option value='long'>Long — under 1000 words</option>
            </select>
          </div>

          <FormSubmitButton />
        </form>
      </div>

      {blogContent && (
        <div className='w-full min-w-0 border rounded-xl bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-4 duration-300'>
          {blogImage && (
            <div className='flex justify-center pt-6 px-6'>
              <Image
                src={blogImage}
                width={500}
                height={500}
                className='rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-lg'
                alt='Blog cover image'
              />
            </div>
          )}
          <div className='p-5 sm:p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-muted-foreground uppercase tracking-wide'>Generated Blog</h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(blogContent);
                  toast('Copied to clipboard');
                }}
                className='text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1 cursor-pointer'
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect width='14' height='14' x='8' y='8' rx='2' ry='2' /><path d='M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' />
                </svg>
                Copy
              </button>
            </div>
            <div className='prose'>
              <ReactMarkdown>{blogContent}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
