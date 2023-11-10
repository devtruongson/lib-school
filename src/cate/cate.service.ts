import { HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class CateService {
    constructor(@InjectRepository(Categories) private readonly cateRepository: Repository<Categories>) {}

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
}
