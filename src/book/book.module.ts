import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Book';
import { Categories } from 'src/typeorm/entities/Cate';
import { Images } from 'src/typeorm/entities/Image';

@Module({
    imports: [
        MulterModule.register({
            dest: './files',
        }),
        TypeOrmModule.forFeature([Book, Categories, Images]),
    ],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtAdminMiddleware).forRoutes({
            path: '/book',
            method: RequestMethod.ALL,
        });
    }
}
