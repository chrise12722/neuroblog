import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from 'next/navigation';
import { ChevronLeft } from "lucide-react";
import { getBlogById } from "@/app/utils/supabase";
import { DeleteButton } from '@/components/DeleteButton';

export default async function UserBlog({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser()
  if (!user) {
    return <div className='text-center font-bold'>User Not Authenticated</div>
  }
  const resolvedParams = await params;
  const blogId = Number(resolvedParams.id);
  const currentBlog = await getBlogById(blogId, user.id);

  if (!currentBlog.content || !currentBlog.image_url) {
    return notFound();
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
        <div className='flex flex-row gap-1 mb-1'>
          <DeleteButton blogId={blogId} userId={user.id} />
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