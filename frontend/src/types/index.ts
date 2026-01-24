export interface User {
  user_id: number;
  username: string;
  created_at: string;
}

export interface Module {
  module_id: number;
  module_title: string;
  description: string;
}

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  body: string;
  module_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  like_count: number;
  comment_count: number;
}

export interface Comment {
  comment_id: number;
  post_id: number;
  user_id: number;
  body: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  like_count: number;
}
