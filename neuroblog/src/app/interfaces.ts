export interface BlogStructure {
  id: number;
  created_at: EpochTimeStamp;
  title: string;
  content: string;
  image_url: string;
  user_id: string;
}