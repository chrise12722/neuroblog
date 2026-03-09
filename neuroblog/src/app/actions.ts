"use server"
import { currentUser } from '@clerk/nextjs/server';
import { ChatCompletion } from 'openai/resources/chat/completions';
import openai from './utils/openai';
import { createBlog, uploadImage } from './utils/supabase';
import { supabase } from './utils/supabase';
import { BlogStructure } from './interfaces';

export async function createCompletion(topic: string, keywords: string, length: string) {
  const user = await currentUser();
  if (!user) {
    return {error: 'User not authenticated'};
  }

  //Generate blog post using openai
  const completion: ChatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
     {
        role: 'user',
        content: `Write an SEO-optimized blog post about the following topic: ${topic}. The blog should clearly explain the topic and include relevant information, context,
                  and insights typical of a high-quality blog post. If any keywords are provided, be sure to incorporate and discuss them naturally: ${keywords} (ignore if empty).
                  The desired length is: ${length}. Use the following guidelines: Short: ≤ 300 words; Medium: 301 to 600 words; Long: 601 to 1000 words.
                  Format the response in Markdown, and make only the blog title bold. Do not include any extra text before or after the post.`,
      }
    ],
  });

  const response = completion.choices[0].message.content;
  if (!response) {
    return {error: 'Unable to generate the blog content.'};
  }

  //Generate image using openai
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Create a high-quality blog cover image that visually represents this topic: "${topic}`,
    n: 1,
    size: '1792x1024'
  });

  const imageUrl = image?.data?.[0]?.url;
  if (!imageUrl) {
    return {error: 'Unable to generate the blog image.'};
  }
  //Download image from DALL-E 3
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  //Upload to supabase storage
  const permanentimage_url = await uploadImage(imageBuffer)
  if (!permanentimage_url || typeof permanentimage_url !== 'string') {
    return {error: 'Unable to upload the blog image.'};
  }
  //Create new blog post in supabase
  if (!user.username) {
    return {error: 'User username is missing.'};
  }
  const blog = await createBlog(topic, response, permanentimage_url, user.id, user.username)
  return blog;
}

//Delete blog from database
export async function deleteBlog(blogId: number, userId: string) {
  const {error: deleteError} = await supabase
    .from('blogs')
    .delete()
    .eq('id', blogId)
    .eq('user_id', userId)

  if (deleteError) {
    console.log(deleteError);
    return {error: 'Unable to delete blog post. Please try again'};
  }
}

//Make blog publicily available
export async function shareBlog(blog: BlogStructure) {
  const {error: shareError} = await supabase
    .from('blogs')
    .update({is_shared: true})
    .eq('id', blog.id)

  if (shareError) {
    return {error: "Failed to share blog. Please try again"};
  }
  return {success: true};
}

//Make blog private
export async function unshareBlog(blog: BlogStructure) {
  const {error: unshareError} = await supabase
    .from('blogs')
    .update({is_shared: false})
    .eq('id', blog.id)

  if (unshareError) {
    console.log(unshareError)
    return {error: "Unable to unshare blog. Please try again"};
  }
  return {success: true};
}
