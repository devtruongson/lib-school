import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService as MailerServiceConfig } from '@nestjs-modules/mailer';
import { IDataSendBookNews, IDataSendMailUser, IVerifyAccount } from 'src/utils/interface';

@Injectable()
export class MailerService {
    constructor(private readonly mailerService: MailerServiceConfig) {}

    sendEmailForgotPassword(info: any): Promise<any> {
        try {
            return this.mailerService.sendMail({
                to: info.email,
                subject: info.subject,
                from: info.from,
                html: `

            <h1 class="text-center">Xin Chào Quý Khách</h1>
            <p class="text-center">Có Phải Bạn Đã Thực Hiện Hành Động Quên Mật Khẩu?</p>
            <span>Có phải email của bạn là : ${info.email} ?</span>

            <p>Đưới đây là mã OTP của bạn : <strong>${info.code}</strong></p>
            </p>

            <br />
            <br />
            <br />
            
            <h1 class="text-center">Hello Guest</h1>
            <p class="text-center">Did You Take Action and Forgot Your Password?</p>
            <span>Is your email : ${info.email} ?</span>

            <p>Here is your OTP code: <strong>${info.code}</strong></p>
            </p>

            <br />
            <br />
            <p>Please do not respond to this email | Vui lòng không phản hồi lại email này!</p>
        `,
            });
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'An error occurred, please try again | Có lỗi xảy ra vui lòng thử lại!',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    emailVerifyAccount(data: IVerifyAccount): Promise<any> {
        try {
            return this.mailerService.sendMail({
                to: data.email,
                subject: 'Email Xác Thực Tài Khoản',
                from: 'Vui lòng không trả lời email này!',
                html: `

            <h1 class="text-center">Xin Chào Quý Khách</h1>
            <p class="text-center">Bạn Nhận Được Email Này Để Xác Thực Tài Khoản Của Mình!</p>
            <span>Có phải email của bạn là : ${data.email} ?</span>

            <div>
                <p>Bạn Hãy Click Vào URL Sau Để Xác Thực Tài Khoản Của Mình</p>
                <a href="${data.token_url}">Tại Đây</a>
            </div>

            <br />
            <br />
            <p>Please do not respond to this email | Vui lòng không phản hồi lại email này!</p>
        `,
            });
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'An error occurred, please try again | Có lỗi xảy ra vui lòng thử lại!',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    sendEmailWithUSer(data: IDataSendMailUser): Promise<any> {
        return this.mailerService.sendMail({
            to: data.email,
            subject: 'Thư Mới',
            from: 'Vui lòng không trả lời email này!',
            html: data.html,
        });
    }

    sendEmailWithManyUSer(data: { email: string[]; html: string }): Promise<any> {
        return this.mailerService.sendMail({
            to: data.email,
            subject: 'FstackLib',
            from: 'Vui lòng không trả lời email này!',
            html: data.html,
        });
    }

    notifyBookNews(data: IDataSendBookNews): Promise<any> {
        return this.mailerService.sendMail({
            to: data.emails,
            subject: 'Thư Mới',
            from: 'Vui lòng không trả lời email này!',
            html: data.html,
        });
    }
}
