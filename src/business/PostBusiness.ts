import { PostDatabase } from "../database/PostDatabase";
import {
  GetPostsOutputDTO,
  GetPostsInputDTO,
  CreatePostInputDTO,
  DeletePostInputDTO,
  LikeOrDislikePostInputDTO,
} from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import {
  LikeDislikeDB,
  LIKED_DISLIKED,
  PostWithCreatorsDB,
  USER_ROLES,
} from "../types";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { token } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token invalido");
    }

    const postsWithCreatorsDB: PostWithCreatorsDB[] =
      await this.postDatabase.getPostsWithCreators();
    console.log("aqui");

    const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
      const post = new Post(
        postWithCreatorDB.id,
        postWithCreatorDB.content,
        postWithCreatorDB.comments,
        postWithCreatorDB.likes,
        postWithCreatorDB.dislikes,
        postWithCreatorDB.created_at,
        postWithCreatorDB.creator_id,
        postWithCreatorDB.creator_name
      );
      return post.toBusinessModel();
    });

    const output: GetPostsOutputDTO = posts;
    return output;
  };

  public createPost = async (input: CreatePostInputDTO): Promise<void> => {
    const { token, content } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token invalido");
    }

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string");
    }

    const id = this.idGenerator.generate();
    const createdAt = new Date().toISOString();
    const creatorId = payload.id;
    const creatorName = payload.name;

    const post = new Post(
      id,
      content,
      0,
      0,
      0,
      createdAt,
      creatorId,
      creatorName
    );

    const postDB = post.toDBModel();

    await this.postDatabase.insert(postDB);
  };

  public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
    const { idToDelete, token } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token invalido");
    }

    const postDB = await this.postDatabase.findById(idToDelete);

    if (!postDB) {
      throw new NotFoundError("'id' nao encontrado");
    }

    const creatorId = payload.id;

    if (payload.role !== USER_ROLES.ADMIN && postDB.creator_id !== creatorId) {
      throw new BadRequestError("Somente quem criou o post pode deleta-lo");
    }

    await this.postDatabase.delete(idToDelete);
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<void> => {
    const { idToLikeOrDislike, token, like } = input;

    if (token === undefined) {
      throw new BadRequestError("token ausente");
    }

    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token invalido");
    }

    if (typeof like !== "boolean") {
      throw new BadRequestError("'like' deve ser boolean");
    }

    const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(
      idToLikeOrDislike
    );

    if (!postWithCreatorDB) {
      throw new NotFoundError("'id' nao encontrado");
    }

    const userId = payload.id;
    const likeSQL = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: userId,
      post_id: postWithCreatorDB.id,
      like: likeSQL,
    };

    const post = new Post(
      postWithCreatorDB.id,
      postWithCreatorDB.content,
      postWithCreatorDB.comments,
      postWithCreatorDB.likes,
      postWithCreatorDB.dislikes,
      postWithCreatorDB.created_at,
      postWithCreatorDB.creator_id,
      postWithCreatorDB.creator_name
    );

    const likeDislikeExists = await this.postDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === LIKED_DISLIKED.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeLike();
        post.addDislike();
      }
    } else if (likeDislikeExists === LIKED_DISLIKED.ALREADY_DISLIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB);
        post.removeDislike();
        post.addLike();
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB);
        post.removeDislike();
      }
    } else {
      await this.postDatabase.likeOrDislikePost(likeDislikeDB);

      like ? post.addLike() : post.addDislike();
    }

    const updatedPostDB = post.toDBModel();

    await this.postDatabase.update(idToLikeOrDislike, updatedPostDB);
  };
}
