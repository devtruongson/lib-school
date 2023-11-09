import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { editFileName, imageFileFilter } from 'src/utils/upload-image';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createDTO } from './dto/create.dto';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post('')
    @UseInterceptors(
        FilesInterceptor('images[]', 20, {
            storage: diskStorage({
                destination: './files/images/app/book',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async createBook(@Body() createData: createDTO, @UploadedFiles() files: Express.Multer.File[]): Promise<any> {
        if (!files.length) {
            throw new HttpException('Bạn phải tải ít nhất 1 ảnh!', HttpStatus.BAD_REQUEST);
        }
        return this.bookService.createBook(createData, files);
    }
}
