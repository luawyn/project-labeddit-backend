import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import {
  CreateCommentInput,
  CreateCommentOutput,
  DeleteCommentInput,
  DeleteCommentOutput,
  GetCommentsByPostIdInput,
  GetCommentsByPostOutput,
  LikeOrDislikeCommentInput,
} from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  CommentWithCreatorDB,
  LIKED_DISLIKED,
  LikeDislikeCommentDB,
} from "../types";

export class CommentBusiness {
  constructor(
    private commentDatabase: CommentDatabase,
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getComments = async (
    input: GetCommentsByPostIdInput
  ): Promise<GetCommentsByPostOutput> => {
    const { postId, token } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (typeof postId !== "string") {
      throw new BadRequestError("'postId' deve ser string");
    }

    const postDB = await this.postDatabase.findById(postId);

    if (!postDB) {
      throw new BadRequestError("Post não encontrado");
    }

    const commentsDB = await this.commentDatabase.getCommentsByPostId(
      postDB.id
    );

    const commentsWithCreatorDB: CommentWithCreatorDB[] =
      await this.commentDatabase.getCommentWithCreatorByPostId(postId);

    const comments = commentsWithCreatorDB.map((commentDB) => {
      const comment = new Comment(
        commentDB.id,
        commentDB.post_id,
        commentDB.creator_id,
        commentDB.likes,
        commentDB.dislikes,
        commentDB.created_at,
        commentDB.content,
        commentDB.creator_name
      );

      return comment.toBusinessModel();
    });

    return comments;
  };

  public createComment = async (
    input: CreateCommentInput
  ): Promise<CreateCommentOutput> => {
    const { postId, content, token } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const postDB = await this.postDatabase.findById(postId);

    if (!postDB) {
      throw new BadRequestError("Post não encontrado");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (typeof postId !== "string") {
      throw new BadRequestError("'postId' deve ser string");
    }

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string");
    }

    const id = this.idGenerator.generate();
    const createdAt = new Date().toISOString();
    const creatorId = payload.id;
    const creatorName = payload.name;

    const comment = new Comment(
      id,
      postId,
      creatorId,
      0,
      0,
      createdAt,
      content,
      creatorName
    );

    const commentDB = comment.toDBModel();

    const post = { ...postDB, comments: postDB.comments + 1 };

    await this.postDatabase.update(postId, post);

    await this.commentDatabase.createComment(commentDB);

    const output: CreateCommentOutput = {
      message: "Comentário criado com sucesso",
    };

    return output;
  };

  public deleteComment = async (
    input: DeleteCommentInput
  ): Promise<DeleteCommentOutput> => {
    const { token, idToDelete } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (typeof idToDelete !== "string") {
      throw new BadRequestError("'idToDelete' deve ser string");
    }

    const commentDB = await this.commentDatabase.getCommentById(idToDelete);

    console.log(payload.id);
    console.log(commentDB.creator_id);

    if (!commentDB) {
      throw new BadRequestError("Comentário não encontrado");
    }

    if (
      commentDB.creator_id !== payload.id &&
      !["ADMIN"].includes(payload.role)
    ) {
      throw new BadRequestError(
        "Somente o criador do comentário pode deletá-lo"
      );
    }

    await this.commentDatabase.deleteCommentById(idToDelete);

    const output = {
      message: "Comentário deletado com sucesso",
    };

    return output;
  };

  public likeOrDislikeComment = async (input: LikeOrDislikeCommentInput) => {
    const { idToLikeOrDislike, token, like } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    if (typeof like !== "boolean") {
      throw new BadRequestError("'like' deve ser boolean");
    }

    const commentDB = await this.commentDatabase.getCommentById(
      idToLikeOrDislike
    );

    if (!commentDB) {
      throw new BadRequestError("Comentário não encontrado");
    }

    const postId = await this.commentDatabase.getIdPostByCommentId(
      idToLikeOrDislike
    );

    const likeSQLITE = like ? 1 : 0;

    const userId = payload.id;

    const likeDislikeDB: LikeDislikeCommentDB = {
      user_id: userId,
      post_id: postId[0].post_id,
      comment_id: idToLikeOrDislike,
      like: likeSQLITE,
    };

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.creator_id,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.content,
      commentDB.creator_name
    );

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === LIKED_DISLIKED.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeLike();
      } else {
        await this.commentDatabase.addLikeDislike(likeDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeDislikeExists === LIKED_DISLIKED.ALREADY_DISLIKED) {
      if (like) {
        await this.commentDatabase.addLikeDislike(likeDislikeDB);
        comment.removeDislike();
        comment.addLike();
      } else {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeDislike();
      }
    } else {
      await this.commentDatabase.likeOrDislikeComment(likeDislikeDB);

      like ? comment.addLike() : comment.addDislike();
    }

    const newComment = comment.toDBModel();

    await this.commentDatabase.updateComment(idToLikeOrDislike, newComment);
  };
}
