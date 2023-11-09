import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './typeorm/entities/User';
import { Order } from './typeorm/entities/Order';
import { Book } from './typeorm/entities/Book';
import { Profile } from './typeorm/entities/Profile';
import { MailerModule } from './mailer/mailer.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.port),
            username: 'root',
            password: 'fstack@1234',
            database: 'lib_school',
            entities: [User, Order, Book, Profile],
            synchronize: true,
            autoLoadEntities: true,
        }),
        MailerModule,
    ],
})
export class AppModule {}
