import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as MailerModuleConfig } from '@nestjs-modules/mailer';

@Module({
    imports: [
        MailerModuleConfig.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                service: 'gmail',
                auth: {
                    user: 'truongsonpt.80@gmail.com',
                    pass: 'ybjmuwqxsohznaow',
                },
            },
        }),
    ],
    controllers: [MailerController],
    providers: [MailerService],
})
export class MailerModule {}
