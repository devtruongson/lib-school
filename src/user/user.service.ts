import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/typeorm/entities/User';
import { IJwtPayload, IRes } from 'src/utils/interface';
import { Repository } from 'typeorm';
import { userSessionSerializerDTO } from './dto/userSessionSerializerDTO';
import { sendEmailUserDTO } from './dto/sendEmailUser.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { sendResponse } from 'src/helpers/sendResponse';
import { sendEmailManyUserDTO } from './dto/sendEmailManyUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly mailService: MailerService,
    ) {}

    async getCurrentRole(req: Request) {
        const user = req.user as IJwtPayload;

        const checkUser = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });

        if (!checkUser) {
            throw new ForbiddenException();
        }

        return {
            id: checkUser.id,
            role: checkUser.role,
            is_login_fire_base: checkUser.is_login_fire_base,
            is_verify_email: checkUser.is_verify_email,
        };
    }

    async getAllUsers(options: IPaginationOptions): Promise<Pagination<User>> {
        const paginatedUsers = await paginate<User>(this.userRepository, options);
        const usersDTO = paginatedUsers.items.map((user) => new userSessionSerializerDTO(user)) as User[];
        return {
            items: usersDTO,
            meta: paginatedUsers.meta,
            links: paginatedUsers.links,
        };
    }

    async sendEmailUser(data: sendEmailUserDTO): Promise<IRes> {
        try {
            await this.mailService.sendEmailWithUSer(data);

            return sendResponse({
                statusCode: HttpStatus.OK,
                message: 'Bạn Đã Gửi Thành Công!',
            });
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async sendEmailManyUser(sendEmailManyUser: sendEmailManyUserDTO): Promise<IRes> {
        try {
            await this.mailService.sendEmailWithManyUSer(sendEmailManyUser);
            return sendResponse({
                statusCode: HttpStatus.OK,
                message: 'Bạn Đã Gửi Thành Công!',
            });
        } catch (error) {
            throw new BadRequestException();
        }
    }
}
