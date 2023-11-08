import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { JwtModule } from '@nestjs/jwt';
import { constants } from '../utils/constants';
import { Profile } from 'src/typeorm/entities/Profile';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        JwtModule.register({
            global: true,
            secret: constants.jwt_secret,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
