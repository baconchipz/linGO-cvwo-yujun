export interface User {
    id: number;
    name: string;
    major: string;
    year: number;
}

export interface ApiResponse<T> {
    payload: {
        data: T;
    }
    messages: string[];
    errorCode: number;
}

export interface Post {
  post_id: number;
  user_id: number;
  title: string;
  body: string;
  module_id: number;
  created_at: string;
  updated_at: string;
  like_count: number;
}

//create a typescript interface, giving me autocomplete and type safety
//when working with API responses that return a list of users