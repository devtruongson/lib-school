import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createDTO } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/typeorm/entities/Book';
import { Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
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
import { Book_Cate } from 'src/typeorm/entities/Book_Categorie';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(Categories) private readonly cateRepository: Repository<Categories>,
        @InjectRepository(Images) private readonly imageRepository: Repository<Images>,
        @InjectRepository(Book_Cate) private readonly bookCateRepository: Repository<Book_Cate>,
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

        if (checkCate && checkCate.length > 0) {
            checkCate.forEach(async (cate) => {
                const cateBookSave = this.bookCateRepository.create({
                    cate: cate,
                    book: bookSave,
                });
                await this.bookCateRepository.save(cateBookSave);
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
        if (data.image_delete && data.image_delete.length > 0) {
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
            meta_description: data.meta_description,
            meta_title: data.title,
            stock_brows: stock_brows_update,
        });

        await this.bookCateRepository.delete({
            book: checkBook,
        });
        if (checkCate && checkCate.length > 0) {
            checkCate.forEach(async (cate) => {
                const cateBookSave = this.bookCateRepository.create({
                    cate: cate,
                    book: checkBook,
                });
                await this.bookCateRepository.save(cateBookSave);
            });
        }

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
        const book: Book | null = await this.bookRepository.findOne({
            relations: ['images', 'categories.cate'],
            where: {
                slug: slug,
            },
        });
        if (!book) {
            throw new HttpException('Book không tồn tại trong hệ thống!', HttpStatus.BAD_REQUEST);
        }

        book.images = book.images.filter((item) => item.is_active);
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

    async handleSearchBook(q: string, cate: string, is_stock: string, options: IPaginationOptions): Promise<any> {
        const conditions = {
            is_active: true,
            stock_brows: MoreThanOrEqual(0),
        };

        let cateArr: number[] | null = null;
        if (cate !== 'all') {
            try {
                if (Array.isArray(JSON?.parse(cate))) {
                    cateArr = JSON.parse(cate);
                }
            } catch (error) {
                console.log('error', error);
            }
        }

        if (is_stock !== 'true') {
            conditions.stock_brows = MoreThan(0);
        }

        const books = await paginate<Book>(this.bookRepository, options, {
            order: {
                count_borrow_books: 'DESC',
            },
            where: {
                ...conditions,
                title: Like(`%${q}%`),
            },
            relations: ['categories.cate'],
            select: [
                'id',
                'title',
                'thumbnail_url',
                'slug',
                'stock',
                'count_borrow_books',
                'description',
                'meta_description',
            ],
        });

        const bookFirst = {
            items: [...books.items],
            meta: books.meta,
            links: books.links,
        };

        if (cateArr && cateArr.length > 0) {
            const booksFilter = books.items.filter((item) => {
                if (item.categories && item.categories.length > 0) {
                    return item.categories.find((itemChild) => {
                        return cateArr.find((childIdCate) => {
                            return childIdCate === itemChild.cate.id;
                        });
                    });
                }
            });
            bookFirst.items = booksFilter;
        }

        return bookFirst;
    }

    async relationBooks(slug: string, options: IPaginationOptions): Promise<any> {
        const book = await this.bookRepository.findOne({
            where: {
                slug: slug,
            },
        });

        if (!book) {
            return paginate<Book>(this.bookRepository, options, {
                order: {
                    count_borrow_books: 'DESC',
                },
                where: {
                    is_active: true,
                },
            });
        }

        const booksCate = await this.bookCateRepository.find({
            where: {
                book: book,
            },
            relations: ['cate'],
        });

        if (booksCate && booksCate.length === 0) {
            return paginate<Book>(this.bookRepository, options, {
                order: {
                    count_borrow_books: 'DESC',
                },
                where: {
                    is_active: true,
                },
            });
        }

        const books = await paginate<Book>(this.bookRepository, options, {
            order: {
                count_borrow_books: 'DESC',
            },
            where: {
                is_active: true,
            },
            relations: ['categories.cate'],
            select: [
                'id',
                'title',
                'thumbnail_url',
                'slug',
                'stock',
                'count_borrow_books',
                'description',
                'meta_description',
            ],
        });
        const booksResponse = {
            items: books.items,
            meta: books.meta,
            links: books.links,
        };

        booksResponse.items = booksResponse.items.filter((item) => {
            if (item.categories && item.categories.length > 0) {
                return item.categories.find((itemChild) => {
                    return booksCate.find((childIdCate) => {
                        return childIdCate.cate.id === itemChild.cate.id;
                    });
                });
            }
        });
        return booksResponse;
    }

    async lineChartAdmin(): Promise<number[]> {
        const monthlyCounts: number[] = Array(12).fill(0);
        const results = await this.bookRepository
            .createQueryBuilder()
            .select('MONTH(created_At) as month, COUNT(*) as count')
            .groupBy('month')
            .getRawMany();

        results.forEach((result) => {
            const month = result.month - 1;
            monthlyCounts[month] = parseInt(result.count);
        });
        return monthlyCounts;
    }
}
