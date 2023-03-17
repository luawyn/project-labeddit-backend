import { CommentModel, PostModel } from "../types";

export interface SignupInputDTO {
  name: unknown;
  email: unknown;
  password: unknown;
}

export interface SignupOutputDTO {
  token: string;
}

export interface LoginInputDTO {
  email: unknown;
  password: unknown;
}

export interface LoginOutputDTO {
  token: string;
}

export interface GetPostsInputDTO {
  token: string | undefined;
}

export type GetPostsOutputDTO = PostModel[];

export interface CreatePostInputDTO {
  token: string | undefined;
  content: string;
}

export interface DeletePostInputDTO {
  idToDelete: string;
  token: string | undefined;
}

export interface LikeOrDislikePostInputDTO {
  idToLikeOrDislike: string;
  token: string | undefined;
  like: unknown;
}

export interface GetCommentsByPostIdInput {
  postId: string;
  token: string | undefined;
}

export type GetCommentsByPostOutput = CommentModel[];

export interface CreateCommentInput {
  postId: string;
  content: string;
  token: string | undefined;
}

export interface CreateCommentOutput {
  message: string;
}

export interface DeleteCommentInput {
  idToDelete: string;
  token: string | undefined;
}

export interface DeleteCommentOutput {
  message: string;
}

export interface LikeOrDislikeCommentInput {
  idToLikeOrDislike: string;
  token: string | undefined;
  like: unknown;
}
