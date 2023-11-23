import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './typeorm/entities/User';
import { Order } from './typeorm/entities/Order';
import { Book } from './typeorm/entities/Book';
import { Profile } from './typeorm/entities/Profile';
import { MailerModule } from './mailer/mailer.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { Images } from './typeorm/entities/Image';
import { Categories } from './typeorm/entities/Cate';
import { CateModule } from './cate/cate.module';
import { UploadModule } from './upload/upload.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OrderModule } from './order/order.module';
import { Book_Cate } from './typeorm/entities/Book_Categorie';
import { Blog } from './typeorm/entities/Blog';
import { BlogModule } from './blog/blog.module';

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
            entities: [User, Order, Book, Profile, Images, Categories, Book_Cate, Blog],
            synchronize: true,
            autoLoadEntities: true,
        }),
        MailerModule,
        UserModule,
        BookModule,
        CateModule,
        UploadModule,
        ScheduleModule.forRoot(),
        OrderModule,
        BlogModule,
    ],
})
export class AppModule {}
