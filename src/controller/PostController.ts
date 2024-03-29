import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import {
  CreatePostInputDTO,
  DeletePostInputDTO,
  GetPostsInputDTO,
  LikeOrDislikePostInputDTO,
} from "../dtos/userDTO";
import { BaseError } from "../errors/BaseError";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input: GetPostsInputDTO = {
        token: req.headers.authorization,
      };

      const output = await this.postBusiness.getPosts(input);

      res.status(200).send(output);
    } catch (error) {
      if (error instanceof BaseError) {
        console.log(error);
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input: CreatePostInputDTO = {
        token: req.headers.authorization,
        content: req.body.content,
      };

      const output = await this.postBusiness.createPost(input);

      res.status(201).end(output);
    } catch (error) {
      if (error instanceof BaseError) {
        console.log(error);
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input: DeletePostInputDTO = {
        idToDelete: req.params.id,
        token: req.headers.authorization,
      };

      await this.postBusiness.deletePost(input);

      res.status(200).end();
    } catch (error) {
      if (error instanceof BaseError) {
        console.log(error);
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input: LikeOrDislikePostInputDTO = {
        idToLikeOrDislike: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      };

      await this.postBusiness.likeOrDislikePost(input);

      res.status(200).end();
    } catch (error) {
      if (error instanceof BaseError) {
        console.log(error);
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
