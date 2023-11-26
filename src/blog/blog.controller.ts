import {
    BadRequestException,
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { createBlogDTO } from './dto/createBlog.dto';
import { IRes } from 'src/utils/interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ConfigEnum } from 'src/utils/enum';
import { Blog } from 'src/typeorm/entities/Blog';
import { updateBlogDTO } from './dto/updateBlog.dto';

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Post()
    createPost(@Body() data: createBlogDTO): Promise<IRes> {
        return this.blogService.createBlog(data);
    }

    @Get()
    getBlogByAdmin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Blog>> {
        return this.blogService.getBlogByAdmin({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_ORDER_BLOG,
        });
    }

    @Put()
    updateBlog(@Body() data: updateBlogDTO): Promise<IRes> {
        return this.blogService.updateBlog(data);
    }

    @Delete(':id')
    deleteBlog(@Param('id', ParseIntPipe) id: number): Promise<IRes> {
        return this.blogService.deleteBlog(id);
    }

    @Get('blog-new')
    getBlogNew(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Blog>> {
        return this.blogService.getBlogNew({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_ORDER_BLOG,
        });
    }

    @Get('/by-slug')
    getBlogBySlug(@Query('slug') slug: string): Promise<IRes> {
        if (!slug) {
            throw new BadRequestException();
        }
        return this.blogService.getBlogBySlug(slug);
    }

    @Get('/client')
    getAllBlogToClient(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('pageSize', new DefaultValuePipe(1), ParseIntPipe) pageSize: number = 1,
    ): Promise<Pagination<Blog>> {
        return this.blogService.getAllBlogToClient({
            limit: pageSize,
            page: page,
            cacheQueries: true,
            route: ConfigEnum.URL_BE_ORDER_BLOG + '/client',
        });
    }

    @Get('/all-blog')
    getAllBlog() {
        return this.blogService.getAllBlog();
    }
}
