import React from 'react';
import Image from 'next/image';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { getSharedBlogById } from '@/app/utils/supabase';

export default async function SharedBlog({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) {
    return <div className="text-center font-bold">User not authenticated</div>
  }

  const blogId = Number(id);
  const currentBlog = await getSharedBlogById(blogId);

  if (!currentBlog.content || !currentBlog.image_url) {
    notFound();
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-6'>
      <div className='flex justify-between mr-2 mt-2'>
        <Link
          href='/saved-blogs'
          className='inline-flex items-center text-sm font-light text-gray-500 hover:text-gray-800 mb-6'
        >
          <ChevronLeft strokeWidth={1} size={20} />
          <span>Go Back</span>
        </Link>
        <div className='mb-1'>
          {/* Like Button Goes Here */}
        </div>
      </div>
      <div className='relative w-full aspect-video mb-8 rounded-lg overflow-hidden'>
        <Image
          src={currentBlog.image_url}
          fill
          sizes='(max-width: 768px) 100vw, 768px'
          className='object-cover'
          alt=''
        />
      </div>
      <article className='prose prose-neutral max-w-none pb-12'>
        <Markdown>{currentBlog.content}</Markdown>
      </article>
    </div>
  )
}