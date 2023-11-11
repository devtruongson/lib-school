import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createDTO } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Book';
import { Repository } from 'typeorm';
import { Categories } from 'src/typeorm/entities/Cate';
import { IRes } from 'src/utils/interface';
import { Images } from 'src/typeorm/entities/Image';
import { sendResponse } from 'src/helpers/sendResponse';
import { updateDTO } from './dto/update.dto';
import { removeFile } from 'src/utils/upload-image';
import { v4 as uuid4 } from 'uuid';
import slugify from 'slugify';
import { updateStatusDTO } from './dto/updateStatus.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Categories) private readonly cateRepository: Repository<Categories>,
        @InjectRepository(Images) private readonly imageRepository: Repository<Images>,
    ) {}

    async createBook(data: createDTO, files: Express.Multer.File[]): Promise<IRes> {
        const [thumbnail_url, ...images] = files;
        const checkCate: Categories[] | null = null;

        await Promise.all(
            data.categories.map(async (item: number) => {
                const category = await this.cateRepository.findOne({
                    where: {
                        id: item,
                    },
                });
                if (category) {
                    checkCate.push(category);
                }
            }),
        );

        if (!checkCate) {
            throw new HttpException('Danh Mục Sách Bạn Chọn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        const bookCreate: Book = this.bookRepository.create({
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            is_active: data.is_active,
            stock: data.stock,
            thumbnail_url: thumbnail_url.filename,
            slug: slugify(`${data.title} ${uuid4()}`),
            categories: checkCate,
            meta_description: data.meta_description,
            meta_title: data.title,
        });

        const bookSave = await this.bookRepository.save(bookCreate);

        if (images && images.length > 0) {
            images.forEach(async (item: Express.Multer.File) => {
                const imageCreate = this.imageRepository.create({
                    destination: item.destination,
                    book: bookSave,
                    is_active: true,
                    link_url: item.filename,
                });
                await this.imageRepository.save(imageCreate);
            });
        }

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Tạo Sách Thành Công!',
            data: bookSave,
        });
    }

    async updateBook(data: updateDTO, files: Express.Multer.File[]): Promise<IRes> {
        const checkBook: Book | null = await this.bookRepository.findOne({
            where: {
                id: data.id,
            },
            relations: ['categories'], // Load categories khi lấy thông tin sách
        });

        if (!checkBook) {
            throw new HttpException('Sách Của Bạn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        const checkCate: Categories[] = [];
        await Promise.all(
            data.categories.map(async (item: number) => {
                const category = await this.cateRepository.findOne({
                    where: {
                        id: item,
                    },
                });
                if (category) {
                    checkCate.push(category);
                }
            }),
        );

        // Xóa các categories cũ của sách
        checkBook.categories = [];
        // Thêm các categories mới vào sách
        checkBook.categories = checkCate;

        if (!checkBook) {
            throw new HttpException('Sách Của Bạn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }
        if (!checkCate) {
            throw new HttpException('Danh Mục Của Bạn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        if (data.image_delete.length > 0) {
            await Promise.all(
                data.image_delete.map(async (item: string) => {
                    try {
                        await this.imageRepository.delete({
                            link_url: item,
                        });
                        removeFile(`./files/images/app/book/${item}`);
                    } catch (error) {
                        throw new HttpException(
                            'path_old_image bạn cung cấp hãy đảm bảo chính xác',
                            HttpStatus.BAD_REQUEST,
                        );
                    }
                }),
            );
        }

        let thumbnail_url: string = data.thumbnail_url;
        let file_image: Express.Multer.File[] = files;

        if (data.is_change_thumbnail) {
            const [thumnail, ...images] = files;
            file_image = images;
            thumbnail_url = thumnail.filename;
        }

        if (file_image && file_image.length > 0) {
            file_image.forEach(async (item: Express.Multer.File) => {
                const imageCreate = this.imageRepository.create({
                    destination: item.destination,
                    book: checkBook,
                    is_active: true,
                    link_url: item.filename,
                });
                await this.imageRepository.save(imageCreate);
            });
        }

        await this.bookRepository.update(data.id, {
            ...checkBook,
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            is_active: data.is_active,
            stock: data.stock,
            thumbnail_url,
            slug: slugify(`${data.title} ${uuid4()}`),
            categories: checkCate,
            meta_description: data.meta_description,
            meta_title: data.title,
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Update Sách Thành Công!',
        });
    }

    async updateStatus(data: updateStatusDTO): Promise<IRes> {
        const checkBook: Book | null = await this.bookRepository.findOne({
            where: {
                id: data.id,
            },
        });

        if (!checkBook) {
            throw new HttpException('Sách Của Bạn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        await this.bookRepository.update(data.id, {
            is_active: data.is_active,
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Update Status Sách Thành Công!',
        });
    }

    async deleteBook(id: number): Promise<IRes> {
        const checkBook: Book | null = await this.bookRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!checkBook) {
            throw new HttpException('Sách Của Bạn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        await this.bookRepository.delete(id);
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn Đã Xóa Sách Thành Công!',
        });
    }

    findAllBooksByAdmin(options: IPaginationOptions): Promise<Pagination<Book>> {
        return paginate<Book>(this.bookRepository, options);
    }
}
