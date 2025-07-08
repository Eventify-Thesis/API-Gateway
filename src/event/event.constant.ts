import { HttpStatus } from '@nestjs/common';

export enum EventType {
  'ONLINE' = 'ONLINE',
  'OFFLINE' = 'OFFLINE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UPCOMING = 'UPCOMING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  CANCELLED = 'CANCELLED',
}

export enum BusinessType {
  COMPANY = 'COMPANY',
  PERSONAL = 'PERSONAL',
}

export enum AgeRestriction {
  ALL_AGES = 'ALL_AGES',
  OVER_18 = 'OVER_18',
  OVER_21 = 'OVER_21',
}

export const MESSAGE = {
  EVENT_NOT_FOUND: {
    error: 'EVENT_NOT_FOUND',
    message: 'Event not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  SETTING_NOT_FOUND: {
    error: 'SETTING_NOT_FOUND',
    message: 'Setting not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  PAYMENT_INFO_NOT_FOUND: {
    error: 'PAYMENT_INFO_NOT_FOUND',
    message: 'Payment info not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  SHOW_NOT_FOUND: {
    error: 'SHOW_NOT_FOUND',
    message: 'Show not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },
  SEATING_PLAN_NOT_FOUND: {
    error: 'SEATING_PLAN_NOT_FOUND',
    message: 'Seating plan not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },

  QUESTION_NOT_FOUND: {
    error: 'QUESTION_NOT_FOUND',
    message: 'Question not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },

  COMMENT_NOT_FOUND: {
    error: 'COMMENT_NOT_FOUND',
    message: 'Comment not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },

  COMMENT_UNAUTHORIZED: {
    error: 'COMMENT_UNAUTHORIZED',
    message: 'You are not authorized to perform this action on this comment',
    httpStatus: HttpStatus.FORBIDDEN,
  },

  COMMENT_VALIDATION_ERROR: {
    error: 'COMMENT_VALIDATION_ERROR',
    message: 'Comment validation failed',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  ISSUE_REPORT_NOT_FOUND: {
    error: 'ISSUE_REPORT_NOT_FOUND',
    message: 'Issue report not found',
    httpStatus: HttpStatus.NOT_FOUND,
  },

  ISSUE_REPORT_UNAUTHORIZED: {
    error: 'ISSUE_REPORT_UNAUTHORIZED',
    message:
      'You are not authorized to perform this action on this issue report',
    httpStatus: HttpStatus.FORBIDDEN,
  },

  ISSUE_REPORT_VALIDATION_ERROR: {
    error: 'ISSUE_REPORT_VALIDATION_ERROR',
    message: 'Issue report validation failed',
    httpStatus: HttpStatus.BAD_REQUEST,
  },

  ISSUE_REPORT_CREATE_ERROR: {
    error: 'ISSUE_REPORT_CREATE_ERROR',
    message: 'Failed to create issue report',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  ISSUE_REPORT_UPDATE_ERROR: {
    error: 'ISSUE_REPORT_UPDATE_ERROR',
    message: 'Failed to update issue report',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  ISSUE_REPORT_DELETE_ERROR: {
    error: 'ISSUE_REPORT_DELETE_ERROR',
    message: 'Failed to delete issue report',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
