import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Book } from 'src/typeorm/entities/Book';
import { Order } from 'src/typeorm/entities/Order';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Book, Order])],
    controllers: [OrderController],
    providers: [OrderService, MailerService],
})
export class OrderModule {}
