import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/typeorm/entities/Order';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleNotifyOrderBookAboutToExpire() {
        // const orders = await this.orderRepository.find();
    }
}
