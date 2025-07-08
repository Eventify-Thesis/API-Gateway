import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

@Injectable()
export class CommentServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async getComments(eventId: number, userId?: string) {
    try {
      return await this.client
        .send('getComments', { eventId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error getting comments:', error);
      throw error;
    }
  }

  async createComment(
    eventId: number,
    userId: string,
    data: CreateCommentRequest,
  ) {
    try {
      return await this.client
        .send('createComment', { eventId, userId, data })
        .toPromise();
    } catch (error) {
      console.log('Error creating comment:', error);
      throw error;
    }
  }

  async updateComment(
    commentId: number,
    userId: string,
    data: UpdateCommentRequest,
  ) {
    try {
      return await this.client
        .send('updateComment', { commentId, userId, data })
        .toPromise();
    } catch (error) {
      console.log('Error updating comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: number, userId: string) {
    try {
      return await this.client
        .send('deleteComment', { commentId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error deleting comment:', error);
      throw error;
    }
  }

  async getComment(commentId: number, userId?: string) {
    try {
      return await this.client
        .send('getComment', { commentId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error getting comment:', error);
      throw error;
    }
  }

  async likeComment(commentId: number, userId: string) {
    try {
      return await this.client
        .send('likeComment', { commentId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error liking comment:', error);
      throw error;
    }
  }
}
