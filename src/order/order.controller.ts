import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Order } from 'src/typeorm/entities/Order';
import { ConfigEnum } from 'src/utils/enum';
import { Request } from 'express';
import { IRes } from 'src/utils/interface';
import { createOrderDTO } from './dto/createOrder.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getAllOrder(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
        @Query('filter') filter: string,
        @Req() req: Request,
    ): Promise<Pagination<Order>> {
        return this.orderService.getAllOrder(filter, req, {
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_ORDER,
        });
    }

    @Get('/check-isvalid')
    checkIsValid(@Req() req: Request): Promise<IRes> {
        return this.orderService.checkIsValid(req);
    }

    @Post()
    createOrder(@Body() data: createOrderDTO, @Req() req: Request): Promise<IRes> {
        return this.orderService.createOrder(req, data);
    }
}
