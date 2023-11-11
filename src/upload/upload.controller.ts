import { Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/upload-image';
import { diskStorage } from 'multer';
import { sendResponse } from 'src/helpers/sendResponse';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('/')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './files/images/app/upload',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async uploadedFile(@UploadedFile() file: Express.Multer.File) {
        const response = {
            ...file,
        };

        return sendResponse({
            statusCode: HttpStatus.OK,
            message: 'Bạn đã upload thành công!',
            data: response,
        });
    }

    @Get('/folder/app/:imgpath/:folder')
    seeUploadedImage(@Param('imgpath') image: string, @Param('folder') folder: string, @Res() res: Response) {
        if (!folder || !image) {
            return sendResponse({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Tên Ảnh Và Thư Mục Không Được Để Trống',
            });
        }
        return res.sendFile(image, { root: `./files/images/app/${folder}` });
    }
}
