import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { Card, CardContent } from "@/components/ui/card";
import { getAllSharedBlogs } from "./utils/supabase";
import { formatDate } from "@/lib/utils";
import { viewLikes } from "./utils/supabase";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();
  const blogs = await getAllSharedBlogs({ limit: 3 });
  return (
    <>
      <div className='mx-4 mt-4'>
        <div className='sm:flex sm:flex-row sm:justify-between'>
          <h1 className='font-bold text-4xl'>NeuroBlog</h1>
        </div>
        <div className='h-40 mt-16 flex flex-col gap-4 justify-center items-center' >
          <TypingAnimation className='text-center text-2xl font-light md:text-3xl pt-4'>Get Started With Generating AI Blogs Today</TypingAnimation>
          <div className='text-lg py-3 px-3 rounded text-black font-extrabold hover:border-blue-500 hover:bg-blue-500 hover:text-white transition duration-750 animate-bounce cursor-pointer'>
            {!user && (
              <SignInButton>
                <button className='cursor-pointer'>&rarr; Sign In</button>
              </SignInButton>
            )}
            {user && (
              <Link
                href='/create-blog'
              >
                &rarr; Create a Blog
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className='mt-8 mx-4'>
        <h2 className='text-xl min-[400px]:text-2xl md:text-3xl font-bold mb-4'>Check Out the Most Popular Generated Blogs</h2>
        <div className='flex flex-row flex-wrap m-2 relative'>
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map(blog => (
              <Card key={blog.id} className='overflow-hidden w-full mb-1 sm:w-1/2 md:w-1/3'>
                <CardContent className='p-0'>
                  <Link href={`/explore-blogs/${blog.id}`} key={blog.id}>
                    <Image
                      alt=''
                      src={blog.image_url}
                      width={400}
                      height={400}
                      className='w-full'
                    />
                    <div className='px-4 pb-3 pt-2'>
                      <h3 className='font-medium'>{blog.title}</h3>
                      <p className='text-sm'>
                        👤: {blog.username}
                      </p>
                      <p className='text-xs text-gray-600'>
                        {formatDate(blog.created_at)}
                      </p>
                      <p className='text-s'>{viewLikes(blog.id)} ❤️</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>))
          ) : (
            <p>Content Not Found</p>
          )}
        </div>
      </div>
    </>
  );
}
