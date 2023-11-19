import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, MailerService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(JwtMiddleware)
            .forRoutes(
                {
                    path: '/user/current-role',
                    method: RequestMethod.GET,
                },
                {
                    path: '/user/current-user',
                    method: RequestMethod.GET,
                },
            )
            .apply(JwtAdminMiddleware)
            .forRoutes(
                {
                    path: '/user',
                    method: RequestMethod.GET,
                },
                {
                    path: '/user/send-email',
                    method: RequestMethod.POST,
                },
                {
                    path: '/user/send-email-many-users',
                    method: RequestMethod.POST,
                },
            );
    }
}
