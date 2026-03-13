import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { toast } from "sonner";


const supabaseUrl = process.env.SUPABASE_PROJECT_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
    .select();
  
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
      .range(from, to);

    if (error) {
      console.log(error)
      return {error: "Failed to get all user blogs. Try again"};
    }
    return searchUserBlogs;
  }
  else {
    const {data: userBlogs,error} = await supabase
      .from('blogs')
      .select()
      .eq('user_id', user_id)
      .order('created_at', {ascending: false})
      .range(from, to);

    if (error) {
      console.log(error)
      return {error: "Failed to get all user blogs. Try again"};
    }
    return userBlogs;
  }
}

//Fetch indivdual user blog
export async function getBlogById(id: number, userId: string) {
  const {data, error} = await supabase
    .from('blogs')
    .select()
    .eq('id', id)
    .eq("user_id", userId)
    .single();
  if (!data) {
    toast("Blog not found. Please try again");
    redirect('/saved-blogs');
  }
  if (error) {
    return {error: "Blog not found. Please try again"};
  }
  return data;
}

//Fetch shared blog
export async function getSharedBlogById(id: number) {
  const {data,error} = await supabase
    .from('blogs')
    .select(`
      id,
      created_at,
      title,
      content,
      image_url,
      user_id,
      is_shared,
      likes,
      username,
      user_likes (
        id,
        user_id,
        blog_id
        )`
      )
    .eq('id', id)
    .single();

  if (error) {
    return {error: "Blog not found. Please try again"};
  }
  if (!data) {
    toast("Blog not found. Please try again");
    redirect('/explore-blogs');
  }
  return data;
}

//Fetch all shared blogs
export async function getAllSharedBlogs({
  query,
  page = 1,
  limit = 12,
  fetchLimit,
}: {
  query?: string;
  page?: number;
  limit?: number;
  fetchLimit?: number
}) {
  const pageSize = fetchLimit ?? limit;
  const from = (page - 1) * limit;
  const to = from + pageSize - 1;

  if(query) {
    const {data: searchSharedBlogs, error} = await supabase
      .from('blogs')
      .select('*')
      .eq('is_shared', true)
      .ilike('title', query)
      .order('likes', {ascending: false})
      .range(from, to);

    if (error) {
      console.log(error);
      return {error: "Failed to get all shared blogs. Try again"};
    }
    return searchSharedBlogs;
  }
  else {
    const {data: sharedBlogs, error} = await supabase
      .from('blogs')
      .select('*')
      .eq('is_shared', true)
      .order('likes', {ascending: false})
      .range(from, to);

    if (error) {
      console.log(error);
      return {error: "Failed to get all shared blogs. Try again"};
    }
    return sharedBlogs;
  }
}

//Checks if blog is marked as shared
export async function isBlogShared(id: number) {
  const {data} = await supabase
    .from('blogs')
    .select()
    .eq('id', id)
    .eq('is_shared', true);

  return data && data.length > 0;
}

//Check blog's like count
export async function viewLikes(blogId: number) {
  const {data, error} = await supabase
    .from('blogs')
    .select('likes')
    .eq('id', blogId)
    .single();

  if (error) {
    console.log(error);
  }
  else if (!data) {
    return 0;
  }
  return data?.likes || 0
}

//Add like to database
export async function incrementLikes(blogId: number, userId: string) {
  const {error: likeError} = await supabase.rpc('increment_blog_likes', {blogid: blogId})

  if (likeError) {
    console.log(likeError);
    return {error: 'Unable to like blog post. Please try again'};
  }

  const {error: recordError} = await supabase
    .from('user_likes')
    .insert([{ user_id: userId, blog_id: blogId }])
  
  if (recordError) {
    console.log(recordError);
    return {error: 'Unable to record like. Please try again'};
  }
  return {success: true}
}

//Remove like from database
export async function decrementLikes(blogId: number, userId: string) {
  const {error: likeError} = await supabase.rpc('decrement_blog_likes', {blogid: blogId});

  if (likeError) {
    console.log(likeError);
    return {error: 'Failed to decrease like. Please try again'};
  }

  const {error: recordError} = await supabase
    .from('user_likes')
    .delete()
    .eq('user_id', userId)
    .eq('blog_id', blogId);

  if (recordError) {
    console.log(recordError);
    return {error: 'Failed to delete like. Please try again'};
  }
  return {success: true}
}

//Get all blog IDs liked by a user from a given list
export async function getUserLikedBlogIds(userId: string, blogIds: number[]): Promise<number[]> {
  const { data, error } = await supabase
    .from('user_likes')
    .select('blog_id')
    .eq('user_id', userId)
    .in('blog_id', blogIds);

  if (error) {
    console.log(error);
    return [];
  }
  return data ? data.map((row) => row.blog_id) : [];
}

//Check if user has liked a blog
export async function isBlogLiked(blogId: number, userId: string) {
  const {data, error} = await supabase
    .from('user_likes')
    .select()
    .eq('user_id', userId)
    .eq('blog_id', blogId)

  if (error) {
    console.log(error)
  }
  return data && data.length > 0
}