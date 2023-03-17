import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const commentRouter = express.Router();

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
);

commentRouter.get("/:id", commentController.getComments);
commentRouter.post("/:id", commentController.createComment);
commentRouter.delete("/:id", commentController.deleteComment);
commentRouter.put("/:id/like", commentController.likeOrDislikeComment);
