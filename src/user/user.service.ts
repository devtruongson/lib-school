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
import { UserNotExitsException } from 'src/helpers/exceptions';
import { updateUserDTO } from './dto/updateUser.dto';
import { Profile } from 'src/typeorm/entities/Profile';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
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

    async getCurrentUser(req: Request): Promise<IRes> {
        const user_token = req.user as IJwtPayload;

        const user_check: User | null = await this.userRepository.findOne({
            where: {
                id: user_token.id,
            },
            relations: ['profile'],
        });

        if (!user_check) {
            throw new UserNotExitsException();
        }

        const userSerializer = new userSessionSerializerDTO(user_check);
        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: userSerializer,
        });
    }

    async handleCheckProfileValid(req: Request): Promise<IRes> {
        const user_payload = req.user as IJwtPayload;

        const userCheck: User | null = await this.userRepository.findOne({
            where: {
                id: user_payload.id,
            },
            relations: ['profile'],
        });

        if (!userCheck) {
            throw new UserNotExitsException();
        }

        if (!userCheck.profile) {
            return sendResponse({
                statusCode: HttpStatus.OK,
                message: 'ok',
                data: {
                    is_valid: false,
                },
            });
        }

        let is_valid = true;

        const filedata = [
            userCheck.id,
            userCheck.email,
            userCheck.fistName,
            userCheck.lastName,
            userCheck.is_verify_email,
            userCheck.lastName,
            userCheck.profile.address,
            userCheck.profile.avatar_url,
            userCheck.profile.birthday,
            userCheck.profile.class,
            userCheck.profile.phoneNumber,
            userCheck.profile.school,
        ];

        for (let i = 0; i < filedata.length; i++) {
            if (!filedata[i]) {
                is_valid = false;
                break;
            }
        }

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
            data: {
                is_valid: is_valid,
            },
        });
    }

    async handleUpdateUser(req: Request, data: updateUserDTO): Promise<IRes> {
        const user_payload = req.user as IJwtPayload;

        const userCheck: User | null = await this.userRepository.findOne({
            where: {
                id: user_payload.id,
            },
            relations: ['profile'],
        });

        if (!userCheck) {
            throw new UserNotExitsException();
        }

        if (!userCheck.profile) {
            const profileCreate = this.profileRepository.create({
                ...data.profile,
            });
            const profileSave = await this.profileRepository.save(profileCreate);
            await this.userRepository.update(userCheck.id, {
                profile: profileSave,
            });
        } else {
            await this.profileRepository.update(userCheck.profile.id, {
                ...data.profile,
            });
        }

        await this.userRepository.update(userCheck.id, {
            fistName: data.user.firstName,
            lastName: data.user.lastName,
        });

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'ok',
        });
    }

    async lineChartAdmin(): Promise<number[]> {
        const monthlyCounts: number[] = Array(12).fill(0);
        const results = await this.userRepository
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
