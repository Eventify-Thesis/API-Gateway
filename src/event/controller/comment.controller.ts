import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import {
  CommentServiceProxy,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../services/comment.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { MESSAGE } from '../event.constant';
import RequestWithUser from 'src/auth/role/requestWithUser.interface';

@ApiTags('comments')
@Controller('events/:eventId/comments')
@UseGuards(ClerkAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentServiceProxy) {}

  @Get()
  @ApiResponse({ description: 'Get all comments for an event' })
  async getComments(
    @Param('eventId') eventId: string,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    try {
      const comments = await this.commentService.getComments(
        eventIdNum,
        req.user?.id,
      );
      return comments;
    } catch (error) {
      console.log('Error in getComments:', error);
      throw new AppException(MESSAGE.EVENT_NOT_FOUND);
    }
  }

  @Post()
  @ApiResponse({ description: 'Create a new comment' })
  async createComment(
    @Param('eventId') eventId: string,
    @Body() createCommentDto: CreateCommentRequest,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    if (
      !createCommentDto.content ||
      createCommentDto.content.trim().length === 0
    ) {
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }

    try {
      const comment = await this.commentService.createComment(
        eventIdNum,
        req.user.id,
        createCommentDto,
      );
      return comment;
    } catch (error) {
      console.log('Error in createComment:', error);
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }
  }

  @Put(':commentId')
  @ApiResponse({ description: 'Update a comment' })
  async updateComment(
    @Param('eventId') eventId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentRequest,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    if (
      !updateCommentDto.content ||
      updateCommentDto.content.trim().length === 0
    ) {
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }

    try {
      const comment = await this.commentService.updateComment(
        commentId,
        req.user.id,
        updateCommentDto,
      );
      return comment;
    } catch (error) {
      console.log('Error in updateComment:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.COMMENT_NOT_FOUND);
      }
      if (
        error.message?.includes('Forbidden') ||
        error.message?.includes('only edit your own')
      ) {
        throw new AppException(MESSAGE.COMMENT_UNAUTHORIZED);
      }
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }
  }

  @Delete(':commentId')
  @ApiResponse({ description: 'Delete a comment' })
  async deleteComment(
    @Param('eventId') eventId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    try {
      await this.commentService.deleteComment(commentId, req.user.id);
      return { message: 'Comment deleted successfully' };
    } catch (error) {
      console.log('Error in deleteComment:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.COMMENT_NOT_FOUND);
      }
      if (
        error.message?.includes('Forbidden') ||
        error.message?.includes('only delete your own')
      ) {
        throw new AppException(MESSAGE.COMMENT_UNAUTHORIZED);
      }
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }
  }

  @Get(':commentId')
  @ApiResponse({ description: 'Get a specific comment' })
  async getComment(
    @Param('eventId') eventId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    try {
      const comment = await this.commentService.getComment(
        commentId,
        req.user?.id,
      );
      if (!comment) {
        throw new AppException(MESSAGE.COMMENT_NOT_FOUND);
      }
      return comment;
    } catch (error) {
      console.log('Error in getComment:', error);
      throw new AppException(MESSAGE.COMMENT_NOT_FOUND);
    }
  }

  @Post(':commentId/like')
  @ApiResponse({ description: 'Like or unlike a comment' })
  async likeComment(
    @Param('eventId') eventId: string,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: RequestWithUser,
  ) {
    const eventIdNum = parseInt(eventId, 10);
    if (isNaN(eventIdNum)) {
      throw new AppException({
        message: 'Invalid event ID',
        error: 'INVALID_EVENT_ID',
        httpStatus: 400,
      });
    }

    try {
      const comment = await this.commentService.likeComment(
        commentId,
        req.user.id,
      );
      return comment;
    } catch (error) {
      console.log('Error in likeComment:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.COMMENT_NOT_FOUND);
      }
      throw new AppException(MESSAGE.COMMENT_VALIDATION_ERROR);
    }
  }
}
