import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { JwtModule } from '@nestjs/jwt';
import { constants } from '../utils/constants';
import { Profile } from 'src/typeorm/entities/Profile';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        JwtModule.register({
            global: true,
            secret: constants.jwt_secret,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, MailerService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes({
            path: '/auth/refresh-token',
            method: RequestMethod.POST,
        });
    }
}
