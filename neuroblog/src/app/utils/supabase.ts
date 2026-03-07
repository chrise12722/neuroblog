import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";


const supabaseUrl = process.env.SUPABASE_PROJECT_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

//Upload image to supabase storage
export async function uploadImage(imageBuffer: Buffer) {
  const imageName = `blog-${Date.now()}.png`;
  const {data, error} = await supabase.storage
    .from('aiimage')
    .upload(imageName, imageBuffer, {
      contentType: 'image/png'
    });

    if (error) {
      return(error);
    }

    const path = data?.path;
    return `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/aiimage/${path}`;
}

//Create new blog post
export async function createBlog(title: string, content: string, image_url: string, user_id: string, username: string) {
  const {data: blog, error: blogError} = await supabase
    .from('blogs')
    .insert([{title: title, content: content, image_url: image_url, user_id: user_id, username: username}])
    .select()
  
    if(blogError) {
      return{error: 'Unable to create blog post.'};
    }
    return blog;
}

//Returns all user blogs
export async function getAllUserBlogs({
  user_id,
  query,
  page = 1,
  limit = 12,
  fetchLimit,
} : {
  user_id: string
  query?: string;
  page?: number
  limit?: number
  fetchLimit?: number
}) {
  const pageSize = fetchLimit ?? limit;
  const from = (page - 1) * limit;
  const to = from + pageSize - 1;

  if(query) {
    const {data: searchUserBlogs, error} = await supabase
      .from('blogs')
      .select()
      .eq('user_id', user_id)
      .ilike('title', query)
      .order('created_at', {ascending: false})
      .range(from, to)

    if(error) {
      console.log(error)
      return {error: "Failed to get all user blogs. Try again"}
    }
    return searchUserBlogs
  }
  else {
    const {data: userBlogs,error} = await supabase
      .from('blogs')
      .select()
      .eq('user_id', user_id)
      .order('created_at', {ascending: false})
      .range(from, to)

      if(error) {
        console.log(error)
        return {error: "Failed to get all user blogs. Try again"}
      }

    return userBlogs
  }
}

//Fetch indivdual user blog
export async function getBlogById(id: number, userId: string) {
  const {data, error} = await supabase
    .from('blogs')
    .select()
    .eq('id', id)
    .single()
  if (!data) {
    redirect('/')
  }
  if (error) {
    return {error: "Blog not found. Please try again"}
  }
  return data
}