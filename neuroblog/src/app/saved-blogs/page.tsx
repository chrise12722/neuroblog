import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { getAllUserBlogs } from '../utils/supabase';
import { BlogStructure } from "../interfaces";

export default async function SavedBlogs() {
  const user = await currentUser();
  if (!user) {
    return { error: 'User not authenticated' };
  }

  const blogs = await getAllUserBlogs(user.id)

  return (
    <>
      <div className='mt-5 ml-5 sm:flex sm:justify-between mr-2'>
        <h1 className='font-bold text-2xl/6 md:text-3xl lg:text-4xl'>View Saved Blogs</h1>
      </div>
      <div className='flex flex-row flex-wrap m-2 relative min-h-[50vh]'>
        {Array.isArray(blogs) && blogs.length > 0 ? (
          blogs?.map((blog: BlogStructure) => (
            <Card key={blog.id} className='overflow-hidden w-full sm:w-1/2 xl:w-1/3 2xl:w-1/4'>
              <CardContent className='p-0'>
                <Link href={`/blog/${blog.id}`} key={blog.id}>
                  <Image
                    alt=''
                    src={blog.image_url}
                    width={400}
                    height={400}
                    className='w-full'
                  />
                  <div className='px-4 pb-3 pt-2'>
                    <h3 className='font-medium'>{blog.title}</h3>
                    <p className='text-xs text-gray-600'>
                      {formatDate(String(blog.created_at))}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <h1 className='text-2xl'>Content Not Found</h1>
          </div>
        )}
      </div>
    </>
  );
}
