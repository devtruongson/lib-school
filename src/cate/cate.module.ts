import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CateService } from './cate.service';
import { CateController } from './cate.controller';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/typeorm/entities/Cate';
import { Book_Cate } from 'src/typeorm/entities/Book_Categorie';

@Module({
    imports: [TypeOrmModule.forFeature([Categories, Book_Cate])],
    controllers: [CateController],
    providers: [CateService],
})
export class CateModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtAdminMiddleware).forRoutes(
            {
                path: '/cate',
                method: RequestMethod.POST,
            },
            {
                path: '/cate',
                method: RequestMethod.GET,
            },
            {
                path: '/cate/update',
                method: RequestMethod.PUT,
            },
        );
    }
}
