'use client'
import React from 'react';
import { BlogStructure } from '@/app/interfaces';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { shareBlog, unshareBlog } from '@/app/actions';

interface ShareButtonsProps {
  blog: BlogStructure
  isShared: boolean;
}

export const ShareButtons = ({ blog, isShared }: ShareButtonsProps) => {
  const router = useRouter();
  const handleShare = async () => {
    const result = await shareBlog(blog);
    if (result && result.error) {
      toast(result.error);
    } else {
      router.refresh();
      toast('Blog has been shared');
    }
  }
  const handleUnshare = async () => {
    const result = await unshareBlog(blog);
    if (result && result.error) {
      toast(result.error);
    } else {
      router.refresh();
      toast('Blog has been unshared');
    }
  }
  return (
    <>
      {!isShared && (
        <button className='rounded-xl bg-blue-500 hover:bg-blue-400 text-white p-2 sm:p-3 cursor-pointer' onClick={handleShare}>
          Share Blog
        </button>
      )}

      {isShared && (
        <button className='rounded-xl bg-blue-500 hover:bg-blue-400 text-white p-2 sm:p-3 cursor-pointer' onClick={handleUnshare}>
          Unshare Blog
        </button>
      )}
    </>
  )
}
