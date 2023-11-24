import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/typeorm/entities/Blog';
import { IRes } from 'src/utils/interface';
import { Repository } from 'typeorm';
import { createBlogDTO } from './dto/createBlog.dto';
import { sendResponse } from 'src/helpers/sendResponse';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import slugify from 'slugify';
import { v4 as uuid4 } from 'uuid';
import { updateBlogDTO } from './dto/updateBlog.dto';

@Injectable()
export class BlogService {
    constructor(@InjectRepository(Blog) private readonly blogRepository: Repository<Blog>) {}
    async createBlog(data: createBlogDTO): Promise<IRes> {
        const blogCreate = this.blogRepository.create({
            ...data,
            slug: slugify(`${data.title} ${uuid4()}`),
        });
        await this.blogRepository.save(blogCreate);
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: null,
        });
    }

    getBlogByAdmin(options: IPaginationOptions): Promise<Pagination<Blog>> {
        return paginate<Blog>(this.blogRepository, options);
    }

    getBlogNew(options: IPaginationOptions): Promise<Pagination<Blog>> {
        return paginate<Blog>(this.blogRepository, options, {
            is_active: true,
        });
    }

    async updateBlog(data: updateBlogDTO): Promise<IRes> {
        await this.blogRepository.update(data.id, {
            title: data.title,
            is_active: data.is_active,
            meta_description: data.meta_description,
            contentHTML: data.contentHTML,
            contentMarkDown: data.contentMarkDown,
        });
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: null,
        });
    }

    async deleteBlog(id: number): Promise<IRes> {
        await this.blogRepository.delete(id);
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: null,
        });
    }

    async getBlogBySlug(slug: string): Promise<IRes> {
        const blog = await this.blogRepository.findOne({
            where: {
                slug: slug,
            },
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: blog,
        });
    }
}
