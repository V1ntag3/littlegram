import { v4 } from 'uuid';

import { PostEvaluation } from '@models/entities/PostEvaluation';

import { IShowByPostIdPaginatedDTO } from '@models/dtos/IShowByPostIdPaginatedDTO';
import { IPostsEvaluationsRepository } from '../interfaces/IPostsEvaluationRepository';

class FakePostsEvaluationRepository implements IPostsEvaluationsRepository {
  private postsEvaluation: PostEvaluation[] = [];

  public async findById(id: string): Promise<PostEvaluation | null> {
    const findPostEvaluation = this.postsEvaluation.find(
      postEvaluation => postEvaluation.id === id,
    );

    return findPostEvaluation || null;
  }

  public async findByPostId(postId: string): Promise<PostEvaluation[]> {
    const findPostEvaluations = this.postsEvaluation.filter(
      postEvaluation => postEvaluation.postId === postId,
    );

    return findPostEvaluations;
  }

  public async findByPostIdPaginated(
    data: IShowByPostIdPaginatedDTO,
  ): Promise<PostEvaluation[]> {
    const findPostsEvaluation = this.postsEvaluation.filter(
      postEvaluation => postEvaluation.postId === data.postId,
    );

    const skip = data.offset * data.limit;
    const take = data.limit;

    const postsEvaluation = findPostsEvaluation.slice(skip, skip + take);

    return postsEvaluation;
  }

  public async findByUserId(userId: string): Promise<PostEvaluation[] | null> {
    const findPostEvaluations = this.postsEvaluation.filter(
      postEvaluation => postEvaluation.userId === userId,
    );

    return findPostEvaluations || null;
  }

  public async findByUserIdAndPostId(
    userId: string,
    postId: string,
  ): Promise<PostEvaluation | null> {
    const findPostEvaluation = this.postsEvaluation.find(
      postEvaluation =>
        postEvaluation.userId === userId && postEvaluation.postId === postId,
    );

    return findPostEvaluation || null;
  }

  public async create(
    postEvaluationData: PostEvaluation,
  ): Promise<PostEvaluation> {
    const postEvaluation = new PostEvaluation();

    Object.assign(postEvaluation, { id: v4() }, postEvaluationData);

    this.postsEvaluation.push(postEvaluation);

    return postEvaluation;
  }

  public async save(postEvaluation: PostEvaluation): Promise<PostEvaluation> {
    const findIndex = this.postsEvaluation.findIndex(
      findPostEvaluation => findPostEvaluation.id === postEvaluation.id,
    );

    this.postsEvaluation[findIndex] = postEvaluation;

    return postEvaluation;
  }

  public async all(): Promise<PostEvaluation[]> {
    return this.postsEvaluation;
  }

  public async delete(id: string): Promise<void> {
    const findIndex = this.postsEvaluation.findIndex(
      findPostEvaluation => findPostEvaluation.id === id,
    );

    this.postsEvaluation.splice(findIndex, 1);
  }
}

export { FakePostsEvaluationRepository };
