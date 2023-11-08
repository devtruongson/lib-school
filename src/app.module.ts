import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './auth/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: 3306,
            username: 'root',
            password: 'fstack@1234',
            database: 'lib_school',
            entities,
            synchronize: true,
        }),
    ],
})
export class AppModule {}
