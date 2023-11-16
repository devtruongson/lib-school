import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Book';
import { Categories } from 'src/typeorm/entities/Cate';
import { Images } from 'src/typeorm/entities/Image';
import { User } from 'src/typeorm/entities/User';
import { MailerService } from 'src/mailer/mailer.service';
import { Book_Cate } from 'src/typeorm/entities/Book_Categorie';

@Module({
    imports: [
        MulterModule.register({
            dest: './files',
        }),
        TypeOrmModule.forFeature([Book, Categories, Images, User, Book_Cate]),
    ],
    controllers: [BookController],
    providers: [BookService, MailerService],
})
export class BookModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtAdminMiddleware).forRoutes(
            {
                path: '/book',
                method: RequestMethod.ALL,
            },
            {
                path: '/book/update-image-status',
                method: RequestMethod.PATCH,
            },
        );
    }
}
