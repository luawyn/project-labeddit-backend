export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export enum LIKED_DISLIKED {
  ALREADY_LIKED = "ALREADY LIKED",
  ALREADY_DISLIKED = "ALREADY DISLIKED",
}

export interface TokenPayload {
  id: string;
  name: string;
  role: USER_ROLES;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export interface UserDB {
  id: string;
  name: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface PostModel {
  id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface PostDB {
  id: string;
  creator_id: string;
  content: string;
  comments: number;
  likes: number;
  dislikes: number;
  created_at: string;
}

export interface PostWithCreatorsDB extends PostDB {
  creator_name: string;
}

export interface LikeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export interface CommentDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  post_id: string;
}

export interface LikeDislikeCommentDB {
  user_id: string;
  post_id: string;
  comment_id: string;
  like: number;
}

export interface CommentModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  postId: string;
  creator: {
    creatorId: string;
    name: string;
  };
}

export interface CommentWithCreatorDB extends CommentDB {
  creator_name: string;
}
