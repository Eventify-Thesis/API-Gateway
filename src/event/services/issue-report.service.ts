import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export interface CreateIssueReportRequest {
  title: string;
  description: string;
  category: string;
  priority?: string;
  imageUrls?: string[];
}

export interface UpdateIssueReportRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  imageUrls?: string[];
}

@Injectable()
export class IssueReportServiceProxy {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async createIssueReport(userId: string, data: CreateIssueReportRequest) {
    try {
      return await this.client
        .send('createIssueReport', { userId, data })
        .toPromise();
    } catch (error) {
      console.log('Error creating issue report:', error);
      throw error;
    }
  }

  async getUserIssueReports(userId: string, page?: number, limit?: number) {
    try {
      return await this.client
        .send('getUserIssueReports', { userId, page, limit })
        .toPromise();
    } catch (error) {
      console.log('Error getting user issue reports:', error);
      throw error;
    }
  }

  async getAllIssueReports(page?: number, limit?: number) {
    try {
      return await this.client
        .send('getAllIssueReports', { page, limit })
        .toPromise();
    } catch (error) {
      console.log('Error getting all issue reports:', error);
      throw error;
    }
  }

  async getIssueReport(issueReportId: number, userId?: string) {
    try {
      return await this.client
        .send('getIssueReport', { issueReportId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error getting issue report:', error);
      throw error;
    }
  }

  async updateIssueReport(
    issueReportId: number,
    userId: string | null,
    data: UpdateIssueReportRequest,
  ) {
    try {
      return await this.client
        .send('updateIssueReport', { issueReportId, userId, data })
        .toPromise();
    } catch (error) {
      console.log('Error updating issue report:', error);
      throw error;
    }
  }

  async deleteIssueReport(issueReportId: number, userId: string | null) {
    try {
      return await this.client
        .send('deleteIssueReport', { issueReportId, userId })
        .toPromise();
    } catch (error) {
      console.log('Error deleting issue report:', error);
      throw error;
    }
  }
}
