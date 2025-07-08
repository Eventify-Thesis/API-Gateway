import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import {
  IssueReportServiceProxy,
  CreateIssueReportRequest,
  UpdateIssueReportRequest,
} from '../services/issue-report.service';
import { AppException } from 'src/common/exceptions/app.exception';
import { MESSAGE } from '../event.constant';
import RequestWithUser from 'src/auth/role/requestWithUser.interface';

@ApiTags('issue-reports')
@Controller('issue-reports')
@UseGuards(ClerkAuthGuard)
export class IssueReportController {
  constructor(private readonly issueReportService: IssueReportServiceProxy) {}

  @Post()
  @ApiResponse({ description: 'Create a new issue report' })
  async createIssueReport(
    @Body() createIssueReportDto: CreateIssueReportRequest,
    @Req() req: RequestWithUser,
  ) {
    if (
      !createIssueReportDto.title ||
      createIssueReportDto.title.trim().length === 0
    ) {
      throw new AppException(MESSAGE.ISSUE_REPORT_VALIDATION_ERROR);
    }

    if (
      !createIssueReportDto.description ||
      createIssueReportDto.description.trim().length === 0
    ) {
      throw new AppException(MESSAGE.ISSUE_REPORT_VALIDATION_ERROR);
    }

    if (
      !createIssueReportDto.category ||
      createIssueReportDto.category.trim().length === 0
    ) {
      throw new AppException(MESSAGE.ISSUE_REPORT_VALIDATION_ERROR);
    }

    try {
      const issueReport = await this.issueReportService.createIssueReport(
        req.user.id,
        createIssueReportDto,
      );
      return issueReport;
    } catch (error) {
      console.log('Error in createIssueReport:', error);
      throw new AppException(MESSAGE.ISSUE_REPORT_CREATE_ERROR);
    }
  }

  @Get()
  @ApiResponse({ description: 'Get user issue reports' })
  async getUserIssueReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: RequestWithUser,
  ) {
    try {
      const issueReports = await this.issueReportService.getUserIssueReports(
        req.user.id,
        page,
        limit,
      );
      return issueReports;
    } catch (error) {
      console.log('Error in getUserIssueReports:', error);
      throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
    }
  }

  @Get('all')
  @ApiResponse({ description: 'Get all issue reports (admin only)' })
  async getAllIssueReports(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const issueReports = await this.issueReportService.getAllIssueReports(
        page,
        limit,
      );
      return issueReports;
    } catch (error) {
      console.log('Error in getAllIssueReports:', error);
      throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
    }
  }

  @Get(':issueReportId')
  @ApiResponse({ description: 'Get a specific issue report' })
  async getIssueReport(
    @Param('issueReportId', ParseIntPipe) issueReportId: number,
    @Req() req: RequestWithUser,
  ) {
    try {
      const issueReport = await this.issueReportService.getIssueReport(
        issueReportId,
        req.user.id,
      );
      if (!issueReport) {
        throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
      }
      return issueReport;
    } catch (error) {
      console.log('Error in getIssueReport:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
      }
      if (
        error.message?.includes('Forbidden') ||
        error.message?.includes('only view your own')
      ) {
        throw new AppException(MESSAGE.ISSUE_REPORT_UNAUTHORIZED);
      }
      throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
    }
  }

  @Put(':issueReportId')
  @ApiResponse({ description: 'Update an issue report' })
  async updateIssueReport(
    @Param('issueReportId', ParseIntPipe) issueReportId: number,
    @Body() updateIssueReportDto: UpdateIssueReportRequest,
    @Req() req: RequestWithUser,
  ) {
    try {
      const issueReport = await this.issueReportService.updateIssueReport(
        issueReportId,
        req.user.id,
        updateIssueReportDto,
      );
      return issueReport;
    } catch (error) {
      console.log('Error in updateIssueReport:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
      }
      if (
        error.message?.includes('Forbidden') ||
        error.message?.includes('only update your own')
      ) {
        throw new AppException(MESSAGE.ISSUE_REPORT_UNAUTHORIZED);
      }
      throw new AppException(MESSAGE.ISSUE_REPORT_UPDATE_ERROR);
    }
  }

  @Delete(':issueReportId')
  @ApiResponse({ description: 'Delete an issue report' })
  async deleteIssueReport(
    @Param('issueReportId', ParseIntPipe) issueReportId: number,
    @Req() req: RequestWithUser,
  ) {
    try {
      await this.issueReportService.deleteIssueReport(
        issueReportId,
        req.user.id,
      );
      return { message: 'Issue report deleted successfully' };
    } catch (error) {
      console.log('Error in deleteIssueReport:', error);
      if (error.message?.includes('not found')) {
        throw new AppException(MESSAGE.ISSUE_REPORT_NOT_FOUND);
      }
      if (
        error.message?.includes('Forbidden') ||
        error.message?.includes('only delete your own')
      ) {
        throw new AppException(MESSAGE.ISSUE_REPORT_UNAUTHORIZED);
      }
      throw new AppException(MESSAGE.ISSUE_REPORT_DELETE_ERROR);
    }
  }
}
