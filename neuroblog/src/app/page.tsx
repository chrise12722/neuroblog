import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { getAllSharedBlogs } from "./utils/supabase";
import { formatDate } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default async function Home() {
  const user = await currentUser();
  const blogs = await getAllSharedBlogs({ limit: 3 });

  const featuredBlog = Array.isArray(blogs) && blogs.length > 0 ? blogs[0] : null;
  const sideBlogs = Array.isArray(blogs) ? blogs.slice(1) : [];

  return (
    <>
      <section className="relative overflow-hidden bg-white text-slate-900 border-b border-slate-100">

        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              NeuroBlog
            </span>
          </h1>

          <TypingAnimation className="text-xl md:text-2xl text-slate-500 font-light mb-10 max-w-2xl mx-auto duration-50">
            Your idea. One click. A blog post worth reading.
          </TypingAnimation>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!user ? (
              <SignInButton>
                <button className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105">
                  Get Started Free &rarr;
                </button>
              </SignInButton>
            ) : (
              <Link
                href="/create-blog"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105"
              >
                Create a Blog &rarr;
              </Link>
            )}
            <Link
              href="/explore-blogs"
              className="text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 px-8 py-3 rounded-full transition-all duration-200 hover:bg-slate-100"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "✏️",
                title: "Choose a Topic",
                desc: "Enter any subject — from tech deep dives to travel guides. The more specific, the better.",
              },
              {
                step: "02",
                icon: "🤖",
                title: "AI Writes It",
                desc: "Our AI generates a structured, well-written blog post tailored to your topic in seconds.",
              },
              {
                step: "03",
                icon: "🌍",
                title: "Share It",
                desc: "Publish to the community, collect likes, and inspire other readers around the world.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <span className="absolute top-4 right-4 text-xs font-mono text-slate-200">{step}</span>
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Most Popular Blogs</h2>
              <p className="text-slate-500 mt-1 text-sm">Community favorites, AI-crafted</p>
            </div>
            <Link
              href="/explore-blogs"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          {featuredBlog ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Link
                href={`/explore-blogs/${featuredBlog.id}`}
                className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-md block min-h-72"
              >
                <Image
                  alt={featuredBlog.title}
                  src={featuredBlog.image_url}
                  width={800}
                  height={500}
                  className="w-full h-72 lg:h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{featuredBlog.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span>{featuredBlog.username}</span>
                    <span>·</span>
                    <span>{formatDate(featuredBlog.created_at)}</span>
                  </div>
                </div>
              </Link>
              <div className="flex flex-col gap-6">
                {sideBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/explore-blogs/${blog.id}`}
                    className="relative rounded-2xl overflow-hidden shadow-md block flex-1"
                  >
                    <Image
                      alt={blog.title}
                      src={blog.image_url}
                      width={400}
                      height={300}
                      className="w-full h-44 object-cover "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{blog.title}</h3>
                      <p className="text-xs text-slate-300">{blog.username} · {formatDate(blog.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-slate-500">No blogs yet — be the first to create one!</p>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/explore-blogs" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all blogs &rarr;
            </Link>
          </div>
        </div>
      </section>
      {!user && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-center text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to write your first blog?</h2>
            <p className="text-blue-100 mb-6">Join the community and start generating AI blogs for free.</p>
            <SignInButton>
              <button className="cursor-pointer bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-105 shadow-md">
                Start Writing Now
              </button>
            </SignInButton>
          </div>
        </section>
      )}
    </>
  );
}
