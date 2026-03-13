export interface BlogStructure {
  id: number;
  created_at: EpochTimeStamp;
  title: string;
  content: string;
  image_url: string;
  user_id: string;
  username: string;
  likes: number;
  is_shared: boolean;
}

export interface LikeStructure {
  blog_id: number;
  id: number;
  user_id: string;
}