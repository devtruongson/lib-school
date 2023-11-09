import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: './files',
        }),
    ],
    controllers: [BookController],
    providers: [BookService],
})
export class BookModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtAdminMiddleware).forRoutes();
    }
}
