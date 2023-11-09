import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/typeorm/entities/User';
import { IJwtPayload } from 'src/utils/interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

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
            is_login_fire_base: checkUser.is_login_fire_base,
            is_verify_email: checkUser.is_verify_email,
        };
    }
}
