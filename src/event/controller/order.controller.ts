import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, Req } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { GetOrdersQuery } from '../dto/get-orders.dto';
import { EventServiceProxy } from '../services/event.service';
import RequestWithUser from 'src/auth/role/requestWithUser.interface';

@Controller('orders')
@UseGuards(ClerkAuthGuard)
export class OrderController {
  constructor(private readonly eventService: EventServiceProxy) { }

  @Get()
  @ApiQuery({
    type: GetOrdersQuery,
  })
  findAll(
    @Query() query: GetOrdersQuery,
    @Req() req: RequestWithUser,
  ) {
    return this.eventService.getUserOrders(req.user.id, query);
  }

  @Get(':orderPublicId')
  getDetail(@Param('orderPublicId') orderPublicId: string) {
    return this.eventService.getOrderDetail(orderPublicId);
  }
}
