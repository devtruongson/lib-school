import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createDTO } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Book';
import { MoreThan, Repository } from 'typeorm';
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
import { MailerService } from 'src/mailer/mailer.service';
import { User } from 'src/typeorm/entities/User';
import { updateStatusImage } from './dto/updateStatusImage.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Categories) private readonly cateRepository: Repository<Categories>,
        @InjectRepository(Images) private readonly imageRepository: Repository<Images>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly mailService: MailerService,
    ) {}

    async createBook(data: createDTO, files: Express.Multer.File[]): Promise<IRes> {
        const [thumbnail_url, ...images] = files;
        const checkCate: Categories[] | null = [];

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

        if (checkCate.length === 0) {
            throw new HttpException('Danh Mục Sách Bạn Chọn Không Tồn Tại Trong Hệ Thống!', HttpStatus.BAD_REQUEST);
        }

        const bookCreate = this.bookRepository.create({
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            is_active: data.is_active === 'true' ? true : false,
            stock: parseInt(data.stock),
            thumbnail_url: thumbnail_url.filename,
            slug: slugify(`${data.title} ${uuid4()}`),
            categories: checkCate,
            meta_description: data.meta_description,
            meta_title: data.title,
            stock_brows: parseInt(data.stock),
        });

        const bookSave = await this.bookRepository.save(bookCreate);
        const users = await this.userRepository.find();

        await this.mailService.notifyBookNews({
            emails: users.map((user) => user.email),
            html: `
                <h1>Chúng Tôi Xin Thông Báo Hệ Thống Thư Viện Đã Có Thêm Sách Mới</h1>
                <p>Tên Sách: ${data.title}</p>
                <p>Mô Tả Sách: ${data.description}</p>
                <blockquote>Bạn Hãy Ghé Thăm Để Mượn Ngay Hôm Nay Nhé!</blockquote>
            `,
        });

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
                id: parseInt(data.id),
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

        let thumbnail_url: string = data.thumbnail_url;
        let file_image: Express.Multer.File[] = files;

        if (data.is_change_thumbnail === 'true') {
            data.image_delete.push(thumbnail_url);
            const [thumnail, ...images] = files;
            file_image = images;
            thumbnail_url = thumnail.filename;
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

        const stock_brows_update = checkBook.stock_brows + (parseInt(data.stock) - checkBook.stock_brows);

        await this.bookRepository.update(parseInt(data.id), {
            ...checkBook,
            title: data.title,
            description: data.description,
            description_markdown: data.description_markdown,
            is_active: data.is_active === 'true' ? true : false,
            stock: parseInt(data.stock),
            thumbnail_url,
            slug: slugify(`${data.title} ${uuid4()}`),
            categories: checkCate,
            meta_description: data.meta_description,
            meta_title: data.title,
            stock_brows: stock_brows_update,
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

    async detailBook(slug: string): Promise<IRes> {
        const book: Book | null = await this.bookRepository
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.images', 'images', 'images.is_active = :isActive', { isActive: true })
            .leftJoinAndSelect('book.categories', 'categories')
            .where('book.slug = :slug', { slug })
            .getOne();

        if (!book) {
            throw new HttpException('Book không tồn tại trong hệ thống!', HttpStatus.BAD_REQUEST);
        }

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: book,
        });
    }

    async updateStatusImage(data: updateStatusImage): Promise<IRes> {
        await this.imageRepository.update(data.id, {
            is_active: data.is_active,
        });
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
        });
    }

    bookNewsSuggest(options: IPaginationOptions): Promise<Pagination<Book>> {
        return paginate<Book>(this.bookRepository, options, {
            order: {
                created_At: 'DESC',
            },
            where: {
                is_active: true,
            },
            select: ['id', 'title', 'description', 'thumbnail_url', 'slug', 'stock', 'count_borrow_books'],
        });
    }

    getBookTopBrows(options: IPaginationOptions): Promise<Pagination<Book>> {
        return paginate<Book>(this.bookRepository, options, {
            where: {
                is_active: true,
                count_borrow_books: MoreThan(0),
            },
            order: {
                count_borrow_books: 'DESC',
            },
        });
    }

    async getAllBookBuilder(): Promise<IRes> {
        const books = await this.bookRepository.find({
            where: {
                is_active: true,
            },
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Ok',
            data: books,
        });
    }
}
