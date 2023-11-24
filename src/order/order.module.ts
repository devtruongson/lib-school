import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Book } from 'src/typeorm/entities/Book';
import { Order } from 'src/typeorm/entities/Order';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([User, Book, Order])],
    controllers: [OrderController],
    providers: [OrderService, MailerService],
})
export class OrderModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .forRoutes(
                {
                    path: '/order',
                    method: RequestMethod.ALL,
                },
                {
                    path: '/order/check-isvalid',
                    method: RequestMethod.GET,
                },
            )
            .apply(JwtAdminMiddleware)
            .forRoutes(
                {
                    path: '/order/line-chart',
                    method: RequestMethod.GET,
                },
                {
                    path: '/order/all',
                    method: RequestMethod.GET,
                },
                {
                    path: '/order/update-browbook',
                    method: RequestMethod.PATCH,
                },
                {
                    path: '/order/by-uid',
                    method: RequestMethod.GET,
                },
            );
    }
}
