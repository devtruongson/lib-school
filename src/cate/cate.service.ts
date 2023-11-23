import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createCateDTO } from './dto/createCate.dto';
import { IRes } from 'src/utils/interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/typeorm/entities/Cate';
import { Repository } from 'typeorm';
import { v4 as uuid4 } from 'uuid';
import slugify from 'slugify';
import { sendResponse } from 'src/helpers/sendResponse';
import { updateCateDTO } from './dto/updateCate.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Book_Cate } from 'src/typeorm/entities/Book_Categorie';

@Injectable()
export class CateService {
    constructor(
        @InjectRepository(Categories) private readonly cateRepository: Repository<Categories>,
        @InjectRepository(Book_Cate) private readonly bookCateRepository: Repository<Book_Cate>,
    ) {}

    async createCate(data: createCateDTO): Promise<IRes> {
        const newCate = this.cateRepository.create({
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            slug: slugify(`${data.title} ${uuid4()}`),
            is_active: data.is_active,
        });

        const cateSave = await this.cateRepository.save(newCate);
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Tạo Thành Công Danh Mục Sách',
            data: cateSave,
        });
    }

    async updateCate(data: updateCateDTO) {
        await this.cateRepository.update(data.id, {
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            slug: slugify(`${data.title} ${uuid4()}`),
            is_active: data.is_active,
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Sửa Thành Công Danh Mục Sách',
        });
    }

    async getAllCates(options: IPaginationOptions): Promise<Pagination<Categories>> {
        return paginate<Categories>(this.cateRepository, options);
    }

    filterAllPagin(option: IPaginationOptions): Promise<Pagination<Categories>> {
        return paginate<Categories>(this.cateRepository, option, {
            where: {
                is_active: true,
            },
            select: ['id', 'title', 'slug'],
        });
    }

    async filterAll(): Promise<IRes> {
        const cates: Categories[] | [] = await this.cateRepository.find({
            where: {
                is_active: true,
            },
        });

        if (cates && cates.length === 0) {
            throw new BadRequestException();
        }

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Thành Công!',
            data: cates.map((item: Categories) => {
                return {
                    value: item.id,
                    label: item.title,
                };
            }),
        });
    }

    async getAllBookByCategory(cate: string): Promise<IRes> {
        const categorie: Categories | null = await this.cateRepository.findOne({
            where: {
                slug: cate,
            },
        });

        if (!categorie) {
            throw new NotFoundException(`Categorie not found`);
        }

        const books = await this.bookCateRepository.find({
            where: {
                cate: categorie,
            },
            relations: ['book', 'cate'],
        });

        let bookResponse: Book_Cate[] | null;

        if (books && books.length > 0) {
            bookResponse = books.filter((item) => item.book.is_active);
        }

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: bookResponse ? bookResponse : [],
        });
    }
}
