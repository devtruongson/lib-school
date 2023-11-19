import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { UserNotExitsException } from 'src/helpers/exceptions';
import { sendResponse } from 'src/helpers/sendResponse';
import { MailerService } from 'src/mailer/mailer.service';
import { Book } from 'src/typeorm/entities/Book';
import { Order } from 'src/typeorm/entities/Order';
import { User } from 'src/typeorm/entities/User';
import { IJwtPayload, IRes } from 'src/utils/interface';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { createOrderDTO } from './dto/createOrder.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        private readonly mailService: MailerService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_6AM)
    async handleNotifyOrderBookAboutToExpire() {
        const dateNow: Date = new Date();
        const orders = await this.orderRepository.find({
            where: {
                expire_give_book: LessThan(dateNow),
            },
            relations: ['user', 'book'],
        });

        if (orders && orders.length) {
            const dataBuildEmail: string[] = orders.map((item) => item.user.email);
            await this.mailService.sendEmailWithManyUSer({
                email: dataBuildEmail,
                html: `
                    <h1>Thông Báo Quá Hạn Trả Sách</h1>
                    <p>Chúng Tôi Rất Tiếc Phải Thông Báo Với Bạn Rằng Bạn Đã Có Sách Quá Hạn Trả</p>
                    <div>
                        <div>
                            <h4>Để Biết Thông Tin Sách Quá Hạn Vui Lòng Truy Cập <a href="http://localhost:3000/order/expire">Tại đây</a></h4>
                        </div>
                    </div>
                    <div>
                        <blockquote>Theo chính sách của chúng tôi nếu bạn không hoàn trả sách thì bạn không thể mượn mới!</blockquote>
                        <pre>Để đảm bảo rằng bạn có thể mượn sách tiếp bạn hãy hoàn trả sách vẫn còn đang tồn đọng chưa trả nhé!</pre>
                        <div>
                            Vui Lòng Không Phản Hồi Thư Này "FstackLib"
                        </div>
                    </div>
                `,
            });
        }
    }

    async getAllOrder(filter: string, req: Request, options: IPaginationOptions): Promise<Pagination<Order>> {
        const user_token = req.user as IJwtPayload;

        const userCheck: User | null = await this.userRepository.findOne({
            where: {
                id: user_token.id,
            },
        });

        if (!userCheck) {
            throw new UserNotExitsException();
        }

        const dateNow: Date = new Date();
        switch (filter) {
            case 'expires': {
                return paginate<Order>(this.orderRepository, options, {
                    where: {
                        user: userCheck,
                        expire_give_book: LessThan(dateNow),
                    },
                });
            }

            case 'not-expires': {
                return paginate<Order>(this.orderRepository, options, {
                    where: {
                        user: userCheck,
                        expire_give_book: MoreThan(dateNow),
                    },
                });
            }

            default: {
                return paginate<Order>(this.orderRepository, options, {
                    where: {
                        user: userCheck,
                    },
                });
            }
        }
    }

    async checkIsValid(req: Request): Promise<IRes> {
        const user_token = req.user as IJwtPayload;

        const userCheck: User | null = await this.userRepository.findOne({
            where: {
                id: user_token.id,
            },
        });

        if (!userCheck) {
            throw new UserNotExitsException();
        }
        const dateNow: Date = new Date();
        const orderExpire = await this.orderRepository.findOne({
            where: {
                user: userCheck,
                expire_give_book: LessThan(dateNow),
                is_give_book_back: false,
            },
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: {
                is_valid: orderExpire ? false : true,
            },
        });
    }

    async createOrder(req: Request, data: createOrderDTO): Promise<IRes> {
        const check_user_valid = await this.checkIsValid(req);
        if (!check_user_valid.data.is_valid) {
            throw new BadRequestException();
        }
        const user_token = req.user as IJwtPayload;
        // Khi Tìm Kiếm User Ở Đây Không Cần Phải Check User Find One Là Null Vì Chắc Chắn Có
        const user_check: User = await this.userRepository.findOne({
            where: {
                id: user_token.id,
            },
        });
        const bookCheck: Book | null = await this.bookRepository.findOne({
            where: {
                id: data.books,
            },
        });

        if (!bookCheck) {
            throw new BadRequestException();
        }

        if (bookCheck.stock_brows === 0) {
            throw new HttpException('Bạn vui lòng chọn sách khác vì sách bạn mượn đã hết!', HttpStatus.BAD_REQUEST);
        }

        await this.bookRepository.update(bookCheck.id, {
            stock_brows: bookCheck.stock_brows - 1,
            count_borrow_books: bookCheck.count_borrow_books + 1,
        });

        const orderCreate = this.orderRepository.create({
            is_give_book_back: false,
            time_order: new Date(),
            expire_give_book: new Date(new Date().getTime() + 24 * 60 * 60 * 6 * 1000),
            user: user_check,
            book: bookCheck,
        });
        const orderSave = await this.orderRepository.save(orderCreate);
        delete orderCreate.user.password;
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: orderSave,
        });
    }
}
