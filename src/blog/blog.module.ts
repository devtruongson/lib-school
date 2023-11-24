import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { JwtAdminMiddleware } from 'src/middlewares/admin.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/typeorm/entities/Blog';

@Module({
    imports: [TypeOrmModule.forFeature([Blog])],
    controllers: [BlogController],
    providers: [BlogService],
})
export class BlogModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtAdminMiddleware).forRoutes(
            {
                path: '/blog',
                method: RequestMethod.ALL,
            },
            {
                path: '/blog/by-slug',
                method: RequestMethod.GET,
            },
        );
    }
}
